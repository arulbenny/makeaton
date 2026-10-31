const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: "" },
  price: { type: Number, required: true, min: 0 },
  billingInterval: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true
  },
  minimumQuantity: { type: Number, required: true, min: 1, default: 1 },
  availabilityStart: { type: Date, required: true },
  availabilityEnd: { type: Date, default: null },
  autoClose: { type: Boolean, default: false },
  earlyClose: { type: Boolean, default: false },
  pause: { type: Boolean, default: true },
  renew: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);
