const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  isAdmin: { type: Boolean, default: false },
  marzbanUsername: String,
  // Add other fields as needed
});

module.exports = mongoose.model('User', userSchema);
