const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  server: {
    type: String,
    required: true
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

packageSchema.statics.getAllActivePackages = function() {
  return this.find({ isActive: true });
};

packageSchema.statics.getPackageById = function(id) {
    return this.findById(id);
  };
  
  const Package = mongoose.model('Package', packageSchema);
  
  module.exports = Package;
  
  