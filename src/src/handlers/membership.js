const { apiRequest } = require('../api');
const { getAdminToken } = require('./token');

// بررسی عضویت کاربر در یک کانال
async function checkMembership(userId, channelId) {
  try {
    const token = await getAdminToken();
    const response = await apiRequest(`/channels/${channelId}/check`, 'GET', { userId }, token);
    return response.isMember;
  } catch (error) {
    console.error(`خطا در بررسی عضویت: ${error.message}`);
    return false;
  }
}

module.exports = { checkMembership };
