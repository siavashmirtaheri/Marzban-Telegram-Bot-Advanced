
const { sendRequest } = require('../services/marzbanApi');

// Activate referral system for a user
async function activateReferral(ctx, userId) {
  try {
    await sendRequest(`/api/user/${userId}/referral/activate`, 'POST');
    ctx.reply('✅ Referral system activated for the user.');
  } catch (error) {
    console.error('Error activating referral:', error);
    ctx.reply('⛔ Failed to activate referral system.');
  }
}

// View referral status for a user
async function viewReferralStatus(ctx, userId) {
  try {
    const referral = await sendRequest(`/api/user/${userId}/referral`, 'GET');
    ctx.reply(`📊 Number of referrals: ${referral.referrals.length}`);
  } catch (error) {
    console.error('Error fetching referral status:', error);
    ctx.reply('⛔ Failed to fetch referral status.');
  }
}

module.exports = { activateReferral, viewReferralStatus };
