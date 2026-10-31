const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  usageLimit: {
    type: Number,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Discount", discountSchema);
