// src/commands/adminNotifications.js
module.exports.sendNotification = async (bot, chatId) => {
    bot.sendMessage(chatId, 'پیام خود را برای ارسال به همه کاربران وارد کنید:');

    bot.once('message', async (msg) => {
        const message = msg.text;
        const users = await db.collection('users').find({}).toArray();

        users.forEach(user => {
            bot.sendMessage(user.telegramId, `پیام از مدیر: ${message}`);
        });

        bot.sendMessage(chatId, 'پیام با موفقیت به تمام کاربران ارسال شد.');
    });
};
