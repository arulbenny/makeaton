const Discount = require("../models/Discount");
const Invoice = require("../models/Invoice");
const Subscription = require("../models/Subscription");

const isEligible = (discount, invoice, subscription) => {
  const now = new Date();

  if (!discount.active) return false;
  if (now < discount.startDate || now > discount.endDate) return false;

  if (
    discount.usageLimit !== null &&
    discount.usageCount >= discount.usageLimit
  ) {
    return false;
  }

  if (invoice.subtotal < discount.minimumPurchaseAmount) return false;

  const quantity = (invoice.lines || []).reduce(
    (sum, line) => sum + Number(line.quantity || 0),
    0
  );

  if (quantity < discount.minimumQuantity) return false;

  if (discount.scope === "Product") {
    if (!discount.product) return false;

    return invoice.lines.some(
      (line) =>
        String(line.product?._id || line.product) === String(discount.product)
    );
  }

  return Boolean(subscription);
};

const calculateDiscount = (discount, invoice) => {
  let eligibleSubtotal = invoice.subtotal;

  if (discount.scope === "Product" && discount.product) {
    eligibleSubtotal = (invoice.lines || [])
      .filter(
        (line) =>
          String(line.product?._id || line.product) === String(discount.product)
      )
      .reduce((sum, line) => sum + Number(line.amount || 0), 0);
  }

  let amount =
    discount.type === "Percentage"
      ? eligibleSubtotal * (discount.value / 100)
      : discount.value;

  amount = Math.min(amount, eligibleSubtotal);
  return Math.max(0, Math.round(amount * 100) / 100);
};

exports.createDiscount = async (data) => {
  if (new Date(data.endDate) < new Date(data.startDate)) {
    throw new Error("End date must be on or after start date");
  }

  if (data.type === "Percentage" && data.value > 100) {
    throw new Error("Percentage discount cannot exceed 100");
  }

  if (data.type === "Fixed" && data.value < 0) {
    throw new Error("Fixed discount cannot be negative");
  }

  if (data.scope === "Product" && !data.product) {
    throw new Error("Product is required for product-level discounts");
  }

  return Discount.create(data);
};

exports.getDiscounts = async () => Discount.find().populate("product");

exports.getDiscountById = async (id) => {
  const discount = await Discount.findById(id).populate("product");
  if (!discount) throw new Error("Discount not found");
  return discount;
};

exports.updateDiscount = async (id, data) => {
  const discount = await Discount.findById(id);
  if (!discount) throw new Error("Discount not found");

  if (discount.usageCount > 0) {
    delete data.usageCount;
  }

  Object.assign(discount, data);
  return discount.save();
};

exports.applyDiscountToInvoice = async (invoiceId, discountId) => {
  const invoice = await Invoice.findById(invoiceId).populate("lines.product");

  if (!invoice) throw new Error("Invoice not found");
  if (invoice.isCancelled) throw new Error("Cannot discount cancelled invoice");
  if (invoice.status !== "Draft") {
    throw new Error("Discount can only be applied to a Draft invoice");
  }

  if (invoice.discountApplied) {
    throw new Error("A discount has already been applied to this invoice");
  }

  const discount = await Discount.findById(discountId);
  if (!discount) throw new Error("Discount not found");

  const subscription = await Subscription.findById(invoice.subscription);

  if (!isEligible(discount, invoice, subscription)) {
    throw new Error("Discount is not eligible");
  }

  const discountAmount = calculateDiscount(discount, invoice);

  if (discountAmount <= 0) {
    throw new Error("Discount amount must be greater than zero");
  }

  invoice.discount = discount._id;
  invoice.discountAmount = discountAmount;
  invoice.totalAmount = Math.max(
    0,
    invoice.subtotal + invoice.taxAmount - discountAmount
  );
  invoice.discountApplied = true;

  await invoice.save();

  discount.usageCount += 1;

  if (
    discount.usageLimit !== null &&
    discount.usageCount >= discount.usageLimit
  ) {
    discount.active = false;
  }

  await discount.save();

  return invoice;
};

exports.applyEligibleDiscounts = async (invoiceId) => {
  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) throw new Error("Invoice not found");
  if (invoice.discountApplied) return invoice;

  const subscription = await Subscription.findById(invoice.subscription);
  const discounts = await Discount.find({ active: true });

  for (const discount of discounts) {
    if (isEligible(discount, invoice, subscription)) {
      return exports.applyDiscountToInvoice(invoiceId, discount._id);
    }
  }

  return invoice;
};
