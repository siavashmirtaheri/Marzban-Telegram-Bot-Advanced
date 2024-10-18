const axios = require('axios');

let token = null;
let tokenExpiration = null;

async function getToken(serverUrl, username, password) {
  if (token && tokenExpiration > Date.now()) {
    return token;
  }

  try {
    const response = await axios.post(`${serverUrl}/api/admin/token`, {
      username,
      password
    });

    token = response.data.access_token;
    tokenExpiration = Date.now() + (response.data.expires_in * 1000);
    return token;
  } catch (error) {
    console.error('Error obtaining Marzban token:', error);
    throw error;
  }
}

module.exports = { getToken };
