const TelegramBot = require('node-telegram-bot-api');
const channelModel = require('../models/channelModel');
const config = require('../config/config');

class AuthService {
    static isAdmin(userId) {
        return config.adminIds.includes(userId);
    }
  static async checkMembership(bot, userId) {
    const channels = await channelModel.getRequiredChannels();
    
    for (const channel of channels) {
      try {
        const chatMember = await bot.getChatMember(channel.chatId, userId);
        if (chatMember.status === 'left' || chatMember.status === 'kicked') {
          return {
            isAllowed: false,
            notJoinedChannel: channel.username
          };
        }
      } catch (error) {
        console.error(`Error checking membership for channel ${channel.username}:`, error);
      }
    }
    
    return { isAllowed: true };
  }
}

module.exports = AuthService;
