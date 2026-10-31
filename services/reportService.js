const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");

const getDateFilter = (from, to, field) => {
  const filter = {};

  if (from || to) {
    filter[field] = {};

    if (from) filter[field].$gte = new Date(from);
    if (to) filter[field].$lte = new Date(to);
  }

  return filter;
};

const getDateRange = (from, to) => {
  const range = {};

  if (from || to) {
    range.createdAt = {};

    if (from) range.createdAt.$gte = new Date(from);
    if (to) range.createdAt.$lte = new Date(to);
  }

  return range;
};

exports.getDashboardSummary = async (query) => {
  const dateFilter = getDateRange(query.from, query.to);

  const [
    activeSubscriptions,
    subscriptionStatusCounts,
    invoiceSummary,
    paymentSummary,
    overdueSummary
  ] = await Promise.all([
    Subscription.countDocuments({
      status: "Active",
      ...dateFilter
    }),

    Subscription.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),

    Invoice.aggregate([
      { $match: { ...dateFilter, isCancelled: { $ne: true } } },
      {
        $group: {
          _id: null,
          totalInvoiced: { $sum: "$totalAmount" },
          invoiceCount: { $sum: 1 }
        }
      }
    ]),

    Payment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          paymentsReceived: { $sum: "$amount" },
          paymentCount: { $sum: 1 }
        }
      }
    ]),

    Invoice.aggregate([
      {
        $match: {
          isCancelled: { $ne: true },
          status: { $ne: "Paid" },
          dueDate: { $lt: new Date() },
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          overdueAmount: { $sum: "$totalAmount" },
          overdueInvoiceCount: { $sum: 1 }
        }
      }
    ])
  ]);

  const paidAmount = paymentSummary[0]?.paymentsReceived || 0;
  const totalInvoiced = invoiceSummary[0]?.totalInvoiced || 0;

  return {
    activeSubscriptions,
    totalRevenue: paidAmount,
    paymentsReceived: paidAmount,
    outstandingPayments: Math.max(0, totalInvoiced - paidAmount),
    overduePayments: overdueSummary[0]?.overdueAmount || 0,
    overdueInvoiceCount: overdueSummary[0]?.overdueInvoiceCount || 0,
    totalInvoiced,
    invoiceCount: invoiceSummary[0]?.invoiceCount || 0,
    paymentCount: paymentSummary[0]?.paymentCount || 0,
    subscriptionCountByStatus: subscriptionStatusCounts
  };
};

exports.getRevenueSummary = async (query) => {
  const match = {};

  if (query.from || query.to) {
    match.paymentDate = {};

    if (query.from) match.paymentDate.$gte = new Date(query.from);
    if (query.to) match.paymentDate.$lte = new Date(query.to);
  }

  const grouping = query.groupBy || "month";

  let dateFormat = "%Y-%m";

  if (grouping === "day") dateFormat = "%Y-%m-%d";
  if (grouping === "year") dateFormat = "%Y";

  return Payment.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: "$paymentDate"
          }
        },
        revenue: { $sum: "$amount" },
        paymentCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        period: "$_id",
        revenue: 1,
        paymentCount: 1
      }
    }
  ]);
};

exports.getActiveSubscriptions = async (query) => {
  const filter = { status: "Active" };

  if (query.from || query.to) {
    filter.createdAt = {};

    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  return Subscription.find(filter)
    .select("subscriptionNumber customer plan startDate expiryDate status totalAmount")
    .populate("customer", "name email")
    .populate("plan", "name price billingInterval")
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(query.limit) || 100, 500));
};

exports.getOutstandingInvoices = async (query) => {
  const filter = {
    isCancelled: { $ne: true },
    status: { $ne: "Paid" }
  };

  if (query.from || query.to) {
    filter.dueDate = {};

    if (query.from) filter.dueDate.$gte = new Date(query.from);
    if (query.to) filter.dueDate.$lte = new Date(query.to);
  }

  return Invoice.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "invoice",
        as: "payments"
      }
    },
    {
      $addFields: {
        paidAmount: { $sum: "$payments.amount" },
        outstandingAmount: {
          $max: [
            0,
            {
              $subtract: [
                "$totalAmount",
                { $sum: "$payments.amount" }
              ]
            }
          ]
        },
        overdue: { $lt: ["$dueDate", new Date()] }
      }
    },
    {
      $project: {
        invoiceNumber: 1,
        customer: 1,
        totalAmount: 1,
        dueDate: 1,
        status: 1,
        paidAmount: 1,
        outstandingAmount: 1,
        overdue: 1
      }
    },
    { $sort: { dueDate: 1 } },
    { $limit: Math.min(Number(query.limit) || 100, 500) }
  ]);
};
