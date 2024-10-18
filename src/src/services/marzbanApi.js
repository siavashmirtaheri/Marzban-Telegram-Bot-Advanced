const axios = require('axios');

async function createUser(username, packageDetails) {
    const response = await axios.post(`${process.env.MARZBAN_API}/api/user`, {
        username: username,
        expire: packageDetails.expire,
        data_limit: packageDetails.dataLimit,
        proxies: packageDetails.proxies
    }, {
        headers: { Authorization: `Bearer ${process.env.API_TOKEN}` }
    });

    return response.data;
}

module.exports = {
    createUser
};
// بررسی عضویت کاربر در کانال
async function getChannelMembership(userId, channelId) {
    try {
        const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=${channelId}&user_id=${userId}`);
        const status = response.data.result.status;
        return status === 'member' || status === 'administrator' || status === 'creator';
    } catch (error) {
        console.error('خطا در بررسی عضویت کاربر:', error);
        return false;
    }
}

module.exports = {
    getChannelMembership
};