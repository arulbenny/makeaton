const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

const addInterval = (date, interval) => {
  const result = new Date(date);
  const value = String(interval || "monthly").toLowerCase();

  if (value.includes("day")) {
    result.setDate(result.getDate() + (parseInt(value) || 1));
  } else if (value.includes("week")) {
    result.setDate(result.getDate() + 7 * (parseInt(value) || 1));
  } else if (value.includes("year") || value.includes("annual")) {
    result.setFullYear(result.getFullYear() + (parseInt(value) || 1));
  } else {
    result.setMonth(result.getMonth() + (parseInt(value) || 1));
  }

  return result;
};

const getInterval = (plan) => {
  const raw = plan.billingInterval || plan.billingPeriod || plan.interval || "monthly";
  const interval = String(raw).toLowerCase();

  if (interval.includes("daily")) return "daily";
  if (interval.includes("weekly")) return "weekly";
  if (interval.includes("year") || interval.includes("annual")) return "yearly";
  return "monthly";
};

const calculateTotals = (subscription) => {
  let subtotal = 0;
  let taxAmount = 0;

  const lines = (subscription.lines || []).map((line) => {
    const quantity = Number(line.quantity || 0);
    const unitPrice = Number(line.unitPrice || 0);
    const taxRate = Number(line.taxRate || 0);
    const amount = quantity * unitPrice;
    const tax = amount * taxRate / 100;

    subtotal += amount;
    taxAmount += tax;

    return {
      product: line.product,
      description: line.product?.name || "",
      quantity,
      unitPrice,
      taxRate,
      amount,
      taxAmount: tax
    };
  });

  return { lines, subtotal, taxAmount, totalAmount: subtotal + taxAmount };
};

const makeInvoiceNumber = () =>
  `INV-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

exports.createInvoice = async (data) => {
  if (!data.subscription) throw new Error("Subscription is required");

  const subscription = await Subscription.findById(data.subscription)
    .populate("customer", "name email")
    .populate("lines.product");

  if (!subscription) throw new Error("Subscription not found");
  if (subscription.status !== "Confirmed") {
    throw new Error("Only Confirmed subscriptions can be invoiced");
  }

  const start = new Date(data.billingPeriodStart || subscription.startDate || Date.now());
  const interval = getInterval(await Plan.findById(subscription.plan));
  const end = new Date(data.billingPeriodEnd || addInterval(start, interval));

  const existing = await Invoice.findOne({
    subscription: subscription._id,
    billingPeriodStart: start,
    billingPeriodEnd: end
  });

  if (existing) return existing;

  const totals = calculateTotals(subscription);
  const customer = subscription.customer;

  return Invoice.create({
    invoiceNumber: makeInvoiceNumber(),
    subscription: subscription._id,
    customer: customer._id,
    customerDetails: {
      name: customer.name || "",
      email: customer.email || ""
    },
    billingPeriodStart: start,
    billingPeriodEnd: end,
    invoiceDate: data.invoiceDate || new Date(),
    dueDate: data.dueDate || addInterval(new Date(), "30 days"),
    billingInterval: interval,
    ...totals
  });
};

exports.generateFromSubscription = async (subscriptionId, data = {}) => {
  return exports.createInvoice({
    ...data,
    subscription: subscriptionId
  });
};

exports.getAllInvoices = async (user) => {
  const filter = user.role === "Customer" ? { customer: user._id } : {};
  return Invoice.find(filter)
    .populate("customer", "name email")
    .populate("subscription")
    .populate("lines.product")
    .sort({ createdAt: -1 });
};

exports.getInvoiceById = async (id, user) => {
  if (!mongoose.isValidObjectId(id)) throw new Error("Invalid invoice ID");

  const invoice = await Invoice.findById(id)
    .populate("customer", "name email")
    .populate("subscription")
    .populate("lines.product");

  if (!invoice) throw new Error("Invoice not found");

  if (
    user.role === "Customer" &&
    String(invoice.customer._id) !== String(user._id)
  ) {
    throw new Error("Access denied");
  }

  return invoice;
};

exports.confirmInvoice = async (id) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) throw new Error("Invoice not found");
  if (invoice.isCancelled) throw new Error("Cancelled invoice cannot be confirmed");
  if (invoice.status !== "Draft") throw new Error("Only Draft invoices can be confirmed");

  invoice.status = "Confirmed";
  return invoice.save();
};

exports.cancelInvoice = async (id) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) throw new Error("Invoice not found");
  if (invoice.status === "Paid") throw new Error("Paid invoice cannot be cancelled");

  invoice.isCancelled = true;
  invoice.cancelledAt = new Date();
  return invoice.save();
};

exports.markInvoicePaid = async (id) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) throw new Error("Invoice not found");
  if (invoice.isCancelled) throw new Error("Cancelled invoice cannot be paid");
  if (invoice.status !== "Confirmed") {
    throw new Error("Only Confirmed invoices can be marked as paid");
  }

  invoice.status = "Paid";
  invoice.paidAt = new Date();
  return invoice.save();
};

exports.sendInvoice = async (id, user) => {
  const invoice = await exports.getInvoiceById(id, user);

  if (invoice.isCancelled) throw new Error("Cannot send a cancelled invoice");

  // Email delivery requires an email provider integration.
  // This endpoint records that the invoice was requested to be sent.
  invoice.sentAt = new Date();
  await invoice.save();

  return {
    message: "Invoice details prepared. Email delivery is not configured.",
    invoice
  };
};
