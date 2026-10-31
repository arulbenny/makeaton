const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: { type: String, required: true, unique: true },
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
    method: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", "UPI", "Other"],
      required: true
    },
    amount: { type: Number, required: true, min: 0.01 },
    paymentDate: { type: Date, default: Date.now },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
