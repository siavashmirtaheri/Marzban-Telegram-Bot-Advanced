require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const UserController = require('./controllers/userController');
const WalletController = require('./controllers/walletController');
const PurchaseController = require('./controllers/purchaseController');
// ایجاد نمونه بات تلگرام
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// اتصال به MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// تعریف دستورات بات
bot.onText(/\/start/, (msg) => UserController.handleStart(bot, msg));

// پردازش callback query‌ها
bot.on('callback_query', async (query) => {
  const action = query.data;
  const chatId = query.message.chat.id;
  const userId = query.from.id;

  try {
    switch (action) {
      case 'buy_service':
        await PurchaseController.showPackages(bot, chatId);
        break;
      case 'wallet':
        await WalletController.showWallet(bot, chatId, userId);
        break;
      case 'charge_wallet':
        // اینجا باید منطق شارژ کیف پول را پیاده‌سازی کنید
        break;
      case 'transaction_history':
        await WalletController.showTransactionHistory(bot, chatId, userId);
        break;
      case 'main_menu':
        await UserController.handleStart(bot, query.message);
        break;
      default:
        if (action.startsWith('select_package:')) {
          const packageId = action.split(':')[1];
          await PurchaseController.selectPackage(bot, chatId, userId, packageId);
        } else if (action.startsWith('confirm_purchase:')) {
          const packageId = action.split(':')[1];
          await PurchaseController.confirmPurchase(bot, chatId, userId, packageId);
        } else {
          await UserController.handleMainMenu(bot, query);
        }
    }
  } catch (error) {
    console.error('Error handling callback query:', error);
    await bot.answerCallbackQuery(query.id, { text: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.' });
  }
});

// پردازش پیام‌های معمولی
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, 'لطفاً از منوی اصلی استفاده کنید.', UserController.userMainMenu);
  }
});

console.log('Bot is running...');
