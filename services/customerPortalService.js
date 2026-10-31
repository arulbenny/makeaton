const Subscription = require("../models/Subscription");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");

exports.getMySubscriptions = async (userId) => {
  return Subscription.find({ customer: userId })
    .populate("plan")
    .populate("lines.product")
    .sort({ createdAt: -1 });
};

exports.getMyInvoices = async (userId) => {
  return Invoice.find({ customer: userId, isCancelled: { $ne: true } })
    .populate("subscription")
    .populate("lines.product")
    .sort({ invoiceDate: -1 });
};

exports.getMyPayments = async (userId) => {
  return Payment.find({ customer: userId })
    .populate("invoice", "invoiceNumber totalAmount status dueDate")
    .sort({ paymentDate: -1 });
};

exports.getMySubscriptionStatus = async (userId) => {
  const subscriptions = await Subscription.find({ customer: userId })
    .select("subscriptionNumber status startDate expiryDate plan")
    .populate("plan", "name billingInterval");

  const counts = subscriptions.reduce((result, subscription) => {
    result[subscription.status] = (result[subscription.status] || 0) + 1;
    return result;
  }, {});

  return {
    totalSubscriptions: subscriptions.length,
    statusCounts: counts,
    subscriptions
  };
};
