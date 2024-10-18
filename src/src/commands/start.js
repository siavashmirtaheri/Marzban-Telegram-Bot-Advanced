const { getChannelMembership } = require('../services/marzbanApi');
const adminIds = process.env.ADMIN_IDS.split(',').map(id => id.trim()); // دریافت لیست مدیران از env

// بررسی عضویت کاربر در کانال‌ها
async function checkMembership(userId) {
    // بررسی اینکه آیا کاربر جزو مدیران است
    if (adminIds.includes(userId.toString())) {
        return 'admin'; // اگر کاربر مدیر باشد
    }

    const channels = [process.env.CHANNEL_1, process.env.CHANNEL_2];
    for (const channel of channels) {
        const isMember = await getChannelMembership(userId, channel);
        if (!isMember) {
            return false; // کاربر عضو کانال نیست
        }
    }
    return true; // کاربر عضو کانال است
}
// ساخت دکمه‌های شیشه‌ای برای نمایش آدرس کانال‌ها و دکمه بررسی عضویت
function getJoinChannelsKeyboard() {
    const channels = [process.env.CHANNEL_1, process.env.CHANNEL_2];

    const inlineKeyboard = channels.map(channel => [
        { text: `عضویت در ${channel}`, url: `https://t.me/${channel.replace('@', '')}` }
    ]);

    inlineKeyboard.push([{ text: 'بررسی عضویت', callback_data: 'check_membership' }]);

    return {
        inline_keyboard: inlineKeyboard
    };
}

// منوی مدیریت
function getAdminMenu() {
    return JSON.stringify({
        keyboard: [
            [{ text: 'مشاهده کاربران' }, { text: 'مدیریت بسته‌ها' }],
            [{ text: 'مشاهده تراکنش‌ها' }, { text: 'ارسال پیام همگانی' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    });
}

// منوی کاربر عادی
function getUserMenu() {
    return JSON.stringify({
        keyboard: [
            [{ text: 'مشاهده بسته‌ها' }, { text: 'کیف پول' }],
            [{ text: 'زبان' }, { text: 'راهنما' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    });
}

module.exports = {
    checkMembership,
    getJoinChannelsKeyboard,
    getAdminMenu,
    getUserMenu
};