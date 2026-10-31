const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    subscriptionNumber: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date },
    paymentTerms: { type: String, default: "Due on receipt" },
    lines: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        taxRate: { type: Number, default: 0, min: 0 },
        amount: { type: Number, required: true, min: 0 }
      }
    ],
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Quotation", "Confirmed", "Active", "Closed"],
      default: "Draft"
    },
    quotationValidUntil: { type: Date },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
