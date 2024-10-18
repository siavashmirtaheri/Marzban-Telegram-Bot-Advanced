// src/commands/userNotifications.js
module.exports.notifyUser = async (bot, userId, message) => {
    bot.sendMessage(userId, message);
};
