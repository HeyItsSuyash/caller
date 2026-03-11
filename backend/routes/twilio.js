const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const router = express.Router();
const { askGemini } = require('../services/gemini');
const { generateSpeech } = require('../services/sarvam_tts');
const { transcribeAudioFromUrl } = require('../services/sarvam_stt');

// In-memory session store (Same as before)
const sessions = {};

const PERSONAS = {
    '1': {
        name: 'Neelum',
        voiceId: process.env.VOICE_ID_NEELAM || '1zUSi8LeHs9M2mV8X6YS',
        instruction: "You are Neelam. Be empathetic, human-like, and conversational. Keep responses short (1–2 sentences max). Acknowledge emotions if present. Avoid sounding robotic or technical. Reply only with the spoken words you would say to the user, no action descriptions."
    },
    '2': {
        name: 'Neel',
        voiceId: process.env.VOICE_ID_NEEL || 'FmBhnvP58BK0vz65OOj7',
        instruction: "You are Neel. Be empathetic, human-like, and conversational. Keep responses short (1–2 sentences max). Acknowledge emotions if present. Avoid sounding robotic or technical. Reply only with the spoken words you would say to the user, no action descriptions."
    }
};

function normalizePhone(phone) {
    return phone ? phone.replace(/\D/g, '') : '';
}

// 1. Initial Call -> Select Persona
router.post('/voice', (req, res) => {
    const phone = normalizePhone(req.body.From);
    console.log(`\n================================`);
    console.log(`[Twilio Flow] 📞 Incoming call received from ${phone}`);
    console.log(`================================\n`);

    const twiml = new VoiceResponse();
    const gather = twiml.gather({
        numDigits: 1,
        action: `/twilio/select-persona?phone=${encodeURIComponent(phone)}`, // Updated path
        timeout: 10
    });

    gather.say({ voice: 'Polly.Aditi', language: 'en-IN' }, "Namaste! Choose your companion. Press 1 for Neelum, Press 2 for Neel.");

    twiml.say({ voice: 'Polly.Aditi', language: 'en-IN' }, "We did not receive input. Defaulting to Neelum.");
    twiml.redirect(`/twilio/select-persona?phone=${encodeURIComponent(phone)}&Digits=1`);

    res.type('text/xml').send(twiml.toString());
});

// 2. Persona Selection -> Transcribe Loop
router.post('/select-persona', (req, res) => {
    const phone = normalizePhone(req.query.phone || req.body.From);
    const digit = req.body.Digits || '1';

    console.log(`[Twilio Flow] 👤 Persona ${digit} selected for caller ${phone}`);

    sessions[phone] = {
        phone,
        history: [],
        persona: PERSONAS[digit] || PERSONAS['1']
    };

    const twiml = new VoiceResponse();
    twiml.say({ voice: 'Polly.Aditi', language: 'en-IN' }, `Great! You are talking to ${sessions[phone].persona.name}. Please say hello.`);

    console.log(`[Twilio Flow] 🎤 Starting transcription gathering...`);
    twiml.redirect(`/twilio/transcribe?phone=${encodeURIComponent(phone)}`);
    res.type('text/xml').send(twiml.toString());
});

// 3. Transcribe (Listen)
router.post('/transcribe', (req, res) => {
    const phone = normalizePhone(req.query.phone || req.body.From);
    const twiml = new VoiceResponse();

    twiml.record({
        action: `/twilio/process-speech?phone=${encodeURIComponent(phone)}`,
        method: 'POST',
        maxLength: 10,
        playBeep: true
    });

    twiml.say({ voice: 'Polly.Aditi', language: 'en-IN' }, "I didn't hear anything.");
    twiml.redirect(`/twilio/transcribe?phone=${encodeURIComponent(phone)}`);

    res.type('text/xml').send(twiml.toString());
});

// 4. Process Speech (Think -> Speak)
router.post('/process-speech', async (req, res) => {
    const phone = normalizePhone(req.query.phone || req.body.From);
    const recordingUrl = req.body.RecordingUrl;

    console.log(`\n[Twilio Flow] 💬 Caller ${phone} finished speaking.`);
    if (recordingUrl) {
        console.log(`              Recording URL: ${recordingUrl}`);
    } else {
        console.log(`              (No recording detected)`);
    }

    const session = sessions[phone];
    if (!session) {
        console.warn(`[Twilio Flow] ⚠️ Session expired or missing for caller ${phone}`);
        const twiml = new VoiceResponse();
        twiml.say("Session expired.");
        twiml.hangup();
        return res.type('text/xml').send(twiml.toString());
    }

    try {
        console.log(`[Twilio Flow] 🔄 Processing turn for ${session.persona.name}...`);

        let userSpeech = "";
        if (recordingUrl) {
            console.log(`[Twilio Flow] 🦻 Transcribing audio with Sarvam STT...`);
            userSpeech = await transcribeAudioFromUrl(recordingUrl);
            console.log(`[Twilio Flow] 🗣️ User said: "${userSpeech}"`);
        } else {
            console.warn(`[Twilio Flow] ⚠️ No RecordingUrl in request.`);
            userSpeech = req.body.SpeechResult || "";
        }

        // If nothing was said, loop back to listen
        if (!userSpeech || !userSpeech.trim()) {
            const twiml = new VoiceResponse();
            twiml.redirect(`/twilio/transcribe?phone=${encodeURIComponent(phone)}`);
            return res.type('text/xml').send(twiml.toString());
        }

        // A. Gemini Reply
        console.time("Gemini Generation Time");
        console.log(`[Twilio Flow] 🧠 Dispatching prompt to Gemini...`);
        let aiText = await askGemini(userSpeech, session.persona.instruction);
        console.timeEnd("Gemini Generation Time");
        
        // Clean up asterisks if present in standard formatting
        aiText = aiText.replace(/\*/g, '');
        console.log(`[Twilio Flow] ✨ Gemini Response generated successfully`);

        // B. Update History
        session.history.push({ role: 'user', content: userSpeech });
        session.history.push({ role: 'ai', content: aiText });

        // C. Generate Audio
        console.log(`[Twilio Flow] 🔊 Generating audio using Sarvam TTS (Persona: ${session.persona.name})...`);
        const fileName = await generateSpeech(aiText, session.persona.name || 'neelum');
        console.log(`[Twilio Flow] 🎵 Audio generated: ${fileName}`);

        // D. Play Audio
        const baseUrl = (process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`).replace(/\/$/, '');
        const audioUrl = `${baseUrl}/audio/${fileName}`;

        console.log(`[Twilio Flow] ▶️ Playing audio to caller: ${audioUrl}`);

        const twiml = new VoiceResponse();
        twiml.play(audioUrl);
        twiml.redirect(`/twilio/transcribe?phone=${encodeURIComponent(phone)}`); // Loop back

        res.type('text/xml').send(twiml.toString());

    } catch (err) {
        console.error("================ [Twilio Processing Error] ================");
        console.error(`Phone: ${phone}`);
        console.error(`Error:`, err);
        console.error("===========================================================");

        const twiml = new VoiceResponse();
        twiml.say("Sorry, I had trouble thinking. One moment.");
        twiml.redirect(`/twilio/transcribe?phone=${encodeURIComponent(phone)}`);
        res.type('text/xml').send(twiml.toString());
    }
});

module.exports = router;
