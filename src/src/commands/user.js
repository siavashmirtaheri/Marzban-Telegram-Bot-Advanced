// src/commands/user.js

// منوی کاربر عادی
function getUserMenu() {
    return {
        keyboard: [
            [{ text: 'مشاهده بسته‌ها' }, { text: 'کیف پول' }],
            [{ text: 'زبان' }, { text: 'راهنما' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    };
}

// نمایش منوی کاربر
async function showUserMenu(bot, chatId) {
    await bot.sendMessage(chatId, 'به ربات خوش آمدید!', {
        reply_markup: getUserMenu()
    });
}

module.exports = {
    showUserMenu
};
