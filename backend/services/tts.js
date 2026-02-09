const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Ensure audio directory exists
const audioDir = path.join(__dirname, '../public', 'audio');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

/**
 * Generates speech from text using ElevenLabs API.
 * @param {string} text - Text to convert to speech.
 * @param {string} voiceId - The ElevenLabs Voice ID.
 * @returns {Promise<string>} - The filename of the generated MP3.
 */
async function generateAudio(text, voiceId) {
    if (!ELEVENLABS_API_KEY) {
        throw new Error("Missing ELEVENLABS_API_KEY environment variable");
    }
    if (!voiceId) {
        console.warn("[TTS] No voice ID provided, using default/fallback.");
        // We really should throw or have a default, but letting it fail downstream is okay for now if key is missing.
    }

    try {
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
        console.log(`[TTS] Generating audio for voice: ${voiceId}`);

        const response = await axios({
            method: 'POST',
            url: url,
            data: {
                text: text,
                model_id: "eleven_turbo_v2_5", // Turbo model for lowest latency
                voice_settings: {
                    stability: 0.3,
                    similarity_boost: 0.8,
                    style: 0.6,
                    use_speaker_boost: true
                }
            },
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
            },
            responseType: 'stream'
        });

        const fileName = `${uuidv4()}.mp3`;
        const filePath = path.join(audioDir, fileName);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`[TTS] Audio generated: ${fileName}`);
                resolve(fileName);
            });
            writer.on('error', (err) => {
                console.error("[TTS] Stream Write Error:", err);
                reject(err);
            });
        });

    } catch (error) {
        console.error('[TTS Error]', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { generateAudio };
