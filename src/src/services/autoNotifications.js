// src/services/autoNotifications.js
const db = require('../services/database');

module.exports.checkUserServices = async (bot) => {
    const users = await db.collection('users').find({}).toArray();

    users.forEach(async user => {
        const services = await db.collection('services').find({ userId: user.telegramId }).toArray();

        services.forEach(service => {
            const expireDate = new Date(service.expireDate);
            const now = new Date();

            if (expireDate - now <= 3 * 24 * 60 * 60 * 1000) {  // 3 روز تا انقضا
                bot.sendMessage(user.telegramId, 'سرویس شما در حال انقضا است. لطفاً آن را تمدید کنید.');
            }
        });

        if (user.walletBalance < 5000) {  // اگر موجودی کمتر از 5000 تومان باشد
            bot.sendMessage(user.telegramId, 'موجودی کیف پول شما کم است. لطفاً آن را شارژ کنید.');
        }
    });
};
