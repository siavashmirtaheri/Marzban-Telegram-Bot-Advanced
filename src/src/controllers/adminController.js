const { adminMainMenu, channelManagementMenu } = require('../utils/keyboards');
const channelModel = require('../models/channelModel');

class AdminController {
  static async handleCommand(bot, msg) {
    const chatId = msg.chat.id;
    if (msg.text === '/admin') {
      await this.sendMainMenu(bot, chatId);
    }
  }

  static async handleCallback(bot, callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    switch (data) {
      case 'manage_users':
        await this.manageUsers(bot, chatId);
        break;
      case 'manage_channels':
        await this.showChannelManagementMenu(bot, chatId);
        break;
      case 'statistics':
        await this.showStatistics(bot, chatId);
        break;
      case 'bot_settings':
        await this.showBotSettings(bot, chatId);
        break;
      case 'add_channel':
        await this.addChannel(bot, chatId);
        break;
      case 'remove_channel':
        await this.removeChannel(bot, chatId);
        break;
      case 'list_channels':
        await this.listChannels(bot, chatId);
        break;
      case 'back_to_admin_main':
        await this.sendMainMenu(bot, chatId);
        break;
      default:
        bot.answerCallbackQuery(callbackQuery.id, 'عملیات نامعتبر');
    }
  }

  static async sendMainMenu(bot, chatId) {
    bot.sendMessage(chatId, 'پنل مدیریت. لطفاً یک گزینه را انتخاب کنید:', adminMainMenu);
  }

  static async showChannelManagementMenu(bot, chatId) {
    bot.sendMessage(chatId, 'مدیریت کانال‌ها. لطفاً یک گزینه را انتخاب کنید:', channelManagementMenu);
  }

  static async manageUsers(bot, chatId) {
    // اینجا منطق مدیریت کاربران را پیاده‌سازی کنید
    bot.sendMessage(chatId, 'بخش مدیریت کاربران');
  }

  static async showStatistics(bot, chatId) {
    // اینجا منطق نمایش آمار و گزارشات را پیاده‌سازی کنید
    bot.sendMessage(chatId, 'آمار و گزارشات:');
  }

  static async showBotSettings(bot, chatId) {
    // اینجا منطق نمایش و تغییر تنظیمات ربات را پیاده‌سازی کنید
    bot.sendMessage(chatId, 'تنظیمات ربات:');
  }

  static async addChannel(bot, chatId) {
    // اینجا منطق افزودن کانال را پیاده‌سازی کنید
    bot.sendMessage(chatId, 'لطفاً نام کاربری کانال را وارد کنید:');
  }

  static async removeChannel(bot, chatId) {
    // اینجا منطق حذف کانال را پیاده‌سازی کنید
    const channels = await channelModel.getRequiredChannels();
    // نمایش لیست کانال‌ها برای انتخاب و حذف
  }

  static async listChannels(bot, chatId) {
    const channels = await channelModel.getRequiredChannels();
    const channelList = channels.map(channel => `@${channel.username}`).join('\n');
    bot.sendMessage(chatId, `کانال‌های الزامی:\n${channelList}`);
  }
}

module.exports = AdminController;
