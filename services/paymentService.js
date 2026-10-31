const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

const getPaymentTotal = async (invoiceId) => {
  const result = await Payment.aggregate([
    { $match: { invoice: invoiceId } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  return result[0]?.total || 0;
};

exports.createPayment = async (data) => {
  const invoice = await Invoice.findById(data.invoice);

  if (!invoice) throw new Error("Invoice not found");
  if (invoice.isCancelled) throw new Error("Cannot pay a cancelled invoice");

  if (invoice.status !== "Confirmed") {
    throw new Error("Invoice must be confirmed before payment");
  }

  const paymentAmount = Number(data.amount);

  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
    throw new Error("Payment amount must be greater than zero");
  }

  const paidSoFar = await getPaymentTotal(invoice._id);
  const outstanding = Math.max(0, invoice.totalAmount - paidSoFar);

  if (paymentAmount > outstanding) {
    throw new Error(`Payment exceeds outstanding balance of ${outstanding}`);
  }

  const payment = await Payment.create({
    ...data,
    customer: invoice.customer,
    paymentNumber: `PAY-${Date.now()}-${Math.floor(Math.random() * 100000)}`
  });

  const newPaidTotal = paidSoFar + paymentAmount;

  if (newPaidTotal >= invoice.totalAmount) {
    invoice.status = "Paid";
    invoice.paidAt = new Date();
  }

  await invoice.save();

  return payment;
};

exports.getPayments = async (user) => {
  const filter = user.role === "Customer" ? { customer: user._id } : {};

  return Payment.find(filter)
    .populate("invoice")
    .populate("customer", "name email")
    .sort({ paymentDate: -1 });
};

exports.getPaymentById = async (id, user) => {
  const payment = await Payment.findById(id)
    .populate("invoice")
    .populate("customer", "name email");

  if (!payment) throw new Error("Payment not found");

  if (
    user.role === "Customer" &&
    String(payment.customer._id) !== String(user._id)
  ) {
    throw new Error("Access denied");
  }

  return payment;
};

exports.getInvoiceBalance = async (invoiceId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new Error("Invoice not found");

  const paid = await getPaymentTotal(invoice._id);
  const outstanding = Math.max(0, invoice.totalAmount - paid);

  return {
    invoiceId: invoice._id,
    totalAmount: invoice.totalAmount,
    paidAmount: paid,
    outstandingAmount: outstanding,
    overdueAmount:
      outstanding > 0 && invoice.dueDate < new Date()
        ? outstanding
        : 0
  };
};
