const twilio = require('twilio');

function handleTwilioWebhook(req, res) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  const serverUrl = process.env.PUBLIC_BASE_URL || process.env.SERVER_URL || 'localhost:3001';
  const wsUrl = serverUrl.replace(/^http/, 'ws');
  // Greet the user immediately when they pick up using an Indian-accented voice!
  twiml.say({ voice: 'Polly.Aditi', language: 'en-IN' }, 'Hello! This is CALLER AI. Technical demo call connected successfully. Please wait a moment while I connect the voice stream.');
  
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
