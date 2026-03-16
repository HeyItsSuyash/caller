// Use native fetch and FormData
// No need for 'form-data' require

// Example Sarvam fetch. Sarvam typically accepts form-data for STT.
// Twilio sends mulaw 8kHz. We need to decode it to 16kHz PCM first before STT.
async function getSarvamSTT(pcm16WavBuffer) {
  const url = 'https://api.sarvam.ai/speech-to-text';
  
  const form = new FormData();
  const blob = new Blob([pcm16WavBuffer], { type: 'audio/wav' });
  form.append('file', blob, 'audio.wav');
  form.append('model', 'sarvam-m');
  form.append('language_code', 'hi-IN');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY
      },
      body: form
    });
    
    const data = await response.json();
    if (!response.ok) {
      console.error(`[Sarvam API] HTTP Error ${response.status}:`, data);
      throw new Error(`Sarvam STT Failed: ${response.status}`);
    }
    
    console.log(`[Sarvam API] STT Raw Response:`, JSON.stringify(data));
    console.log(`[Sarvam API] STT Response received successfully. Transcript: "${data.transcript}" (Language: ${data.language_code})`);
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
    if (data.audios && data.audios.length > 0) {
      console.log(`[Sarvam API] TTS Audio received successfully. Bytes Length: ${data.audios[0].length}`);
    } else {
      console.warn(`[Sarvam API] TTS Audio was empty or failed. Response:`, data);
    }
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
