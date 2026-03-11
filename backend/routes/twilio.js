const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const router = express.Router();

// In-memory session store (Same as before)
const sessions = require('../sessionStore');

const PERSONAS = {
    '1': {
        name: 'Neelum',
        instruction: "You are Neelam. Be empathetic, human-like, and conversational. Keep responses short (1–2 sentences max). Acknowledge emotions if present. Avoid sounding robotic or technical. Reply only with the spoken words you would say to the user, no action descriptions."
    },
    '2': {
        name: 'Neel',
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
    twiml.say({ voice: 'Polly.Aditi', language: 'en-IN' }, `Great! You are talking to ${sessions[phone].persona.name}. How can I help you today?`);

    // Initiation of the Real-Time Media Stream
    const baseUrl = process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`;
    const wsUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
    
    console.log(`[Twilio Flow] 🚀 Starting Media Stream: ${wsUrl}/ws/audio?phone=${phone}`);

    const connect = twiml.connect();
    connect.stream({
        url: `${wsUrl}/ws/audio?phone=${encodeURIComponent(phone)}`
    });

    res.type('text/xml').send(twiml.toString());
});

module.exports = router;
