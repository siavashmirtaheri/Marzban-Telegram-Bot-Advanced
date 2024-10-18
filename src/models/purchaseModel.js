// src/models/purchaseModel.js

const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
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
  marzbanUsername: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
});

purchaseSchema.statics.createPurchase = async function(purchaseData, session) {
  return this.create([purchaseData], { session: session });
};

purchaseSchema.statics.createPendingPurchase = async function(userId, packageId) {
  return this.create({
    userId,
    packageId,
    status: 'pending',
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  });
};

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
