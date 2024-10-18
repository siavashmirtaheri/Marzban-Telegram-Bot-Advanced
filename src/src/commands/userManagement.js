const { sendRequest } = require('../services/marzbanApi');

// تابع ساخت کاربر جدید
async function createUser(ctx, phoneNumber, telegramUserId, dataLimit, expireDays, protocol) {
  const username = phoneNumber || `user_${telegramUserId}`; // ساخت نام کاربری
  const expireTimestamp = Math.floor(Date.now() / 1000) + expireDays * 24 * 60 * 60; // تبدیل به Timestamp

  try {
    const response = await sendRequest('/api/user', 'POST', {
      username,
      data_limit: dataLimit * 1024 * 1024 * 1024, // حجم به بایت
      expire: expireTimestamp,
      proxies: {
        [protocol]: {} // پروتکل انتخابی
      }
    });

    if (response) {
      ctx.reply(`✅ کاربر جدید با نام کاربری ${username} با موفقیت ساخته شد.`);
    } else {
      ctx.reply('⛔ خطا در ایجاد کاربر.');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    ctx.reply('⛔ مشکلی در ایجاد کاربر به وجود آمده است.');
  }
}

module.exports = { createUser };
