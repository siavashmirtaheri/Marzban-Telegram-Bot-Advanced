const User = require('../models/userModel');
const Wallet = require('../models/walletModel');
const { userMainMenu } = require('../utils/keyboards');

class UserController {
  static async handleStart(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
      let user = await User.findOne({ telegramId: userId });

      if (!user) {
        user = await User.create({
          telegramId: userId,
          username: msg.from.username,
          firstName: msg.from.first_name,
          lastName: msg.from.last_name
        });

        await Wallet.create({ userId: user._id });

        await bot.sendMessage(chatId, `سلام ${user.firstName}! به ربات ما خوش آمدید. یک حساب کاربری و کیف پول برای شما ایجاد شد.`);
      } else {
        await bot.sendMessage(chatId, `سلام ${user.firstName}! خوش برگشتید.`);
      }

      await bot.sendMessage(chatId, 'لطفاً یکی از گزینه‌های زیر را انتخاب کنید:', userMainMenu);
    } catch (error) {
      console.error('Error in handleStart:', error);
      await bot.sendMessage(chatId, 'متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    }
  }

  static async handleMainMenu(bot, query) {
    const chatId = query.message.chat.id;
    const action = query.data;

    switch (action) {
      case 'buy_service':
        await bot.sendMessage(chatId, 'لطفاً یکی از پکیج‌های زیر را انتخاب کنید:');
        // اینجا باید لیست پکیج‌ها را نمایش دهید
        break;
      case 'services':
        await bot.sendMessage(chatId, 'لیست سرویس‌های شما:');
        // اینجا باید لیست سرویس‌های کاربر را نمایش دهید
        break;
      case 'wallet':
        await bot.sendMessage(chatId, 'اطلاعات کیف پول شما:');
        // اینجا باید اطلاعات کیف پول کاربر را نمایش دهید
        break;
      case 'profile':
        await bot.sendMessage(chatId, 'اطلاعات پروفایل شما:');
        // اینجا باید اطلاعات پروفایل کاربر را نمایش دهید
        break;
      case 'support':
        await bot.sendMessage(chatId, 'برای ارتباط با پشتیبانی، لطفاً به @support_username پیام دهید.');
        break;
      case 'about':
        await bot.sendMessage(chatId, 'درباره ما: [اطلاعات درباره سرویس شما]');
        break;
      default:
        await bot.sendMessage(chatId, 'گزینه نامعتبر. لطفاً یکی از گزینه‌های منو را انتخاب کنید.');
    }
  }
}

module.exports = UserController;
