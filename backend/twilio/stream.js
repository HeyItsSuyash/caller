const { getCallSession, addTurn, createCallSession, updateCallSession } = require('../state/calls');
const { getGroqSTT, getGoogleTTS } = require('../services/speech');
const { getLLMResponse, summarizeCall } = require('../services/llm');
const { getCallMemory, saveCallSummary } = require('../services/mongodb');
const { spawn } = require('child_process');

// Twilio → CALLER AI: raw mulaw 8kHz chunks → PCM WAV 16kHz Buffer
function mulawToWavBuffer(mulawBase64Chunks) {
  return new Promise((resolve, reject) => {
    const inputBuffer = Buffer.concat(
      mulawBase64Chunks.map(c => Buffer.from(c, 'base64'))
    );

    const ffmpeg = spawn('ffmpeg', [
      '-f', 'mulaw',
      '-ar', '8000',
      '-ac', '1',
      '-i', 'pipe:0',
      '-ar', '16000',
      '-ac', '1',
      '-f', 'wav',
      '-acodec', 'pcm_s16le',
      'pipe:1',
    ]);

    const chunks = [];
    ffmpeg.stdout.on('data', d => chunks.push(d));
    ffmpeg.stdout.on('end', () => resolve(Buffer.concat(chunks)));
    ffmpeg.stderr.on('data', () => {});
    ffmpeg.on('error', reject);

    ffmpeg.stdin.write(inputBuffer);
    ffmpeg.stdin.end();
  });
}

// CALLER AI → Twilio: WAV Buffer → mulaw 8kHz buffer
function wavToMulawBuffer(wavBuffer) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', 'pipe:0',
      '-ar', '8000',
      '-ac', '1',
      '-f', 'mulaw',
      '-acodec', 'pcm_mulaw',
      'pipe:1',
    ]);

    const chunks = [];
    ffmpeg.stdout.on('data', d => chunks.push(d));
    // Returning a raw Buffer, so the existing chunkSize splitting logic below stays exactly the same
    ffmpeg.stdout.on('end', () => resolve(Buffer.concat(chunks)));
    ffmpeg.stderr.on('data', () => {});
    ffmpeg.on('error', reject);

    ffmpeg.stdin.write(wavBuffer);
    ffmpeg.stdin.end();
  });
}

