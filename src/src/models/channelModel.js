// src/models/channelModel.js

const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  channelId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  isRequired: {
    type: Boolean,
    default: true
  },
  // اضافه کردن فیلدهای دیگر مورد نیاز
});

channelSchema.statics.getRequiredChannels = function() {
  return this.find({ isRequired: true });
};

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
