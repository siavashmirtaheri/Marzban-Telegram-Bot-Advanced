
async function showCommands(chatId, bot) {
  const commands = `
/get_users - دریافت لیست کاربران
/reset_user_data <username> - ریست مصرف کاربر
/approve_payment <userId> <amount> - تایید پرداخت کارت به کارت
/process_payment <userId> <amount> - پردازش پرداخت زیبال
/refresh_token - ریست توکن
`;

  bot.sendMessage(chatId, `دستورات پنل:\n${commands}`);
}

module.exports = { showCommands };
