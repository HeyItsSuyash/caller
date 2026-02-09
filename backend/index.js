require('dotenv').config();
const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const URL = require('url');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const cors = require('cors');
const GeminiLiveStream = require('./gemini-live');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Store active sessions in memory
const sessions = {};

const PERSONAS = {
    '1': {
        name: 'Neelum',
        voice: 'Google.hi-IN-Standard-A', // Female
        instruction: "You are Neelum (pronounced Neelum), a super energetic, warm, and proactive urban Indian girl. You speak natural Hinglish with perfect feminine grammar (e.g., use 'kar rahi hoon', 'bol rahi hoon'). You are a caring friend who is a GREAT listener. Use enthusiastic fillers like 'Hmmmm...', 'Achha!', 'Sahi hai!', 'I'm listening'. Never sound robotic. Be very proactive and supportive."
    },
    '2': {
        name: 'Neel',
        voice: 'Google.hi-IN-Standard-B', // Male
        instruction: "You are Neel, a calm, supportive urban Indian guy. You speak natural Hinglish. You are a reliable friend, not an AI. Use fillers like 'Hmm', 'Sahi hai', 'I see'. Use '...' for pauses."
    }
};

// Helper to normalize phone numbers (strip + and spaces)
function normalizePhone(phone) {
    return phone.replace(/\D/g, '');
}

// 1. Initial TwiML - Persona Selection
app.post('/voice', (req, res) => {
    const phone = normalizePhone(req.query.phone || '');
    console.log(`[Twilio] Call received for ${phone}`);
    const twiml = new VoiceResponse();

    const gather = twiml.gather({
        numDigits: 1,
        action: `/select-persona?phone=${encodeURIComponent(phone)}`,
        timeout: 10
    });

    gather.say({ language: 'hi-IN', voice: 'Google.hi-IN-Standard-A' },
        "Namaste! Apne companion ko choose kijiye. Neelum ke liye ek dabaye, Neel ke liye do dabaye.");

    // Fallback if no input
    twiml.say({ language: 'hi-IN', voice: 'Google.hi-IN-Standard-A' }, "Hume koi input nahi mila. Neelum ko default companion choose kiya jaa raha hai.");
    twiml.redirect(`/select-persona?phone=${encodeURIComponent(phone)}&Digits=1`);

    res.type('text/xml').send(twiml.toString());
});

// 2. Select Persona & Start Stream
app.post('/select-persona', (req, res) => {
    const phone = normalizePhone(req.query.phone || '');
    const digit = req.body.Digits || '1';
    console.log(`[Twilio] Persona ${digit} selected for ${phone}`);

    const session = sessions[phone];
    if (session) {
        session.persona = PERSONAS[digit] || PERSONAS['1'];
    } else {
        console.warn(`[Warning] No session found for ${phone} during persona selection`);
    }

    const twiml = new VoiceResponse();
    const connect = twiml.connect();

    // Use PUBLIC_BASE_URL if available for more reliable WebSocket resolution
    const streamUrl = process.env.PUBLIC_BASE_URL
        ? `${process.env.PUBLIC_BASE_URL.replace('https://', 'wss://')}/media?phone=${encodeURIComponent(phone)}`
        : `wss://${req.headers.host}/media?phone=${encodeURIComponent(phone)}`;

    connect.stream({
        url: streamUrl,
        name: 'AI_Stream'
    });

    // Add defensive Pause to keep the call alive while stream establishes
    twiml.pause({ length: 40 });

    res.type('text/xml').send(twiml.toString());
});

// 2. Call Initiation
app.post('/api/call', async (req, res) => {
    const { phone: rawPhone } = req.body;
    if (!rawPhone) return res.status(400).json({ error: 'Phone required' });

    const phone = normalizePhone(rawPhone);

    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    try {
        sessions[phone] = {
            phone,
            history: [],
            emotion: 'neutral',
            aiSpeaking: false,
            interrupted: false,
            persona: null // To be selected
        };
        console.log(`[API] Initiating call to ${phone}`);
        await client.calls.create({
            url: `${process.env.PUBLIC_BASE_URL}/voice?phone=${encodeURIComponent(phone)}`,
            to: rawPhone,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
        res.json({ message: 'Success: Call initiated' });
    } catch (e) {
        console.error(`[API Error] Failed to initiate call: ${e.message}`);
        res.status(500).json({ error: e.message });
    }
});

// 3. Media Stream WebSocket Handling
wss.on('connection', (ws, req) => {
    const params = URL.parse(req.url, true).query;
    const phone = normalizePhone(params.phone || '');
    console.log(`[Stream] WebSocket connected for ${phone}`);

    let streamSid = '';
    let session = sessions[phone];

    if (!session) {
        console.warn(`[Warning] No pre-existing session found for ${phone}. Creating ad-hoc session.`);
        session = { history: [], emotion: 'neutral', phone, persona: PERSONAS['1'] };
        sessions[phone] = session;
    } else {
        console.log(`[Stream] Restored session for ${phone}. Persona: ${session.persona ? session.persona.name : 'Unknown'}`);
    }

    // Initialize Gemini Live Stream
    const geminiLive = new GeminiLiveStream(
        process.env.GEMINI_API_KEY,
        session.persona || PERSONAS['1'],
        (audioBase64) => {
            // On Audio Received from Gemini -> Send to Twilio
            if (streamSid) {
                ws.send(JSON.stringify({
                    event: 'media',
                    streamSid,
                    media: { payload: audioBase64 }
                }));
            }
        },
        (text) => {
            console.log(`[Gemini Transcript] ${text}`);
            session.history.push({ role: 'ai', content: text });
        }
    );

    geminiLive.connect();

    ws.on('message', async (message) => {
        const msg = JSON.parse(message);

        switch (msg.event) {
            case 'start':
                streamSid = msg.start.streamSid;
                console.log(`[Stream] Started with SID: ${streamSid}`);
                break;

            case 'media':
                // Send Audio to Gemini (it handles VAD and Interruption)
                if (msg.media && msg.media.payload) {
                    geminiLive.sendAudio(msg.media.payload);
                }
                break;

            case 'stop':
                console.log(`[Stream] Connection closed for ${phone}`);
                geminiLive.close();
                break;
        }
    });

    ws.on('close', () => {
        geminiLive.close();
    });
});


async function triggerFollowUp(phone) {
    if (!sessions[phone]) return;
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    try {
        sessions[phone].isFollowUp = true;
        await client.calls.create({
            url: `${process.env.PUBLIC_BASE_URL}/voice?phone=${encodeURIComponent(phone)}`,
            to: phone,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
    } catch (error) {
        console.error("Follow-up call failed:", error);
    }
}

// WebSocket Upgrade
server.on('upgrade', (request, socket, head) => {
    const pathname = URL.parse(request.url).pathname;
    if (pathname === '/media') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
