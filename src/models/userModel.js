const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: Number, required: true, unique: true },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    createdAt: { type: Date, default: Date.now },
    // اضافه کردن فیلدهای دیگر مورد نیاز
});

const User = mongoose.model('User', userSchema);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

