const WebSocket = require('ws');

// Function to convert Mulaw to PCM (16-bit)
function mulawToPcm(mulaw) {
    const table = new Int16Array(256);
    for (let i = 0; i < 256; i++) {
        let ulaw = ~i;
        let sign = ulaw & 0x80;
        let exponent = (ulaw >> 4) & 0x07;
        let mantissa = ulaw & 0x0F;
        let sample = 0;
        if (exponent === 0) {
            sample = (mantissa << 1) + 1;
        } else {
            sample = ((mantissa << 1) + 33) << exponent;
        }
        sample -= 33;
        if (sign === 0) sample = -sample;
        table[i] = sample;
    }
    const pcm = new Int16Array(mulaw.length);
    for (let i = 0; i < mulaw.length; i++) {
        pcm[i] = table[mulaw[i]];
    }
    return Buffer.from(pcm.buffer);
}

// Function to convert PCM (16-bit) to Mulaw
function pcmToMulaw(pcm) {
    const table = new Int16Array(256); // Re-use table generation logic if improved accuracy needed, but linear approx is fine for voice
    // Simplified μ-law compression
    const mulaw = new Uint8Array(pcm.length / 2);
    for (let i = 0; i < mulaw.length; i++) {
        let sample = pcm.readInt16LE(i * 2);
        const sign = (sample < 0) ? 0x80 : 0;
        if (sample < 0) sample = -sample;
        sample += 33;
        if (sample > 32767) sample = 32767;

        const exponent = Math.floor(Math.log2(sample)) - 5;
        const mantissa = (sample >> (exponent > 0 ? exponent : 0)) & 0x0F;
        const ulaw = ~(sign | (exponent << 4) | mantissa);
        mulaw[i] = ulaw;
    }
    return Buffer.from(mulaw);
}

// Simple Resampler (Linear Interpolation)
function resample(buffer, fromRate, toRate) {
    if (fromRate === toRate) return buffer;

    // Convert buffer to Int16Array
    const input = new Int16Array(buffer.buffer, buffer.byteOffset, buffer.length / 2);
    const ratio = fromRate / toRate;
    const outputLength = Math.round(input.length / ratio);
    const output = new Int16Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
        const position = i * ratio;
        const index = Math.floor(position);
        const fraction = position - index;

        if (index + 1 < input.length) {
            const val1 = input[index];
            const val2 = input[index + 1];
            output[i] = val1 + (val2 - val1) * fraction;
        } else {
            output[i] = input[index] || 0;
        }
    }
    return Buffer.from(output.buffer);
}


class GeminiLiveStream {
    constructor(apiKey, persona, onAudio, onText) {
        this.apiKey = apiKey;
        this.model = "gemini-2.0-flash-exp"; // Or latest supported model
        this.ws = null;
        this.onAudio = onAudio; // Callback for audio output to Twilio
        this.onText = onText;   // Callback for text output (logs)
        this.persona = persona;
        this.isConnected = false;
    }

    connect() {
        // Construct the WebSocket URL for the Multimodal Live API
        const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;

        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            console.log('[Gemini Live] Connected');
            this.isConnected = true;
            // Send Initial Setup
            this.sendSetup();
        });

        this.ws.on('message', (data) => {
            this.handleMessage(data);
        });

        this.ws.on('close', () => {
            console.log('[Gemini Live] Disconnected');
            this.isConnected = false;
        });

        this.ws.on('error', (err) => {
            console.error('[Gemini Live] Error:', err);
        });
    }

    sendSetup() {
        const setupMessage = {
            setup: {
                model: `models/${this.model}`,
                generation_config: {
                    response_modalities: ["AUDIO"],
                    speech_config: {
                        voice_config: { prebuilt_voice_config: { voice_name: "Puck" } } // "Puck" is generic, adjust based on persona
                    }
                },
                system_instruction: {
                    parts: [{ text: this.persona.instruction }]
                }
            }
        };
        this.ws.send(JSON.stringify(setupMessage));
        console.log('[Gemini Live] Setup sent');
    }

    sendAudio(mulawChunk) { // Input: Mulaw 8000Hz
        if (!this.isConnected) return;

        // 1. Convert Mulaw to PCM 16-bit (8000Hz)
        const pcm8k = mulawToPcm(Buffer.from(mulawChunk, 'base64'));

        // 2. Resample 8k -> 16k (Gemini Preferred Minimum) or 24k
        const pcm16k = resample(pcm8k, 8000, 16000);

        // 3. Send to Gemini
        const message = {
            realtime_input: {
                media_chunks: [{
                    mime_type: "audio/pcm",
                    data: pcm16k.toString('base64')
                }]
            }
        };
        this.ws.send(JSON.stringify(message));
    }

    handleMessage(data) {
        try {
            // Gemini sends a Blob/Buffer if binary, or Text if JSON
            let msg;
            if (data instanceof Buffer) {
                msg = JSON.parse(data.toString());
            } else {
                msg = JSON.parse(data);
            }

            if (msg.serverContent && msg.serverContent.modelTurn) {
                const parts = msg.serverContent.modelTurn.parts;
                for (const part of parts) {
                    if (part.text) {
                        console.log(`[Gemini Text] ${part.text}`);
                        if (this.onText) this.onText(part.text);
                    }
                    if (part.inlineData) {
                        // Audio Output from Gemini (PCM 24kHz usually)
                        const pcm24k = Buffer.from(part.inlineData.data, 'base64');

                        // 1. Resample 24k -> 8k
                        const pcm8k = resample(pcm24k, 24000, 8000);

                        // 2. Convert PCM -> Mulaw
                        const mulaw = pcmToMulaw(pcm8k);

                        if (this.onAudio) this.onAudio(mulaw.toString('base64'));
                    }
                }
            }
        } catch (e) {
            console.error('[Gemini Live] Error parsing message:', e);
        }
    }

    close() {
        if (this.ws) this.ws.close();
    }
}

module.exports = GeminiLiveStream;
