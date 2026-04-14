require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function check() {
  try {
    const calls = await client.calls.list({ limit: 1 });
    const callSid = calls[0].sid;
    console.log(`Latest Call SID: ${callSid}`);

    // Get notifications for this call
    const notifications = await client.calls(callSid).notifications.list({ limit: 5 });
    if (notifications.length === 0) {
      console.log('No warnings or errors found for this call by Twilio.');
    } else {
      for (const n of notifications) {
        console.log(`[Error ${n.errorCode}] ${n.messageText}`);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

check();
