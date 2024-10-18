const config = require('../config/config');
const Channel = require('../models/channelModel');

class AuthService {
    static isAdmin(userId) {
        return config.adminIds.includes(userId);
    }

    // اضافه کردن متدهای دیگر مرتبط با احراز هویت
}

module.exports = AuthService;
