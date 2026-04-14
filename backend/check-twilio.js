require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function check() {
  try {
    const calls = await client.calls.list({limit: 3});
    for (const call of calls) {
      console.log(`Call ${call.sid}: To: ${call.to}, Status: ${call.status}, ErrorCode: ${call.errorCode || 'None'}, Duration: ${call.duration}`);
    }
  } catch(e) {
    console.error(e);
  }
}

check();
