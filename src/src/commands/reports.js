// src/commands/reports.js
const db = require('../services/database');

module.exports.transactionReport = async (bot, chatId) => {
    const transactions = await db.collection('transactions').find({}).toArray();

    if (transactions.length === 0) {
        return bot.sendMessage(chatId, 'هیچ تراکنشی ثبت نشده است.');
    }

    transactions.forEach(transaction => {
        bot.sendMessage(chatId, `تراکنش: ${transaction.amount} تومان \nکاربر: ${transaction.userId}\n` +
            `وضعیت: ${transaction.status}\nتاریخ: ${transaction.date}`);
    });
};

module.exports.referralReport = async (bot, chatId, userId) => {
    const referrals = await db.collection('users').find({ referrerId: userId }).toArray();

    if (referrals.length === 0) {
        return bot.sendMessage(chatId, 'شما هیچ زیرمجموعه‌ای ندارید.');
    }

    referrals.forEach(referral => {
        bot.sendMessage(chatId, `کاربر: ${referral.telegramId}\nتاریخ ثبت‌نام: ${referral.registrationDate}`);
    });
};

module.exports.serviceReport = async (bot, chatId) => {
    const services = await db.collection('services').find({}).toArray();

    if (services.length === 0) {
        return bot.sendMessage(chatId, 'هیچ سرویسی ثبت نشده است.');
    }

    services.forEach(service => {
        bot.sendMessage(chatId, `سرویس: ${service.packageName}\nکاربر: ${service.userId}\n` +
            `تاریخ انقضا: ${service.expireDate}\nوضعیت: ${service.status}`);
    });
};
