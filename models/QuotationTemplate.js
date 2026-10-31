const mongoose = require("mongoose");

const quotationTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    validityDays: { type: Number, default: 15 },
    paymentTerms: { type: String, default: "Due on receipt" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuotationTemplate", quotationTemplateSchema);
