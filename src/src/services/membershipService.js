const { bot } = require('../bot'); // اطمینان از دسترسی به نمونه bot

// بررسی عضویت کاربر در یک کانال
async function getChannelMembership(userId, channel) {
  try {
    const result = await bot.telegram.getChatMember(channel, userId);
    console.log(`User ${userId} is ${result.status} in ${channel}`);
    return result.status === 'member' || result.status === 'administrator';
  } catch (error) {
    console.error('Error in getChannelMembership:', error);
    return false; // فرض بر اینکه کاربر عضو نیست در صورت بروز خطا
  }
}

module.exports = { getChannelMembership };
