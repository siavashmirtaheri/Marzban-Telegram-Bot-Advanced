const axios = require('axios');

class MarzbanService {
  constructor() {
    this.apiUrl = process.env.MARZBAN_API_URL;
    this.username = process.env.MARZBAN_USERNAME;
    this.password = process.env.MARZBAN_PASSWORD;
    this.token = null;
    this.tokenExpiration = null;
  }

  async getToken() {
    if (this.token && this.tokenExpiration > Date.now()) {
      return this.token;
    }

    try {
      const response = await axios.post(`${this.apiUrl}/admin/token`, {
        username: this.username,
        password: this.password,
      });

      this.token = response.data.access_token;
      this.tokenExpiration = Date.now() + (response.data.expires_in * 1000);

      return this.token;
    } catch (error) {
      console.error('خطا در دریافت توکن مرزبان:', error);
      throw error;
    }
  }

  async makeRequest(method, endpoint, data = null) {
    const token = await this.getToken();

    try {
      const response = await axios({
        method,
        url: `${this.apiUrl}${endpoint}`,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('خطا در ارسال درخواست به API مرزبان:', error);
      throw error;
    }
  }

  async createUser(userData) {
    return this.makeRequest('POST', '/user', userData);
  }

  async getUserInfo(username) {
    return this.makeRequest('GET', `/user/${username}`);
  }

  async updateUser(username, userData) {
    return this.makeRequest('PUT', `/user/${username}`, userData);
  }

  async deleteUser(username) {
    return this.makeRequest('DELETE', `/user/${username}`);
  }

  async createAccount(packageData) {
    const userData = {
      username: `user_${Date.now()}`,
      proxies: {
        vmess: { id: packageData.id },
        vless: { id: packageData.id },
        trojan: { password: packageData.id },
        shadowsocks: { password: packageData.id },
      },
      inbounds: {
        vmess: ['VMess TCP', 'VMess WebSocket'],
        vless: ['VLESS TCP', 'VLESS WebSocket'],
        trojan: ['Trojan TCP', 'Trojan WebSocket'],
        shadowsocks: ['Shadowsocks TCP'],
      },
      expire: Math.floor(Date.now() / 1000) + (packageData.duration * 24 * 60 * 60),
      data_limit: packageData.volume * 1024 * 1024 * 1024, // تبدیل گیگابایت به بایت
      data_limit_reset_strategy: 'no_reset',
    };

    const createdUser = await this.createUser(userData);

    return {
      username: createdUser.username,
      server: process.env.MARZBAN_SERVER_ADDRESS,
      port: process.env.MARZBAN_SERVER_PORT,
      passwordSetupLink: `https://your-domain.com/setup-password?token=${createdUser.token}`,
    };
  }
}

module.exports = new MarzbanService();
