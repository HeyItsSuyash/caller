const fs = require('fs');
const FormData = require('form-data');

// Example Sarvam fetch. Sarvam typically accepts form-data for STT.
// Twilio sends mulaw 8kHz. We need to decode it to 16kHz PCM first before STT.
async function getSarvamSTT(pcm16WavBuffer) {
  const url = 'https://api.sarvam.ai/speech-to-text';
  
  const form = new FormData();
  form.append('file', pcm16WavBuffer, {
    filename: 'audio.wav',
    contentType: 'audio/wav',
  });
  form.append('model', 'sarvam-m');
  form.append('language_code', 'hi-IN'); // hi-IN allows auto-detecting English as well per requirements

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY,
        // FormData boundary headers are automatically set by node-fetch/form-data integration,
        // but we'll use form.getHeaders().
        ...form.getHeaders()
      },
      body: form
    });
    const data = await response.json();
    return data; // Expected { transcript: "...", ... }
  } catch (err) {
    console.error("Sarvam STT Error:", err);
    return null;
  }
}

async function getSarvamTTS(text, language = 'hi') {
  const url = 'https://api.sarvam.ai/text-to-speech';
  
  // Choose speaker based on language preference
  const isEnglish = language.toLowerCase() === 'en' || language.toLowerCase() === 'english';
  const speaker = isEnglish ? 'maya' : 'meera';
  const languageCode = isEnglish ? 'en-IN' : 'hi-IN';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: languageCode,
        speaker: speaker,
        model: 'bulbul:v1',
        enable_preprocessing: true
      })
    });
    
    // Sarvam returns { audios: ["base64_encoded_audio"] }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Sarvam TTS Error:", err);
    return null;
  }
}

module.exports = {
  getSarvamSTT,
  getSarvamTTS
};
