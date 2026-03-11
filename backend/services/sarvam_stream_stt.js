const WebSocket = require('ws');

/**
 * Manages a streaming STT session with Sarvam AI.
 */
class SarvamStreamSTT {
    constructor(apiKey, onTranscript) {
        this.apiKey = apiKey;
        this.onTranscript = onTranscript;
        this.ws = null;
        this.isConnected = false;
        this.baseUrl = 'wss://api.sarvam.ai/v1/speech-to-text-stream';
    }

    connect() {
        return new Promise((resolve, reject) => {
            console.log('[Sarvam Stream STT] Connecting to Sarvam WebSocket...');
            
            // Note: Sarvam might require query params or specific headers
            this.ws = new WebSocket(this.baseUrl, {
                headers: {
                    'api-subscription-key': this.apiKey
                }
            });

            this.ws.on('open', () => {
                console.log('[Sarvam Stream STT] Connected successfully');
                this.isConnected = true;
                
                // Initial configuration message if required by Sarvam
                this.ws.send(JSON.stringify({
                    type: 'configure',
                    model: 'saaras:v1',
                    language_code: 'en-IN',
                    audio_format: 'mulaw',
                    sample_rate: 8000
                }));
                
                resolve();
            });

            this.ws.on('message', (data) => {
                try {
                    const msg = JSON.parse(data);
                    if (this.onTranscript) {
                        this.onTranscript(msg);
                    }
                } catch (e) {
                    console.error('[Sarvam Stream STT] Error parsing message:', e);
                }
            });

            this.ws.on('error', (err) => {
                console.error('[Sarvam Stream STT] WebSocket Error:', err);
                reject(err);
            });

            this.ws.on('close', () => {
                console.log('[Sarvam Stream STT] Connection closed');
                this.isConnected = false;
            });
        });
    }

    /**
     * Sends a base64 encoded audio chunk to Sarvam.
     * @param {string} base64Audio 
     */
    sendAudio(base64Audio) {
        if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'audio',
                data: base64Audio
            }));
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

module.exports = SarvamStreamSTT;
