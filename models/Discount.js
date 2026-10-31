const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Fixed", "Percentage"],
      required: true
    },
    value: { type: Number, required: true, min: 0 },
    minimumPurchaseAmount: { type: Number, default: 0, min: 0 },
    minimumQuantity: { type: Number, default: 1, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: null, min: 1 },
    usageCount: { type: Number, default: 0 },
    scope: {
      type: String,
      enum: ["Product", "Subscription"],
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);
