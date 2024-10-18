const { checkMembership, getJoinChannelsKeyboard } = require('./start');

async function handleMembershipCheck(bot, chatId, userId) {
    try {
        console.log(`در حال بررسی عضویت کاربر: ${userId}`);
        const membershipStatus = await checkMembership(userId);
        console.log(`وضعیت عضویت: ${membershipStatus}`);

        if (membershipStatus === 'admin') {
            console.log(`کاربر ${userId} مدیر است.`);
            return 'admin'; // بازگشت وضعیت مدیر
        } else if (membershipStatus === true) {
            await bot.sendMessage(chatId, 'عضویت شما تأیید شد! به ربات خوش آمدید.');
            return 'user'; // بازگشت وضعیت کاربر عادی
        } else if (membershipStatus === false) {
            await bot.sendMessage(chatId, 'لطفاً ابتدا در کانال‌های ما عضو شوید.', {
                reply_markup: getJoinChannelsKeyboard()
            });
            return 'pending'; // بازگشت وضعیت در انتظار
        } else {
            throw new Error('پاسخ غیرمنتظره از checkMembership');
        }
    } catch (error) {
        console.error('خطا در handleMembershipCheck:', error);
        await bot.sendMessage(chatId, 'سرور خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
        return 'error'; // بازگشت وضعیت خطا
    }
}

module.exports = {
    handleMembershipCheck
};
