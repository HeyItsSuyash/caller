// Use native fetch and FormData

// Send 16kHz PCM WAV buffer to Groq's Whisper model
async function getGroqSTT(pcm16WavBuffer) {
  const url = 'https://api.groq.com/openai/v1/audio/transcriptions';
  
  const form = new FormData();
  const blob = new Blob([pcm16WavBuffer], { type: 'audio/wav' });
  form.append('file', blob, 'audio.wav');
  form.append('model', 'whisper-large-v3-turbo'); // Fast and excellent at Hindi/English
  form.append('prompt', 'Hindi and English mixed Hinglish.'); 
  form.append('response_format', 'json');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: form
    });
    
    const data = await response.json();
    if (!response.ok) {
      console.error(`[Groq STT] HTTP Error ${response.status}:`, data);
      throw new Error(`Groq STT Failed: ${response.status}`);
    }
    
    console.log(`[Groq STT] Response received successfully. Transcript: "${data.text}"`);
    return { transcript: data.text, language_code: 'hi' }; // Force 'hi' so LLM responds freely in Hinglish
  } catch (err) {
    console.error("Groq STT Error:", err);
    return null;
  }
}

const googleTTS = require('google-tts-api');

// Generate MP3 audio buffer from Free Google TTS
async function getGoogleTTS(text, language = 'hi') {
  try {
    // Generate the audio URL using the free Google Translate TTS engine
    const url = googleTTS.getAudioUrl(text, {
      lang: language.includes('en') ? 'en-IN' : 'hi-IN',
      slow: false,
      host: 'https://translate.google.com',
    });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google TTS Failed: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`[Google TTS] Audio received successfully. Bytes Length: ${buffer.length}`);
    return buffer; // Returns MP3 buffer, exactly like ElevenLabs did
  } catch (err) {
    console.error("Google TTS Error:", err);
    return null;
  }
}

module.exports = {
  getGroqSTT,
  getGoogleTTS
};
