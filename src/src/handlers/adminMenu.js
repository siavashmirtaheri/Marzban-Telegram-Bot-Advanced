
async function adminMenu(chatId, bot) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '➕ افزودن کانال جدید', callback_data: 'add_channel' }],
        [{ text: '👥 مدیریت کاربران', callback_data: 'manage_users' }],
        [{ text: '📊 گزارش‌ها', callback_data: 'view_reports' }],
      ],
    },
  };
  bot.sendMessage(chatId, 'پنل مدیریت:', options);
}

module.exports = { adminMenu };
