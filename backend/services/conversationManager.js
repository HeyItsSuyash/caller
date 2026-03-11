const { askGeminiStream } = require('./gemini');
const SarvamStreamSTT = require('./sarvam_stream_stt');
const SarvamStreamTTS = require('./sarvam_stream_tts');

/**
 * Manages the state and flow of a single voice conversation session.
 */
class ConversationManager {
    constructor(session, twilioWs) {
        this.session = session; // { phone, history, persona }
        this.twilioWs = twilioWs;
        this.streamSid = null;
        
        // Services
        this.stt = new SarvamStreamSTT(process.env.SARVAM_API_KEY, (msg) => this.handleSttTranscript(msg));
        this.tts = new SarvamStreamTTS(process.env.SARVAM_API_KEY, twilioWs);
        
        // State
        this.currentTranscript = "";
        this.isProcessing = false;
        this.silenceTimer = null;
        this.SILENCE_THRESHOLD = 600; // ms
    }

    async init(streamSid) {
        this.streamSid = streamSid;
        await this.stt.connect();
    }

    /**
     * Handles raw audio chunks from Twilio.
     */
    receiveAudio(base64Audio) {
        if (!this.isProcessing) {
            this.stt.sendAudio(base64Audio);
        }
    }

    /**
     * Handles transcripts from Sarvam STT.
     */
    async handleSttTranscript(msg) {
        // Sarvam STT message format: { type: 'partial'|'final', text: '...' }
        if (msg.type === 'partial') {
            this.currentTranscript = msg.text;
            this.resetSilenceTimer();
        } else if (msg.type === 'final') {
            this.currentTranscript = msg.text;
            console.log(`[ConversationManager] 👂 User said (final): "${this.currentTranscript}"`);
            this.triggerAiTurn();
        }
    }

    resetSilenceTimer() {
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => {
            if (this.currentTranscript.trim()) {
                console.log('[ConversationManager] 🤫 Silence detected, triggering AI...');
                this.triggerAiTurn();
            }
        }, this.SILENCE_THRESHOLD);
    }

    async triggerAiTurn() {
        if (this.isProcessing || !this.currentTranscript.trim()) return;
        
        this.isProcessing = true;
        if (this.silenceTimer) clearTimeout(this.silenceTimer);

        const prompt = this.currentTranscript;
        this.currentTranscript = ""; // Clear for next turn

        try {
            console.log(`[ConversationManager] 🧠 AI thinking for turn: "${prompt}"`);
            
            // 1. Update history
            this.session.history.push({ role: 'user', content: prompt });

            // 2. Stream from Gemini and pipe to TTS
            // Note: We'll implement askGeminiStream to return an async generator/stream
            let fullAiResponse = "";
            const responseStream = askGeminiStream(prompt, this.session.persona.instruction, this.session.history);
            
            // For now, let's collect chunks and stream to TTS as they make sense
            // or just stream the whole thing if Sarvam TTS doesn't support partial text yet.
            // If Sarvam TTS supports streaming text, we can pipe.
            
            for await (const chunk of responseStream) {
                fullAiResponse += chunk;
                // Currently streaming the whole response to TTS for better prosody,
                // but we can optimize by sentence splitting.
            }

            console.log(`[ConversationManager] 🤖 AI Response: "${fullAiResponse}"`);
            this.session.history.push({ role: 'ai', content: fullAiResponse });

            // 3. Generate and stream audio back to Twilio
            await this.tts.streamSpeech(fullAiResponse, this.session.persona.name, this.streamSid);

        } catch (error) {
            console.error('[ConversationManager Error]', error);
        } finally {
            this.isProcessing = false;
        }
    }

    cleanup() {
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        this.stt.close();
        console.log(`[ConversationManager] 🧹 Session cleaned up for ${this.session.phone}`);
    }
}

module.exports = ConversationManager;
