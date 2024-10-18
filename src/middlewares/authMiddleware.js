const User = require('../models/User');

const authMiddleware = async (bot, msg, next) => {
  const userId = msg.from.id;
  try {
    const user = await User.findOne({ telegramId: userId });
    if (user) {
      next();
    } else {
      bot.sendMessage(msg.chat.id, 'شما اجازه دسترسی به این بخش را ندارید.');
    }
  } catch (error) {
    console.error('Error in auth middleware:', error);
    bot.sendMessage(msg.chat.id, 'خطایی رخ داده است. لطفا دوباره تلاش کنید.');
  }
};

module.exports = authMiddleware;
