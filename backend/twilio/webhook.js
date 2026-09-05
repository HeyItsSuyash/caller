const twilio = require('twilio');

function handleTwilioWebhook(req, res) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  const serverUrl = (process.env.PUBLIC_BASE_URL || process.env.SERVER_URL || 'localhost:3001').replace(/\/$/, '');
  const wsUrl = serverUrl.replace(/^https?:\/\//, (match) => match === 'https://' ? 'wss://' : 'ws://');
  // Short greeting before connecting stream
  twiml.say({ voice: 'Polly.Aditi', language: 'en-IN' }, 'Hello! Connecting to Caller AI.');
  
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
