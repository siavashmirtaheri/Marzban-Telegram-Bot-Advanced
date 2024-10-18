// src/commands/payment.js
module.exports = async (bot, chatId) => {
    bot.sendMessage(chatId, 'لطفاً مبلغی که می‌خواهید شارژ کنید را وارد نمایید (به تومان):');

    bot.once('message', async (msg) => {
        const amount = parseInt(msg.text);
        
        if (isNaN(amount) || amount <= 0) {
            return bot.sendMessage(chatId, 'لطفاً یک مبلغ معتبر وارد کنید.');
        }

        // ارسال اطلاعات کارت مقصد
        bot.sendMessage(chatId, `لطفاً مبلغ ${amount} تومان را به شماره کارت زیر واریز کنید:\n\n` +
            `1234-5678-9012-3456\n\n` +
            `سپس شماره پیگیری تراکنش و اسکرین‌شات رسید را ارسال نمایید.`);
        
        // ذخیره مبلغ و انتظار دریافت شماره پیگیری و اسکرین‌شات
        bot.once('message', async (msg) => {
            if (msg.text) {
                const trackingNumber = msg.text;

                bot.sendMessage(chatId, 'لطفاً اسکرین‌شات تراکنش را آپلود کنید:');
                
                bot.once('photo', async (photoMsg) => {
                    const photoId = photoMsg.photo[0].file_id;

                    // ذخیره تراکنش در دیتابیس
                    await db.collection('transactions').insertOne({
                        userId: msg.from.id,
                        amount: amount,
                        trackingNumber: trackingNumber,
                        photoId: photoId,
                        status: 'pending'
                    });

                    bot.sendMessage(chatId, 'تراکنش شما ثبت شد و منتظر تأیید توسط مدیر می‌باشد.');
                });
            }
        });
    });
};
