// src/services/database.js
const { MongoClient } = require('mongodb');

// اتصال به MongoDB
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('اتصال به MongoDB برقرار شد.');

        // تنظیم نام پایگاه داده
        const db = client.db('Marzban-Advanced-telegram-bot');

        // ایجاد مجموعه‌ها (Collections) اگر وجود نداشتند
        await db.createCollection('users').catch(() => console.log('مجموعه users وجود دارد.'));
        await db.createCollection('transactions').catch(() => console.log('مجموعه transactions وجود دارد.'));
        await db.createCollection('services').catch(() => console.log('مجموعه services وجود دارد.'));

        return db;
    } catch (error) {
        console.error('خطا در اتصال به MongoDB:', error);
        process.exit(1); // توقف برنامه در صورت بروز خطا
    }
}

// اطمینان از بسته شدن اتصال در صورت توقف برنامه
process.on('SIGINT', async () => {
    await client.close();
    console.log('اتصال به MongoDB بسته شد.');
    process.exit(0);
});

module.exports = connectDB;
