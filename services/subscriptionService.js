const Subscription = require("../models/Subscription");
const Product = require("../models/Product");
const Plan = require("../models/Plan");

const buildLines = async (lines = []) => {
  let subtotal = 0;
  let taxAmount = 0;

  const processedLines = await Promise.all(
    lines.map(async (line) => {
      const product = await Product.findById(line.product);
      if (!product) throw new Error("Product not found");

      const quantity = Number(line.quantity);
      const unitPrice = Number(line.unitPrice ?? product.salesPrice ?? 0);
      const taxRate = Number(line.taxRate ?? 0);

      if (quantity < 1 || unitPrice < 0 || taxRate < 0) {
        throw new Error("Invalid subscription line values");
      }

      const amount = quantity * unitPrice;
      const tax = amount * taxRate / 100;

      subtotal += amount;
      taxAmount += tax;

      return {
        product: product._id,
        quantity,
        unitPrice,
        taxRate,
        amount
      };
    })
  );

  return {
    lines: processedLines,
    subtotal,
    taxAmount,
    totalAmount: subtotal + taxAmount
  };
};

exports.createSubscription = async (data) => {
  const plan = await Plan.findById(data.plan);
  if (!plan) throw new Error("Plan not found");

  const totals = await buildLines(data.lines || []);

  return Subscription.create({
    ...data,
    ...totals,
    subscriptionNumber: `SUB-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    status: "Draft"
  });
};

exports.getSubscriptions = async (user) => {
  const filter = user.role === "Customer" ? { customer: user._id } : {};
  return Subscription.find(filter)
    .populate("customer", "name email")
    .populate("plan")
    .populate("lines.product");
};

exports.getSubscription = async (id, user) => {
  const subscription = await Subscription.findById(id)
    .populate("customer", "name email")
    .populate("plan")
    .populate("lines.product");

  if (!subscription) throw new Error("Subscription not found");

  if (
    user.role === "Customer" &&
    String(subscription.customer._id) !== String(user._id)
  ) {
    throw new Error("Access denied");
  }

  return subscription;
};

exports.updateSubscription = async (id, data) => {
  const subscription = await Subscription.findById(id);
  if (!subscription) throw new Error("Subscription not found");

  if (data.lines) {
    const totals = await buildLines(data.lines);
    Object.assign(subscription, totals);
  }

  Object.assign(subscription, data);
  return subscription.save();
};

exports.transitionStatus = async (id, action, data = {}) => {
  const subscription = await Subscription.findById(id);
  if (!subscription) throw new Error("Subscription not found");

  const transitions = {
    quotation: "Quotation",
    confirm: "Confirmed",
    activate: "Active",
    close: "Closed"
  };

  if (!transitions[action]) throw new Error("Invalid status action");

  subscription.status = transitions[action];

  if (action === "quotation") {
    const validityDays = Number(data.validityDays || 15);
    subscription.quotationValidUntil = new Date(
      Date.now() + validityDays * 24 * 60 * 60 * 1000
    );
  }

  return subscription.save();
};

exports.renewSubscription = async (id, data = {}) => {
  const subscription = await Subscription.findById(id);
  if (!subscription) throw new Error("Subscription not found");

  const renewalDate = subscription.expiryDate || new Date();
  const durationDays = Number(data.durationDays || 30);

  subscription.startDate = renewalDate;
  subscription.expiryDate = new Date(
    renewalDate.getTime() + durationDays * 24 * 60 * 60 * 1000
  );
  subscription.status = "Active";

  return subscription.save();
};
