async function userMenu(chatId, bot) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📢 عضویت در کانال', callback_data: 'check_membership' }],
        [{ text: '💼 مشاهده پکیج‌ها', callback_data: 'view_packages' }],
        [{ text: '💳 پرداخت', callback_data: 'make_payment' }],
        [{ text: '🔄 وضعیت عضویت', callback_data: 'membership_status' }],
      ],
    },
  };
  bot.sendMessage(chatId, 'لطفاً یکی از گزینه‌های زیر را انتخاب کنید:', options);
}

module.exports = { userMenu };
