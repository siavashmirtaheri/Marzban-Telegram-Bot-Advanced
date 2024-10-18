const Payment = require('../models/paymentModel');
const Wallet = require('../models/walletModel');

class PaymentService {
  static async createPayment(userId, amount, cardNumber, transactionDate) {
    const payment = new Payment({
      userId,
      amount,
      cardNumber,
      transactionDate
    });
    await payment.save();
    return payment;
  }

  static async getPaymentById(paymentId) {
    return Payment.findById(paymentId);
  }

  static async getPendingPayments() {
    return Payment.find({ status: 'pending' }).populate('userId', 'telegramId');
  }

  static async approvePayment(paymentId, adminId) {
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.status !== 'pending') {
      throw new Error('پرداخت نامعتبر یا قبلاً پردازش شده است.');
    }

    payment.status = 'approved';
    payment.approvedBy = adminId;
    payment.approvedAt = new Date();
    await payment.save();

    const wallet = await Wallet.findOne({ userId: payment.userId });
    await wallet.addBalance(payment.amount, `شارژ کیف پول - تأیید پرداخت ${paymentId}`);

    return payment;
  }

  static async rejectPayment(paymentId, adminId) {
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.status !== 'pending') {
      throw new Error('پرداخت نامعتبر یا قبلاً پردازش شده است.');
    }

    payment.status = 'rejected';
    payment.approvedBy = adminId;
    payment.approvedAt = new Date();
    await payment.save();

    return payment;
  }
}

module.exports = PaymentService;
