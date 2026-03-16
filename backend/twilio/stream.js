const { WaveFile } = require('wavefile');
const { getCallSession, addTurn, createCallSession } = require('../state/calls');
const { getSarvamSTT, getSarvamTTS } = require('../services/sarvam');
const { getGroqResponse, summarizeCall } = require('../services/groq');
const { updateCallSession } = require('../state/calls');

// Helper to convert mulaw base64 to 16kHz PCM WAV
function mulawToWavBuffer(base64MulawChunks) {
  const mulawBuffer = Buffer.concat(base64MulawChunks.map(c => Buffer.from(c, 'base64')));
  
  const wav = new WaveFile();
  // 8000 Hz, 8-bit mulaw (encoding code 7)
  wav.fromScratch(1, 8000, '8m', mulawBuffer);
  // Resample to 16000 Hz for Sarvam
  wav.toSampleRate(16000);
  // Convert to 16-bit PCM (encoding code 1)
  wav.toBitDepth('16');
  
  return wav.toBuffer();
}

// Helper to convert 16kHz PCM base64 (or buffer) to a raw mulaw buffer
function wavToMulawBuffer(wavBuffer) {
  const wav = new WaveFile(wavBuffer);
  wav.toSampleRate(8000);
  wav.toBitDepth('8m');
  
  // The samples are in wav.data.samples after conversion
  // Extract raw mulaw data buffer
  return Buffer.from(wav.data.samples);
}

function handleStreamConnection(ws) {
  let streamSid = null;
  let callSid = null;
  let audioBuffer = [];
  let isAIProcessing = false;
  let silenceTimer = null;
  const SILENCE_THRESHOLD_MS = 1500; // Trigger STT after 1.5s of no audio
  
  ws.on('message', async (message) => {
    const msg = JSON.parse(message);
    
    if (msg.event === 'start') {
      streamSid = msg.start.streamSid;
      callSid = msg.start.callSid;
      console.log(`Stream started: ${streamSid} for call: ${callSid}`);
      // Initialize state
      if (!getCallSession(callSid)) {
        createCallSession(callSid);
      }
    } else if (msg.event === 'media') {
      if (isAIProcessing) {
        // Half-duplex MVP: do not collect audio or trigger STT while the AI is listening/speaking
        // This avoids echoing itself and background noise triggering a self-interruption loop.
        return;
      }

      audioBuffer.push(msg.media.payload);

      // Reset silence timer
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        processUtterance();
      }, SILENCE_THRESHOLD_MS);
      
    } else if (msg.event === 'mark') {
      console.log(`[${callSid}] AI finished speaking, unlocking audio capture`);
      isAIProcessing = false;
      audioBuffer = []; // Clear any residual noise buffer
    } else if (msg.event === 'stop') {
      console.log(`Stream stopped: ${streamSid}`);
      processPostCallSummary(callSid);
    }
  });

  async function processUtterance() {
    if (audioBuffer.length === 0 || isAIProcessing) return;
    
    isAIProcessing = true;
    const currentAudio = [...audioBuffer];
    audioBuffer = []; // Clear for next utterance
    
    try {
      // 1. Decode & Resample
      const pcm16Wav = mulawToWavBuffer(currentAudio);
      
      // 2. STT (Sarvam)
      console.log(`\n--- [${callSid}] AUDIO CHUNK RECEIVED ---`);
      console.log(`[${callSid}] Sending ${pcm16Wav.length} bytes of audio to Sarvam STT...`);
      const sttResult = await getSarvamSTT(pcm16Wav);
      
      if (!sttResult || !sttResult.transcript || sttResult.transcript.trim() === '') {
        isAIProcessing = false;
        return;
      }
      
      console.log(`[${callSid}] User said: ${sttResult.transcript}`);
      addTurn(callSid, {
        timestamp: new Date().toISOString(),
        speaker: 'user',
        text: sttResult.transcript,
        language: sttResult.language_code || 'hi' // fallback
      });

      const session = getCallSession(callSid);

      // 3. LLM (Groq)
      console.log(`\n--- [${callSid}] LLM PROCESSING ---`);
      console.log(`[${callSid}] Querying Groq LLM with prompt from conversational history...`);
      const aiResponse = await getGroqResponse(session.turns, sttResult.transcript);
      console.log(`[${callSid}] LLM Answer Object:`, JSON.stringify(aiResponse, null, 2));
      console.log(`[${callSid}] AI will say: "${aiResponse.spoken}" (Language: ${aiResponse.language})`);
      
      addTurn(callSid, {
        timestamp: new Date().toISOString(),
        speaker: 'ai',
        text: aiResponse.spoken,
        intent: aiResponse.intent,
        entities: aiResponse.entities,
        sentiment: aiResponse.sentiment,
        language: aiResponse.language
      });
      // Optionally emit to frontend via SSE here

      // 4. TTS (Sarvam)
      console.log(`\n--- [${callSid}] TTS GENERATION ---`);
      console.log(`[${callSid}] Requesting TTS from Sarvam for text: "${aiResponse.spoken}"...`);
      const ttsResult = await getSarvamTTS(aiResponse.spoken, aiResponse.language);
      if (ttsResult && ttsResult.audios && ttsResult.audios.length > 0) {
        // 5. Encode back to mulaw and send to Twilio
        const base64Wav = ttsResult.audios[0];
        const wavBuffer = Buffer.from(base64Wav, 'base64');
        const rawMulaw = wavToMulawBuffer(wavBuffer);
        
        // Chunk and send audio to prevent websocket buffer overload
        const chunkSize = 4000;
        for (let i = 0; i < rawMulaw.length; i += chunkSize) {
          const chunk = rawMulaw.slice(i, i + chunkSize);
          ws.send(JSON.stringify({
            event: 'media',
            streamSid: streamSid,
            media: {
              payload: chunk.toString('base64')
            }
          }));
        }

        // Send Mark to release half-duplex lock
        ws.send(JSON.stringify({
          event: 'mark',
          streamSid: streamSid,
          mark: { name: 'ai_done' }
        }));
      } else {
         isAIProcessing = false; // no audio returned
      }

    } catch (e) {
      console.error(`[${callSid}] Error in audio pipeline:`, e);
      isAIProcessing = false;
    }
  }
}

async function processPostCallSummary(callSid) {
  const session = getCallSession(callSid);
  if (!session) return;
  
  if (session.turns.length === 0) return;
  
  console.log(`[${callSid}] Generating post-call summary...`);
  const summary = await summarizeCall(session.turns);
  
  if (summary) {
    updateCallSession(callSid, {
      summary: summary,
      resolution_status: summary.resolution || 'pending'
    });
    console.log(`[${callSid}] Summary generated:`, summary.summary);
  }
}

module.exports = {
  handleStreamConnection
};
