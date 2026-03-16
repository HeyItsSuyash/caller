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

// Generate MP3 audio buffer from ElevenLabs TTL
async function getElevenLabsTTS(text, language = 'hi') {
  // Use the Neelam voice ID from the .env, fallback to a standard one
  const voiceId = process.env.VOICE_ID_NEELAM || '1zUSi8LeHs9M2mV8X6YS';
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2', // Required for Hindi support
        voice_settings: {
          similarity_boost: 0.5,
          stability: 0.5
        }
      })
    });
    
    if (!response.ok) {
      const data = await response.json();
      console.error(`[ElevenLabs API] HTTP Error ${response.status}:`, data);
      throw new Error(`ElevenLabs TTS Failed: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`[ElevenLabs API] TTS Audio received successfully. Bytes Length: ${buffer.length}`);
    return buffer; // Natively an MP3 buffer
  } catch (err) {
    console.error("ElevenLabs TTS Error:", err);
    return null;
  }
}

module.exports = {
  getGroqSTT,
  getElevenLabsTTS
};
