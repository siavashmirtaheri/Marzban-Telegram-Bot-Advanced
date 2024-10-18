const Channel = require('../models/channelModel');

const channelCheckMiddleware = async (bot, msg, next) => {
  const userId = msg.from.id;
  const channels = await Channel.find({ isRequired: true });

  for (const channel of channels) {
    try {
      const chatMember = await bot.getChatMember(channel.channelId, userId);
      if (chatMember.status === 'left') {
        return bot.sendMessage(msg.chat.id, `لطفاً ابتدا در کانال ${channel.name} عضو شوید: ${channel.inviteLink}`);
      }
    } catch (error) {
      console.error('Error checking channel membership:', error);
    }
  }

  next();
};

module.exports = channelCheckMiddleware;
