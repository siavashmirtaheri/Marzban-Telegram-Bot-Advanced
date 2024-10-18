const fs = require('fs');
const path = require('path');

// مسیر فایل ذخیره‌سازی تخفیف‌ها
const discountsFile = path.join(__dirname, '../data/discounts.json');

// تابع خواندن تخفیف‌ها از فایل
function loadDiscounts() {
  if (!fs.existsSync(discountsFile)) return [];
  const data = fs.readFileSync(discountsFile);
  return JSON.parse(data);
}

// تابع ذخیره تخفیف‌ها در فایل
function saveDiscounts(discounts) {
  fs.writeFileSync(discountsFile, JSON.stringify(discounts, null, 2));
}

// افزودن تخفیف جدید
function addDiscount(ctx, code, percentage) {
  const discounts = loadDiscounts();
  discounts.push({ code, percentage });
  saveDiscounts(discounts);
  ctx.reply(`✅ تخفیف ${code} با موفقیت اضافه شد!`);
}

// مشاهده تخفیف‌ها
function listDiscounts(ctx) {
  const discounts = loadDiscounts();
  if (discounts.length === 0) {
    return ctx.reply('⛔ هیچ تخفیفی تعریف نشده است.');
  }

  let message = '📋 لیست تخفیف‌ها:\n';
  discounts.forEach(d => {
    message += `- کد: ${d.code} | درصد: ${d.percentage}%\n`;
  });
  ctx.reply(message);
}

// حذف تخفیف
function deleteDiscount(ctx, code) {
  let discounts = loadDiscounts();
  discounts = discounts.filter(d => d.code !== code);
  saveDiscounts(discounts);
  ctx.reply(`✅ تخفیف ${code} با موفقیت حذف شد.`);
}

// اعمال تخفیف روی قیمت بسته
function applyDiscount(price, discountCode) {
  const discounts = loadDiscounts();
  const discount = discounts.find(d => d.code === discountCode);

  if (!discount) return price; // اگر تخفیف پیدا نشد، قیمت بدون تغییر برمی‌گردد

  const discountedPrice = price - (price * discount.percentage / 100);
  return Math.round(discountedPrice); // قیمت نهایی با تخفیف
}

module.exports = { addDiscount, listDiscounts, deleteDiscount, applyDiscount };