function handleStreamConnection(ws) {
  let streamSid = null;
  let callSid = null;
  let audioBuffer = [];
  let isAIProcessing = false;
  let silenceTimer = null;
  const SILENCE_THRESHOLD_MS = 800; // Trigger STT after 0.8s of no audio for near real-time response
  
  ws.on('message', async (message) => {
    const msg = JSON.parse(message);
    
    if (msg.event === 'start') {
      streamSid = msg.start.streamSid;
      callSid = msg.start.callSid;
      console.log(`Stream started: ${streamSid} for call: ${callSid}`);
      
      // Initialize state if not already done by outbound
      let session = getCallSession(callSid);
      if (!session) {
        session = createCallSession(callSid);
      }

      // FETCH MEMORY from MongoDB
      if (session.phoneNumber && session.phoneNumber !== 'unknown') {
        console.log(`[MongoDB] Fetching previous summaries for ${session.phoneNumber}...`);
        getCallMemory(session.phoneNumber).then(memory => {
          if (memory && memory.length > 0) {
            console.log(`[MongoDB] Found ${memory.length} previous interactions for ${session.phoneNumber}`);
            updateCallSession(callSid, { memory });
          }
        });
      }

    } else if (msg.event === 'media') {
      if (isAIProcessing) {
        // Half-duplex MVP: do not collect audio or trigger STT while the AI is listening/speaking
        return;
      }

      const payloadBuffer = Buffer.from(msg.media.payload, 'base64');

      // VAD heuristic for mulaw
      let loudCount = 0;
      for (let i = 0; i < payloadBuffer.length; i++) {
        let val = payloadBuffer[i];
        let amp = val < 128 ? 127 - val : 255 - val;
        if (amp > 20) loudCount++;
      }

      // Only reset timer if active loud speech is detected
      if (loudCount > 15) {
        audioBuffer.push(msg.media.payload);
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          processUtterance();
        }, SILENCE_THRESHOLD_MS);
      } else if (audioBuffer.length > 0) {
        // Add trailing silence to the utterance, but let timer naturally expire
        audioBuffer.push(msg.media.payload);
      }
      
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
      // 1. Decode & Resample asynchronously
      const pcm16Wav = await mulawToWavBuffer(currentAudio);
      
      // 2. STT (Groq Whisper)
      console.log(`\n--- [${callSid}] AUDIO CHUNK RECEIVED ---`);
      console.log(`[${callSid}] Sending ${pcm16Wav.length} bytes of audio to Groq Whisper STT...`);
      const sttResult = await getGroqSTT(pcm16Wav);
      
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

      // Broadcast to Frontend
      if (global.broadcastEvent) {
        console.log(`[Stream] Broadcasting user transcript: ${sttResult.transcript}`);
        global.broadcastEvent('transcript', {
          speaker: 'user',
          text: sttResult.transcript,
          id: Date.now()
        });
      }

      const session = getCallSession(callSid);

      // 3. LLM (CALLER AI)
      console.log(`\n--- [${callSid}] LLM PROCESSING ---`);
      console.log(`[${callSid}] Querying CALLER AI LLM...`);
      const aiResponse = await getLLMResponse(session.turns, sttResult.transcript, session.memory || []);
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

      // Broadcast to Frontend
      if (global.broadcastEvent) {
        console.log(`[Stream] Broadcasting AI transcript: ${aiResponse.spoken}`);
        global.broadcastEvent('transcript', {
          speaker: 'ai',
          text: aiResponse.spoken,
          id: Date.now()
        });
      }

      // 4. TTS (Google TTS)
      console.log(`\n--- [${callSid}] TTS GENERATION ---`);
      console.log(`[${callSid}] Requesting TTS from Google for text: "${aiResponse.spoken}"...`);
      const ttsBuffer = await getGoogleTTS(aiResponse.spoken, aiResponse.language);
      if (ttsBuffer) {
        // 5. Encode back to mulaw and send to Twilio
        const rawMulaw = await wavToMulawBuffer(ttsBuffer);
        
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
  if (!session) {
    console.error(`[${callSid}] Error: No session found for summary generation.`);
    return;
  }
  
  if (session.turns.length === 0) {
    console.log(`[${callSid}] No conversation turns detected. Skipping summary.`);
    return;
  }
  
  console.log(`[${callSid}] Generating post-call summary and intent for ${session.turns.length} turns...`);
  const summary = await summarizeCall(session.turns);
  
  if (summary) {
    updateCallSession(callSid, {
      summary: summary,
      resolution_status: summary.resolution || 'pending'
    });
    console.log(`[${callSid}] Summary generated: "${summary.summary.substring(0, 50)}..."`);
    
    // SAVE TO MongoDB
    if (session.phoneNumber && session.phoneNumber !== 'unknown') {
      console.log(`[MongoDB] Attempting to save summary for ${session.phoneNumber}...`);
      try {
        await saveCallSummary(session.phoneNumber, summary);
        console.log(`[MongoDB] Summary saved successfully for ${session.phoneNumber}`);
      } catch (err) {
        console.error(`[MongoDB] FATAL Error saving summary for ${session.phoneNumber}:`, err.message);
        if (err.details) console.error(`[MongoDB] Error Details:`, err.details);
      }
    } else {
      console.warn(`[MongoDB] Cannot save summary: Phone number is "${session.phoneNumber}". Ensure outbound call initialized it.`);
    }
  } else {
    console.error(`[${callSid}] Failed to generate summary from LLM.`);
  }
}

module.exports = {
  handleStreamConnection
};
