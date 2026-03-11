const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_BASE_URL = process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai';

const audioDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

/**
 * Generates speech from text using Sarvam AI.
 * @param {string} text - Text to convert to speech.
 * @param {string} persona - Persona name to map to Sarvam voice (e.g. 'neelum' or 'neel').
 * @returns {Promise<string>} - The filename of the generated MP3/WAV.
 */
async function generateSpeech(text, persona) {
    if (!SARVAM_API_KEY) {
        throw new Error("Missing SARVAM_API_KEY environment variable");
    }

    // Map personas to Sarvam voices
    const voiceMap = {
        neelum: "female_calm",
        neel: "male_friendly"
    };

    const targetVoice = voiceMap[persona.toLowerCase()] || "female_calm";

    try {
        console.log(`[Sarvam TTS] 🔊 Generating audio for voice: ${targetVoice}`);

        const response = await axios.post(
            `${SARVAM_BASE_URL}/text-to-speech`,
            {
                inputs: [text],
                target_language_code: "en-IN",
                speaker: targetVoice,
                pitch: 0,
                pace: 1.0,
                loudness: 1.5,
                speech_sample_rate: 8000,
                enable_preprocessing: true,
                model: "bulbul:v1"
            },
            {
                headers: {
                    'api-subscription-key': SARVAM_API_KEY,
                    'Content-Type': 'application/json',
                }
            }
        );

        const filename = `${uuidv4()}.wav`;
        const filePath = path.join(audioDir, filename);

        // Sarvam usually returns the audio base64 encoded strings in an array named 'audios'
        if (response.data && response.data.audios && response.data.audios.length > 0) {
            fs.writeFileSync(filePath, Buffer.from(response.data.audios[0], 'base64'));
        } else {
             throw new Error("No audio data found in Sarvam response");
        }

        console.log(`[Sarvam TTS] ✅ Audio generated: ${filename}`);
        return filename;

    } catch (error) {
        console.error('[Sarvam TTS Error]', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { generateSpeech };
