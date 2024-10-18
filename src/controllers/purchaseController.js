const PackageModel = require('../models/packageModel');
const UserModel = require('../models/userModel');
const WalletModel = require('../models/walletModel');
const MarzbanService = require('../services/marzbanService');

class PurchaseController {
  static async showPackages(bot, chatId) {
    const packages = await PackageModel.getAllPackages();
    const keyboard = packages.map(pkg => [{text: pkg.name, callback_data: `select_package:${pkg.id}`}]);
    
    bot.sendMessage(chatId, 'لطفاً یک پکیج را انتخاب کنید:', {
      reply_markup: { inline_keyboard: keyboard }
    });
  }

  static async selectPackage(bot, chatId, userId, packageId) {
    const package = await PackageModel.getPackageById(packageId);
    const user = await UserModel.getUserById(userId);

    if (!user.telegramId && !user.phoneNumber) {
      // اگر کاربر برای اولین بار خرید می‌کند، اطلاعات تماس را درخواست کنید
      return this.requestContactInfo(bot, chatId);
    }

    // نمایش اطلاعات پکیج و درخواست تأیید
    const message = `
    نام پکیج: ${package.name}
    قیمت: ${package.price} تومان
    مدت زمان: ${package.duration} روز
    حجم: ${package.volume} گیگابایت
    سرور: ${package.server}
    توضیحات: ${package.description}

    آیا مایل به خرید این پکیج هستید؟
    `;

    bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [{text: 'تأیید و خرید', callback_data: `confirm_purchase:${packageId}`}],
          [{text: 'انصراف', callback_data: 'cancel_purchase'}]
        ]
      }
    });
  }

  static async confirmPurchase(bot, chatId, userId, packageId) {
    const package = await PackageModel.getPackageById(packageId);
    const wallet = await WalletModel.getWalletByUserId(userId);

    if (wallet.balance < package.price) {
      return bot.sendMessage(chatId, 'موجودی کیف پول شما کافی نیست. لطفاً ابتدا کیف پول خود را شارژ کنید.');
    }

    // کسر مبلغ از کیف پول
    await WalletModel.deductBalance(userId, package.price);

    // ایجاد حساب در پنل مرزبان
    const marzbanAccount = await MarzbanService.createAccount(package);

    // ذخیره اطلاعات خرید در پایگاه داده
    // ...

    // ارسال اطلاعات حساب به کاربر
    const message = `
    خرید شما با موفقیت انجام شد!
    
    اطلاعات حساب شما:
    نام کاربری: ${marzbanAccount.username}
    رمز عبور: ${marzbanAccount.password}
    آدرس سرور: ${marzbanAccount.server}
    پورت: ${marzbanAccount.port}
    
    لطفاً این اطلاعات را در جای امنی نگهداری کنید.
    `;

    bot.sendMessage(chatId, message);
  }

  static requestContactInfo(bot, chatId) {
    bot.sendMessage(chatId, 'برای تکمیل خرید، لطفاً شماره تلفن یا شناسه تلگرامی خود را وارد کنید:');
    // اینجا باید وضعیت کاربر را به حالت "در انتظار اطلاعات تماس" تغییر دهید
  }
}

module.exports = PurchaseController;
