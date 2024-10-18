const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  minPurchase: Number,
  maxDiscount: Number,
  usageLimit: Number,
  usedCount: {
    type: Number,
    default: 0
  },
  expiryDate: Date,
  isActive: {
    type: Boolean,
    default: true
  }
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
