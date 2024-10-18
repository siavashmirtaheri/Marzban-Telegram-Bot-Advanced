const Wallet = require('../models/walletModel');
const User = require('../models/userModel');
const PaymentService = require('../services/paymentService');
const { walletMenu } = require('../utils/keyboards');

class WalletController {
  // ... (سایر متدها)

  static async initiateWalletCharge(bot, chatId, userId) {
    try {
      const user = await User.findOne({ telegramId: userId });
      
      const message = 'لطفاً مبلغ شارژ کیف پول را به تومان وارد کنید:';
      bot.sendMessage(chatId, message);

      await User.findByIdAndUpdate(user._id, { state: 'AWAITING_CHARGE_AMOUNT' });
    } catch (error) {
      console.error('Error in initiateWalletCharge:', error);
      bot.sendMessage(chatId, 'متأسفانه در فرآیند شارژ کیف پول خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    }
  }

  static async processChargeAmount(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const amount = parseInt(msg.text);

    if (isNaN(amount) || amount <= 0) {
      return bot.sendMessage(chatId, 'لطفاً یک عدد معتبر وارد کنید.');
    }

    try {
      const user = await User.findOne({ telegramId: userId });
      
      bot.sendMessage(chatId, 'لطفاً شماره کارتی که از آن پرداخت را انجام داده‌اید وارد کنید:');
      await User.findByIdAndUpdate(user._id, { 
        state: 'AWAITING_CARD_NUMBER',
        tempData: { chargeAmount: amount }
      });
    } catch (error) {
      console.error('Error in processChargeAmount:', error);
      bot.sendMessage(chatId, 'متأسفانه در ثبت مبلغ شارژ خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    }
  }

  static async processCardNumber(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const cardNumber = msg.text.replace(/\s+/g, '');

    if (!/^\d{16}$/.test(cardNumber)) {
      return bot.sendMessage(chatId, 'لطفاً یک شماره کارت 16 رقمی معتبر وارد کنید.');
    }

    try {
      const user = await User.findOne({ telegramId: userId });
      const { chargeAmount } = user.tempData;

      const payment = await PaymentService.createPayment(user._id, chargeAmount, cardNumber, new Date());

      const message = `
      درخواست شارژ کیف پول شما ثبت شد:
      مبلغ: ${chargeAmount} تومان
      شماره کارت: ${cardNumber}
      
      لطفاً منتظر تأیید ادمین باشید. پس از تأیید، کیف پول شما شارژ خواهد شد.
      `;

      bot.sendMessage(chatId, message);

      // Reset user state
      await User.findByIdAndUpdate(user._id, { 
        state: null,
        tempData: {}
      });

      // Notify admins
      // This part should be implemented to notify admins about new pending payments
    } catch (error) {
      console.error('Error in processCardNumber:', error);
      bot.sendMessage(chatId, 'متأسفانه در ثبت درخواست شارژ خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    }
  }
}

module.exports = WalletController;
