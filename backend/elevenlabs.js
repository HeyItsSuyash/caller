const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Ensure audio directory exists
const audioDir = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

async function generateSpeech(text, voiceId) {
    if (!ELEVENLABS_API_KEY) {
        console.error("Missing ELEVENLABS_API_KEY");
        throw new Error("Missing ElevenLabs API Key");
    }

    try {
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
        console.log(`[ElevenLabs] Generating speech for voice: ${voiceId}`);

        const response = await axios({
            method: 'POST',
            url: url,
            data: {
                text: text,
                model_id: "eleven_monolingual_v1", // or eleven_turbo_v2 for lower latency
                voice_settings: {
                    stability: 0.3,
                    similarity_boost: 0.7,
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
                console.log(`[ElevenLabs] Audio saved to ${fileName}`);
                resolve(fileName);
            });
            writer.on('error', reject);
        });

    } catch (error) {
        console.error('[ElevenLabs Error]', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { generateSpeech };
