const twilio = require('twilio');

async function initiateOutboundCall(req, res) {
  const { to } = req.body;
  
  if (!to) {
    return res.status(400).json({ error: 'Missing phone number (to)' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const serverUrl = process.env.PUBLIC_BASE_URL || process.env.SERVER_URL;

  if (!accountSid || !authToken || !from || !serverUrl) {
    return res.status(500).json({ error: 'Twilio configuration missing in server environment' });
  }

  const client = twilio(accountSid, authToken);

  try {
    const call = await client.calls.create({
      url: `${serverUrl}/twilio/voice`,
      to: to,
      from: from,
    });
    res.json({ success: true, callSid: call.sid });
  } catch (err) {
    console.error('Error initiating call:', err);
    res.status(500).json({ error: 'Failed to initiate call', details: err.message });
  }
}

module.exports = {
  initiateOutboundCall
};
