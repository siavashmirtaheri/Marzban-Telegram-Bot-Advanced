const User = require('../models/userModel');
const Package = require('../models/packageModel');
const Wallet = require('../models/walletModel');
const Subscription = require('../models/subscriptionModel');
const MarzbanService = require('../services/marzbanService');

class PurchaseController {
  static async initiatePackagePurchase(bot, chatId, userId, packageId) {
    try {
      const user = await User.findOne({ telegramId: userId });
      const selectedPackage = await Package.findById(packageId);
      const wallet = await Wallet.findOne({ userId: user._id });

      if (!selectedPackage) {
        return bot.sendMessage(chatId, 'پکیج مورد نظر یافت نشد.');
      }

      if (wallet.balance < selectedPackage.price) {
        return bot.sendMessage(chatId, 'موجودی کیف پول شما کافی نیست. لطفاً ابتدا کیف پول خود را شارژ کنید.');
      }

      const confirmationMessage = `
      آیا از خرید پکیج زیر اطمینان دارید؟
      نام پکیج: ${selectedPackage.name}
      قیمت: ${selectedPackage.price} تومان
      مدت زمان: ${selectedPackage.duration} روز
      حجم: ${selectedPackage.volume} GB
      `;

      bot.sendMessage(chatId, confirmationMessage, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'تأیید و خرید', callback_data: `confirm_purchase:${packageId}` }],
            [{ text: 'انصراف', callback_data: 'cancel_purchase' }]
          ]
        }
      });
    } catch (error) {
      console.error('Error in initiatePackagePurchase:', error);
      bot.sendMessage(chatId, 'متأسفانه در فرآیند خرید خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    }
  }

  static async confirmPurchase(bot, chatId, userId, packageId) {
    try {
      const user = await User.findOne({ telegramId: userId });
      const selectedPackage = await Package.findById(packageId);
      const wallet = await Wallet.findOne({ userId: user._id });

      if (wallet.balance < selectedPackage.price) {
        return bot.sendMessage(chatId, 'موجودی کیف پول شما کافی نیست. لطفاً ابتدا کیف پول خود را شارژ کنید.');
      }

      // کسر مبلغ از کیف پول
      await wallet.deductBalance(selectedPackage.price, `خرید پکیج ${selectedPackage.name}`);

      // ایجاد حساب در مرزبان
      const marzbanAccount = await MarzbanService.createAccount(selectedPackage);

      // ایجاد اشتراک جدید
      const subscription = new Subscription({
        userId: user._id,
        packageId: selectedPackage._id,
        expiryDate: new Date(Date.now() + selectedPackage.duration * 24 * 60 * 60 * 1000),
        remainingVolume: selectedPackage.volume,
        marzbanUsername: marzbanAccount.username
      });
      await subscription.save();

      const message = `
      خرید شما با موفقیت انجام شد!
      نام کاربری: ${marzbanAccount.username}
      سرور: ${marzbanAccount.server}
      پورت: ${marzbanAccount.port}
      لینک تنظیم رمز عبور: ${marzbanAccount.passwordSetupLink}
      `;

      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error in confirmPurchase:', error);
      bot.sendMessage(chatId, 'متأسفانه در فرآیند خرید خطایی رخ داد. لطفاً با پشتیبانی تماس بگیرید.');
    }
  }
}

module.exports = PurchaseController;
