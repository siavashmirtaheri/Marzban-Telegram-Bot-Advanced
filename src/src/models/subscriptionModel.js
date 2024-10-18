const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  remainingVolume: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  marzbanUsername: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

subscriptionSchema.statics.getActiveSubscriptionsByUserId = function(userId) {
  return this.find({ userId, isActive: true }).populate('packageId');
};

subscriptionSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
