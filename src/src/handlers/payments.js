
const { apiRequest } = require('../api');
const { getAdminToken } = require('./token');

// تایید پرداخت کارت به کارت توسط مدیر
async function approveManualPayment(chatId, bot, userId, amount) {
  try {
    const token = await getAdminToken();
    await apiRequest(`/payments/manual/approve`, 'POST', { userId, amount }, token);
    bot.sendMessage(chatId, `پرداخت ${amount} تومان تایید شد.`);
  } catch (error) {
    bot.sendMessage(chatId, `Error approving payment: ${error.message}`);
  }
}

// پردازش پرداخت از درگاه زیبال
async function processZibalPayment(chatId, bot, userId, amount) {
  try {
    const token = await getAdminToken();
    const paymentUrl = await apiRequest('/payments/zibal', 'POST', { userId, amount }, token);
    bot.sendMessage(chatId, `برای پرداخت این لینک را باز کنید: ${paymentUrl}`);
  } catch (error) {
    bot.sendMessage(chatId, `Error processing payment: ${error.message}`);
  }
}

module.exports = { approveManualPayment, processZibalPayment };
