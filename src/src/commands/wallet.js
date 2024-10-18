const db = require('../services/database');

module.exports = async (bot, chatId, userId) => {
    const user = await db.collection('users').findOne({ telegramId: userId });
    if (!user) {
        return bot.sendMessage(chatId, 'کیف پول شما موجود نمی‌باشد.');
    }

    bot.sendMessage(chatId, `موجودی کیف پول شما: ${user.walletBalance} تومان`);

    const referralLink = `https://t.me/your_bot?start=${userId}`;
    bot.sendMessage(chatId, `لینک دعوت شما: ${referralLink}`);
};