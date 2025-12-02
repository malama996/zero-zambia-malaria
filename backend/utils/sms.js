const AfricasTalking = require('africastalking');

const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY || 'sandbox', // Fallback for dev
  username: process.env.AT_USERNAME || 'sandbox'
});

async function sendSMS(recipients, message) {
  try {
    const result = await africastalking.SMS.send({
      to: recipients,
      message: message
    });
    console.log('SMS sent:', result);
    return result;
  } catch (err) {
    console.error('SMS error:', err);
    // Don't crash app on SMS fail
    return { error: err.message };
  }
}

module.exports = { sendSMS };
