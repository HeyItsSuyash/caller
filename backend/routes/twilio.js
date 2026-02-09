const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const router = express.Router();
const { generateReply } = require('../services/openai');
const { generateAudio } = require('../services/tts');

// In-memory session store (Same as before)
const sessions = {};

const PERSONAS = {
    '1': {
        name: 'Neelum',
        voiceId: process.env.VOICE_ID_NEELAM || '21m00Tcm4TlvDq8ikWAM',
        instruction: "You are Neelum, an energetic, warm, proactive Indian girl. Speak natural Hinglish. Caring friend, great listener. SHORT, conversational responses."
    },
    '2': {
        name: 'Neel',
        voiceId: process.env.VOICE_ID_NEEL || 'ErXwobaYiN019PkySvjV',
        instruction: "You are Neel, a calm, supportive Indian guy. Speak natural Hinglish. Reliable friend. SHORT, conversational responses."
    }
};

function normalizePhone(phone) {
    return phone ? phone.replace(/\D/g, '') : '';
}

// 1. Initial Call -> Select Persona
router.post('/voice', (req, res) => {
    const phone = normalizePhone(req.body.From);
    console.log(`[Twilio] Call received from ${phone}`);

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

    console.log(`[Twilio] Persona ${digit} selected for ${phone}`);

    sessions[phone] = {
        phone,
        history: [],
        persona: PERSONAS[digit] || PERSONAS['1']
    };

    const twiml = new VoiceResponse();
    twiml.say({ voice: 'Polly.Aditi', language: 'en-IN' }, `Great! You are talking to ${sessions[phone].persona.name}. Please say hello.`);

    twiml.redirect(`/twilio/transcribe?phone=${encodeURIComponent(phone)}`);
    res.type('text/xml').send(twiml.toString());
});

// 3. Transcribe (Listen)
router.post('/transcribe', (req, res) => {
    const phone = normalizePhone(req.query.phone || req.body.From);
    const twiml = new VoiceResponse();

    twiml.gather({
        input: 'speech',
        action: `/twilio/process-speech?phone=${encodeURIComponent(phone)}`,
        timeout: 2,
        speechTimeout: 'auto',
        language: 'en-IN'
    });

    twiml.say({ voice: 'Polly.Aditi', language: 'en-IN' }, "I didn't hear anything.");
    twiml.redirect(`/twilio/transcribe?phone=${encodeURIComponent(phone)}`);

    res.type('text/xml').send(twiml.toString());
});

// 4. Process Speech (Think -> Speak)
router.post('/process-speech', async (req, res) => {
    const phone = normalizePhone(req.query.phone || req.body.From);
    const userSpeech = req.body.SpeechResult;

    console.log(`[Twilio] Transcript received from ${phone}: "${userSpeech}"`);

    const session = sessions[phone];
    if (!session) {
        const twiml = new VoiceResponse();
        twiml.say("Session expired.");
        twiml.hangup();
        return res.type('text/xml').send(twiml.toString());
    }

    try {
        // A. Gemini Reply
        const aiText = await generateReply(userSpeech, session.history, session.persona.instruction);

        // B. Update History
        session.history.push({ role: 'user', content: userSpeech });
        session.history.push({ role: 'ai', content: aiText });

        // C. Generate Audio
        const fileName = await generateAudio(aiText, session.persona.voiceId);

        // D. Play Audio
        const baseUrl = (process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`).replace(/\/$/, '');
        const audioUrl = `${baseUrl}/audio/${fileName}`;

        console.log(`[Twilio] Playing audio to caller: ${audioUrl}`);

        const twiml = new VoiceResponse();
        twiml.play(audioUrl);
        twiml.redirect(`/twilio/transcribe?phone=${encodeURIComponent(phone)}`); // Loop back

        res.type('text/xml').send(twiml.toString());

    } catch (err) {
        console.error("[Twilio] Error processing turn:", err);
        const twiml = new VoiceResponse();
        twiml.say("Sorry, I had trouble thinking. One moment.");
        twiml.redirect(`/twilio/transcribe?phone=${encodeURIComponent(phone)}`);
        res.type('text/xml').send(twiml.toString());
    }
});

module.exports = router;
