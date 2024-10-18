const userMainMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'خرید سرویس', callback_data: 'buy_service' }],
      [{ text: 'سرویس‌های من', callback_data: 'services' }],
      [{ text: 'کیف پول', callback_data: 'wallet' }],
      [{ text: 'پروفایل', callback_data: 'profile' }],
      [{ text: 'پشتیبانی', callback_data: 'support' }],
      [{ text: 'درباره ما', callback_data: 'about' }]
    ]
  }
};

const packageSelectionMenu = (packages) => {
  const keyboard = packages.map(pkg => [{
    text: `${pkg.name} - ${pkg.price} تومان`,
    callback_data: `select_package:${pkg._id}`
  }]);

  keyboard.push([{ text: 'بازگشت به منوی اصلی', callback_data: 'main_menu' }]);

  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
};

const profileMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'ویرایش اطلاعات', callback_data: 'edit_profile' }],
      [{ text: 'بازگشت به منوی اصلی', callback_data: 'main_menu' }]
    ]
  }
};

const walletMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'شارژ کیف پول', callback_data: 'charge_wallet' }],
      [{ text: 'تاریخچه تراکنش‌ها', callback_data: 'transaction_history' }],
      [{ text: 'بازگشت به منوی اصلی', callback_data: 'main_menu' }]
    ]
  }
};

module.exports = {
  userMainMenu,
  packageSelectionMenu,
  profileMenu,
  walletMenu
};
