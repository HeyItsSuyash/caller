const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { convertTo16kHzMonoWav } = require('./audio_utils');

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_BASE_URL = process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai';

const tmpDir = path.join(__dirname, '..', 'tmp');
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
}

/**
 * Downloads a Twilio recording, converts it, and transcribes using Sarvam AI.
 * @param {string} recordingUrl - The URL from Twilio's RecordingUrl parameter.
 * @returns {Promise<string>} - The transcribed text.
 */
async function transcribeAudioFromUrl(recordingUrl) {
    if (!SARVAM_API_KEY) throw new Error("Missing SARVAM_API_KEY");

    const rawAudioPath = path.join(tmpDir, `${uuidv4()}_raw.wav`);
    const processedAudioPath = path.join(tmpDir, `${uuidv4()}_16khz.wav`);

    try {
        console.log(`[Sarvam STT] 📥 Downloading audio from Twilio...`);
        // 1. Download audio
        const response = await axios({
            method: 'GET',
            url: recordingUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(rawAudioPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log(`[Sarvam STT] ⚙️ Converting audio to 16kHz Mono WAV...`);
        // 2. Convert audio
        await convertTo16kHzMonoWav(rawAudioPath, processedAudioPath);

        console.log(`[Sarvam STT] 🎙️ Sending to Sarvam STT API...`);
        // 3. Send to Sarvam API
        const audioBuffer = fs.readFileSync(processedAudioPath);

        const sarvamResponse = await axios.post(
            `${SARVAM_BASE_URL}/speech-to-text`,
            audioBuffer,
            {
                headers: {
                    Authorization: `Bearer ${SARVAM_API_KEY}`,
                    'Content-Type': 'audio/wav',
                }
            }
        );

        const transcription = sarvamResponse.data.text || sarvamResponse.data.transcript;
        console.log(`[Sarvam STT] 🧠 Transcription result: "${transcription}"`);

        return transcription || '';

    } catch (error) {
        console.error('[Sarvam STT Error]', error.response ? error.response.data : error.message);
        throw error;
    } finally {
        // Clean up tmp files
        if (fs.existsSync(rawAudioPath)) fs.unlinkSync(rawAudioPath);
        if (fs.existsSync(processedAudioPath)) fs.unlinkSync(processedAudioPath);
    }
}

module.exports = { transcribeAudioFromUrl };
