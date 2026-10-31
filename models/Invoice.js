const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    customerDetails: {
      name: { type: String, default: "" },
      email: { type: String, default: "" }
    },
    billingPeriodStart: { type: Date, required: true },
    billingPeriodEnd: { type: Date, required: true },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    lines: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        description: { type: String, default: "" },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        taxRate: { type: Number, default: 0, min: 0 },
        amount: { type: Number, required: true, min: 0 },
        taxAmount: { type: Number, required: true, min: 0 }
      }
    ],
    subtotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Draft", "Confirmed", "Paid"],
      default: "Draft"
    },
    isCancelled: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    paidAt: { type: Date },
    sentAt: { type: Date },
    billingInterval: { type: String, default: "monthly" }
  },
  { timestamps: true }
);

// Prevent more than one invoice for the same subscription billing period.
invoiceSchema.index(
  { subscription: 1, billingPeriodStart: 1, billingPeriodEnd: 1 },
  { unique: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);

