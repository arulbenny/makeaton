const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ["active", "pending", "cancelled", "expired"],
    default: "pending"
  },
  autoRenew: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
