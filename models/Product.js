const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, trim: true },
  salesPrice: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, required: true, min: 0 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  salesPrice: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, required: true, min: 0 },
  notes: { type: String, trim: true, default: "" },
  variants: { type: [variantSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
