const { apiRequest } = require('../api');
const { getAdminToken } = require('./token');

async function getUsers(chatId, bot) {
  try {
    const token = await getAdminToken();
    const users = await apiRequest('/users', 'GET', {}, token);
    bot.sendMessage(chatId, JSON.stringify(users, null, 2));
  } catch (error) {
    bot.sendMessage(chatId, `Error fetching users: ${error.message}`);
  }
}

async function resetUserData(chatId, bot, username) {
  try {
    const token = await getAdminToken();
    await apiRequest(`/user/${username}/reset`, 'POST', {}, token);
    bot.sendMessage(chatId, `User data for ${username} has been reset.`);
  } catch (error) {
    bot.sendMessage(chatId, `Error resetting user data: ${error.message}`);
  }
}

module.exports = { getUsers, resetUserData };
