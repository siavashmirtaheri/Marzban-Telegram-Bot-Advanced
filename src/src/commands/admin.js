const db = require('../services/database');
function getAdminMenu() {
    return {
        inline_keyboard: [
            [{ text: 'مشاهده کاربران', callback_data: 'view_users' }],
            [{ text: 'مدیریت بسته‌ها', callback_data: 'manage_packages' }],
            [{ text: 'ارسال پیام همگانی', callback_data: 'send_broadcast' }],
            [{ text: 'مشاهده تراکنش‌ها', callback_data: 'view_transactions' }]
        ]
    };
}

// نمایش منوی مدیریت به مدیر
async function showAdminMenu(bot, chatId) {
    await bot.sendMessage(chatId, 'به پنل مدیریتی خوش آمدید.', {
        reply_markup: getAdminMenu()
    });
}

// نمایش تراکنش‌های در انتظار
async function showPendingTransactions(bot, chatId) {
    const pendingTransactions = await db.collection('transactions').find({ status: 'pending' }).toArray();
    
    if (pendingTransactions.length === 0) {
        return bot.sendMessage(chatId, 'هیچ تراکنش در حال انتظار نیست.');
    }

    pendingTransactions.forEach(transaction => {
        bot.sendMessage(chatId, 
            `تراکنش: ${transaction.amount} تومان\n` +
            `کاربر: ${transaction.userId}\n` +
            `شماره پیگیری: ${transaction.trackingNumber}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'مشاهده اسکرین‌شات', callback_data: `view_${transaction.photoId}` }],
                    [{ text: 'تأیید', callback_data: `confirm_${transaction._id}` }, { text: 'رد', callback_data: `reject_${transaction._id}` }]
                ]
            }
        });
    });
}

// مدیریت callback_query برای تراکنش‌ها
async function handleTransactionCallback(bot, callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data.split('_');
    const action = data[0];
    const transactionId = data[1];

    if (action === 'view') {
        const photoId = transactionId;
        return bot.sendPhoto(chatId, photoId);
    }

    const transaction = await db.collection('transactions').findOne({ _id: transactionId });

    if (action === 'confirm') {
        await db.collection('transactions').updateOne({ _id: transactionId }, { $set: { status: 'approved' } });
        await db.collection('users').updateOne({ telegramId: transaction.userId }, { $inc: { walletBalance: transaction.amount } });

        bot.sendMessage(chatId, 'تراکنش تأیید شد.');
        bot.sendMessage(transaction.userId, `تراکنش شما به مبلغ ${transaction.amount} تومان تأیید شد و به کیف پول شما اضافه گردید.`);
    } else if (action === 'reject') {
        await db.collection('transactions').updateOne({ _id: transactionId }, { $set: { status: 'rejected' } });
        bot.sendMessage(chatId, 'تراکنش رد شد.');
        bot.sendMessage(transaction.userId, 'تراکنش شما رد شد.');
    }
}

module.exports = {
    showPendingTransactions,
    handleTransactionCallback,
    showAdminMenu
};
