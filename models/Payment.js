const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ["card", "upi", "bank_transfer", "cash", "other"],
    default: "other"
  },
  transactionId: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  paymentDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
