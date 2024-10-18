require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const connectDB = require('./config/database');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const authMiddleware = require('./middlewares/authMiddleware');

connectDB();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
    // Handle messages
});

bot.on('callback_query', async (callbackQuery) => {
    // Handle callback queries
});

console.log('Bot is running...');
