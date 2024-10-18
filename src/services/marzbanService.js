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
      this.tokenExpiration = Date.now() + parseInt(process.env.MARZBAN_TOKEN_REFRESH_INTERVAL);

      return this.token;
    } catch (error) {
      console.error('Error getting Marzban token:', error);
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
      console.error('Error making Marzban API request:', error);
      throw error;
    }
  }

  // Implement other Marzban API methods here
  async createUser(userData) {
    return this.makeRequest('POST', '/user', userData);
  }

  async getUser(username) {
    return this.makeRequest('GET', `/user/${username}`);
  }

  // Add more methods as needed
}

module.exports = new MarzbanService();
