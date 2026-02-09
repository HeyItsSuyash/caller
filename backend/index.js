require('dotenv').config();
const express = require('express');
const http = require('http');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const cors = require('cors');
const path = require('path');
const { generateSpeech } = require('./elevenlabs');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Serve static audio files
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

const server = http.createServer(app);

// Google Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Store active sessions in memory
const sessions = {};

const PERSONAS = {
    '1': {
        name: 'Neelum',
        voiceId: process.env.VOICE_ID_NEELAM || '21m00Tcm4TlvDq8ikWAM', // Fallback or provided ID
        instruction: "You are Neelum (pronounced Neelum), a super energetic, warm, and proactive urban Indian girl. You speak natural Hinglish with perfect feminine grammar. You are a caring friend who is a GREAT listener. Be very proactive and supportive. Keep responses SHORT and conversational (max 2 sentences)."
    },
    '2': {
        name: 'Neel',
        voiceId: process.env.VOICE_ID_NEEL || 'ErXwobaYiN019PkySvjV', // Fallback or provided ID
        instruction: "You are Neel, a calm, supportive urban Indian guy. You speak natural Hinglish. You are a reliable friend. Keep responses SHORT and conversational (max 2 sentences)."
    }
};

// Helper to normalize phone numbers
function normalizePhone(phone) {
    return phone.replace(/\D/g, '');
}

// 1. Initial Call - Persona Selection
app.post('/voice', (req, res) => {
    const phone = normalizePhone(req.body.From || '');
    console.log(`[Twilio] Call received from ${phone}`);

    const twiml = new VoiceResponse();
    const gather = twiml.gather({
        numDigits: 1,
        action: `/select-persona?phone=${encodeURIComponent(phone)}`,
        timeout: 10
    });

    gather.say({ language: 'en-IN' }, "Namaste! Choose your companion. Press 1 for Neelum, Press 2 for Neel.");

    twiml.say("We did not receive input. Defaulting to Neelum.");
    twiml.redirect(`/select-persona?phone=${encodeURIComponent(phone)}&Digits=1`);

    res.type('text/xml').send(twiml.toString());
});

// 2. Select Persona & Start Listening
app.post('/select-persona', (req, res) => {
    const phone = normalizePhone(req.query.phone || req.body.From || '');
    const digit = req.body.Digits || '1';

    console.log(`[Twilio] Persona ${digit} selected for ${phone}`);

    // Initialize Session
    sessions[phone] = {
        phone,
        history: [],
        persona: PERSONAS[digit] || PERSONAS['1']
    };

    const twiml = new VoiceResponse();
    twiml.say({ language: 'en-IN' }, `Great! You are talking to ${sessions[phone].persona.name}. Say hello!`);

    // Redirect to Transcribe loop
    twiml.redirect(`/transcribe?phone=${encodeURIComponent(phone)}`);

    res.type('text/xml').send(twiml.toString());
});

// 3. Transcribe Loop (Listen)
app.post('/transcribe', (req, res) => {
    const phone = normalizePhone(req.query.phone || req.body.From || '');
    const twiml = new VoiceResponse();

    // Listen to user speech
    twiml.gather({
        input: 'speech',
        action: `/process-speech?phone=${encodeURIComponent(phone)}`,
        timeout: 2, // Wait 2s silence to detect end of speech
        speechTimeout: 'auto',
        language: 'en-IN' // Supports Indian English accent
    });

    // If no speech detected, loop back (or end call after N retries)
    twiml.say("I didn't hear anything.");
    twiml.redirect(`/transcribe?phone=${encodeURIComponent(phone)}`);

    res.type('text/xml').send(twiml.toString());
});

// 4. Process Speech (Think -> Speak)
app.post('/process-speech', async (req, res) => {
    const phone = normalizePhone(req.query.phone || req.body.From || '');
    const userSpeech = req.body.SpeechResult;
    console.log(`[User] ${phone} said: "${userSpeech}"`);

    const session = sessions[phone];
    if (!session) {
        const twiml = new VoiceResponse();
        twiml.say("Session expired.");
        twiml.hangup();
        return res.type('text/xml').send(twiml.toString());
    }

    try {
        // A. Gemini Generation (Think)
        const prompt = `
        You are ${session.persona.name}. 
        SYSTEM INSTRUCTION: ${session.persona.instruction}
        CONVERSATION HISTORY:
        ${session.history.map(h => `${h.role === 'user' ? 'User' : 'You'}: ${h.content}`).join('\n')}
        USER SAID: "${userSpeech}"
        
        Generate a natural, short response (max 2 sentences). Plain text only. NO MARKDOWN.
        `;

        const result = await model.generateContent(prompt);
        const aiText = result.response.text();
        console.log(`[AI] Generated: "${aiText}"`);

        // B. Update History
        session.history.push({ role: 'user', content: userSpeech });
        session.history.push({ role: 'ai', content: aiText });

        // C. ElevenLabs Generation (Speak)
        // We need a wrapper to generate filename/path
        const fileName = await generateSpeech(aiText, session.persona.voiceId);

        // D. Construct Playback URL
        // Use PUBLIC_BASE_URL (https)
        const baseUrl = (process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`).replace(/\/$/, '');
        const audioUrl = `${baseUrl}/audio/${fileName}`;
        console.log(`[Twilio] Playing: ${audioUrl}`);

        const twiml = new VoiceResponse();
        twiml.play(audioUrl);

        // E. Loop back to Listen
        twiml.redirect(`/transcribe?phone=${encodeURIComponent(phone)}`);

        res.type('text/xml').send(twiml.toString());

    } catch (err) {
        console.error("Error processing speech:", err);
        const twiml = new VoiceResponse();
        twiml.say("Sorry, I had trouble thinking. One moment.");
        twiml.redirect(`/transcribe?phone=${encodeURIComponent(phone)}`);
        res.type('text/xml').send(twiml.toString());
    }
});


// 5. API Call Initiation (Restored)
app.post('/api/call', async (req, res) => {
    const { phone: rawPhone } = req.body;
    if (!rawPhone) return res.status(400).json({ error: 'Phone required' });

    const phone = normalizePhone(rawPhone);

    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    try {
        console.log(`[API] Initiating call to ${phone}`);
        await client.calls.create({
            url: `${process.env.PUBLIC_BASE_URL}/voice`, // Start at /voice
            to: rawPhone,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
        res.json({ message: 'Success: Call initiated' });
    } catch (e) {
        console.error(`[API Error] Failed to initiate call: ${e.message}`);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
