const { apiRequest } = require('../api');
let token = null; // ذخیره توکن در حافظه

async function getAdminToken() {
  if (!token) {
    const response = await apiRequest('/admin/token', 'POST', {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    });
    token = response.access_token;
  }
  return token;
}

function resetToken() {
  token = null; // ریست توکن در صورت انقضا
}

module.exports = { getAdminToken, resetToken };
