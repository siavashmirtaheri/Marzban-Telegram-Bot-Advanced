const { userMainMenu } = require('../utils/keyboards');
const PurchaseController = require('./purchaseController');
const AuthService = require('../services/authService');
const User = require('../models/User');
const marzbanService = require('../services/marzbanService');

class UserController {  
    static isAdmin(userId) {
        return AuthService.isAdmin(userId);
    }

    static async handleMessage(bot, msg) {
        const chatId = msg.chat.id;
        const text = msg.text;
        const userId = msg.from.id;

        console.log(`Received message: "${text}" from chat ID: ${chatId}`);

        try {
            let user = await User.findOne({ telegramId: userId });
            if (!user) {
                user = new User({
                    telegramId: userId,
                    username: msg.from.username,
                    firstName: msg.from.first_name,
                    lastName: msg.from.last_name
                });
                await user.save();
                console.log(`New user created: ${userId}`);
            }

            if (text === '/start') {
                console.log('Sending main menu');
                await this.sendMainMenu(bot, chatId);
            } else {
                console.log('Sending default message');
                bot.sendMessage(chatId, 'لطفاً از منو استفاده کنید.');
            }
        } catch (error) {
            console.error('Error handling message:', error);
            bot.sendMessage(chatId, 'متأسفانه خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
        }
    }

    static async handleCallback(bot, callbackQuery) {
        const chatId = callbackQuery.message.chat.id;
        const userId = callbackQuery.from.id;
        const data = callbackQuery.data;

        console.log(`Received callback query: "${data}" from user ID: ${userId}`);

        try {
            switch (data) {
                case 'profile':
                    console.log('Showing profile');
                    await this.showProfile(bot, chatId, userId);
                    break;
                case 'services':
                    console.log('Showing services');
                    await this.showServices(bot, chatId);
                    break;
                case 'support':
                    console.log('Showing support');
                    await this.showSupport(bot, chatId);
                    break;
                case 'about':
                    console.log('Showing about');
                    await this.showAbout(bot, chatId);
                    break;
                case 'buy_service':
                    console.log('Showing packages for purchase');
                    await PurchaseController.showPackages(bot, chatId);
                    break;
                default:
                    if (data.startsWith('select_package:')) {
                        const packageId = parseInt(data.split(':')[1]);
                        console.log(`Selecting package with ID: ${packageId}`);
                        await PurchaseController.selectPackage(bot, chatId, userId, packageId);
                    } else if (data.startsWith('confirm_purchase:')) {
                        const packageId = parseInt(data.split(':')[1]);
                        console.log(`Confirming purchase of package with ID: ${packageId}`);
                        await PurchaseController.confirmPurchase(bot, chatId, userId, packageId);
                    } else if (data === 'cancel_purchase') {
                        console.log('Cancelling purchase');
                        bot.sendMessage(chatId, 'خرید لغو شد.');
                    } else {
                        console.log(`Invalid operation: ${data}`);
                        bot.answerCallbackQuery(callbackQuery.id, 'عملیات نامعتبر');
                    }
            }
        } catch (error) {
            console.error('Error handling callback:', error);
            bot.sendMessage(chatId, 'متأسفانه خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
        }
    }

    static async sendMainMenu(bot, chatId) {
        console.log(`Sending main menu to chat ID: ${chatId}`);
        await bot.sendMessage(chatId, 'به ربات ما خوش آمدید. لطفاً یک گزینه را انتخاب کنید:', userMainMenu);
    }

    static async showProfile(bot, chatId, userId) {
        try {
            const user = await User.findOne({ telegramId: userId });
            if (!user) {
                throw new Error('User not found');
            }

            let profileText = `👤 پروفایل شما:\n\n`;
            profileText += `نام: ${user.firstName} ${user.lastName}\n`;
            profileText += `نام کاربری: @${user.username}\n`;

            if (user.marzbanUsername) {
                const marzbanUser = await marzbanService.getUser(user.marzbanUsername);
                profileText += `\nاطلاعات سرویس:\n`;
                profileText += `نام کاربری: ${marzbanUser.username}\n`;
                profileText += `وضعیت: ${marzbanUser.status}\n`;
                profileText += `تاریخ انقضا: ${new Date(marzbanUser.expire).toLocaleDateString('fa-IR')}\n`;
            } else {
                profileText += `\nشما هنوز سرویسی خریداری نکرده‌اید.`;
            }

            await bot.sendMessage(chatId, profileText);
        } catch (error) {
            console.error('Error showing profile:', error);
            await bot.sendMessage(chatId, 'متأسفانه در نمایش پروفایل خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
        }
    }

    static async showServices(bot, chatId) {
        // این متد باید لیستی از سرویس‌های موجود را نمایش دهد
        await bot.sendMessage(chatId, 'لیست سرویس‌های ما:\n\n1. سرویس A\n2. سرویس B\n3. سرویس C');
    }

    static async showSupport(bot, chatId) {
        await bot.sendMessage(chatId, 'برای دریافت پشتیبانی، لطفاً با @SupportUsername تماس بگیرید.');
    }

    static async showAbout(bot, chatId) {
        await bot.sendMessage(chatId, 'این ربات توسط [نام شما/شرکت شما] ایجاد شده است. نسخه 1.0.0');
    }

    static async createMarzbanUser(telegramId, username) {
        try {
            const user = await User.findOne({ telegramId });
            if (!user) {
                throw new Error('User not found');
            }

            const marzbanUser = await marzbanService.createUser({
                username: username,
                // Add other required fields
            });

            user.marzbanUsername = marzbanUser.username;
            await user.save();

            return marzbanUser;
        } catch (error) {
            console.error('Error creating Marzban user:', error);
            throw error;
        }
    }
}

module.exports = UserController;
