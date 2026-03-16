const twilio = require('twilio');

function handleTwilioWebhook(req, res) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  const serverUrl = process.env.SERVER_URL || 'localhost:3001';
  const wsUrl = serverUrl.replace(/^http/, 'ws');
  
  const connect = twiml.connect();
  connect.stream({
    url: `${wsUrl}/twilio/stream`
  });
  
  res.type('text/xml');
  res.send(twiml.toString());
}

module.exports = {
  handleTwilioWebhook
};
