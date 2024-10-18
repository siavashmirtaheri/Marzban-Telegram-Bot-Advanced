const userMainMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'خرید سرویس', callback_data: 'buy_service' }],
      [{ text: 'پروفایل من', callback_data: 'profile' }],
      [{ text: 'پشتیبانی', callback_data: 'support' }],
      [{ text: 'درباره ما', callback_data: 'about' }]
    ]
  }
};
  
  const adminMainMenu = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'مدیریت کاربران', callback_data: 'manage_users' }],
        [{ text: 'مدیریت کانال‌ها', callback_data: 'manage_channels' }],
        [{ text: 'آمار و گزارشات', callback_data: 'statistics' }],
        [{ text: 'تنظیمات ربات', callback_data: 'bot_settings' }]
      ]
    }
  };
  
  const channelManagementMenu = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'افزودن کانال', callback_data: 'add_channel' }],
        [{ text: 'حذف کانال', callback_data: 'remove_channel' }],
        [{ text: 'لیست کانال‌ها', callback_data: 'list_channels' }],
        [{ text: 'بازگشت به منوی اصلی', callback_data: 'back_to_admin_main' }]
      ]
    }
  };
  
  module.exports = {
    userMainMenu,
    adminMainMenu,
    channelManagementMenu
  };
  