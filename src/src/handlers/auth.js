
const { apiRequest } = require('../api');

// بررسی اینکه آیا کاربر مدیر است یا خیر
async function isAdmin(userId) {
  const admins = await apiRequest('/admins'); // فراخوانی API برای لیست مدیران
  return admins.includes(userId);
}

module.exports = { isAdmin };
