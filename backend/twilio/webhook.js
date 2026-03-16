const twilio = require('twilio');

function handleTwilioWebhook(req, res) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  const serverUrl = process.env.PUBLIC_BASE_URL || process.env.SERVER_URL || 'localhost:3001';
  const wsUrl = serverUrl.replace(/^http/, 'ws');
  // Greet the user immediately when they pick up, then connect the stream!
  twiml.say('Hello! This is Vaani. I am calling from the local demo. How can I help you today?');
  
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
