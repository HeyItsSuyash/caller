const axios = require('axios');
const WebSocket = require('ws');

/**
 * Manages a streaming TTS session with Sarvam AI.
 */
class SarvamStreamTTS {
    constructor(apiKey, twilioWs) {
        this.apiKey = apiKey;
        this.twilioWs = twilioWs;
        this.baseUrl = process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai';
    }

    /**
     * Generates and streams speech from text.
     * @param {string} text - The text to convert to speech.
     * @param {string} persona - The persona name to map to a Sarvam voice.
     * @param {string} streamSid - Twilio Stream SID to target.
     */
    async streamSpeech(text, persona, streamSid) {
        const voiceMap = {
            neelum: "female_calm",
            neel: "male_friendly"
        };
        const targetVoice = voiceMap[persona.toLowerCase()] || "female_calm";

        console.log(`[Sarvam Stream TTS] 🔊 Streaming audio for: "${text.substring(0, 30)}..."`);

        try {
            // Note: Using Sarvam's TTS API with streaming enabled.
            // Some versions of the API return a stream of audio chunks.
            const response = await axios({
                method: 'post',
                url: `${this.baseUrl}/text-to-speech`,
                data: {
                    inputs: [text],
                    target_language_code: "en-IN",
                    speaker: targetVoice,
                    pitch: 0,
                    pace: 1.0,
                    loudness: 1.5,
                    speech_sample_rate: 8, // 8kHz for Twilio
                    enable_preprocessing: true,
                    model: "bulbul:v1"
                },
                headers: {
                    'api-subscription-key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                responseType: 'stream'
            });

            response.data.on('data', (chunk) => {
                // Assuming the chunk is raw μ-law audio or standard PCM that needs conversion.
                // Twilio expects base64 encoded payload in media events.
                // For this implementation, we assume Sarvam provides 8kHz μ-law directly or we convert.
                
                // If it's base64 encoded in the response stream JSON or raw binary:
                // For now, let's assume it's binary and we encode it.
                this.twilioWs.send(JSON.stringify({
                    event: 'media',
                    streamSid: streamSid,
                    media: {
                        payload: chunk.toString('base64')
                    }
                }));
            });

            return new Promise((resolve, reject) => {
                response.data.on('end', () => {
                    console.log('[Sarvam Stream TTS] ✅ Streaming complete');
                    resolve();
                });
                response.data.on('error', (err) => {
                    console.error('[Sarvam Stream TTS] Stream error:', err);
                    reject(err);
                });
            });

        } catch (error) {
            console.error('[Sarvam Stream TTS Error]', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

module.exports = SarvamStreamTTS;
