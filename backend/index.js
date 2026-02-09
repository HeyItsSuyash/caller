require('dotenv').config();
const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const URL = require('url');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const cors = require('cors');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Google Cloud Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-bison-001" });

const speechClient = new speech.SpeechClient();
const ttsClient = new textToSpeech.TextToSpeechClient();

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
    // Ensure we retrieve the session created in /select-persona
    let session = sessions[phone];

    if (!session) {
        console.warn(`[Warning] No pre-existing session found for ${phone}. Creating ad-hoc session.`);
        session = { history: [], emotion: 'neutral', phone };
        sessions[phone] = session;
    } else {
        console.log(`[Stream] Restored session for ${phone}. Persona: ${session.persona ? session.persona.name : 'Unknown'}`);
    }
    let recognizeStream = null;

    ws.on('message', async (message) => {
        const msg = JSON.parse(message);

        switch (msg.event) {
            case 'start':
                streamSid = msg.start.streamSid;
                console.log(`[Stream] Started with SID: ${streamSid} for ${phone}`);

                // Initialize STT Stream
                recognizeStream = speechClient
                    .streamingRecognize({
                        config: {
                            encoding: 'MULAW',
                            sampleRateHertz: 8000,
                            languageCode: 'hi-IN',
                            alternativeLanguageCodes: ['en-IN'],
                        },
                        interimResults: true,
                    })
                    .on('data', async (data) => {
                        const transcript = data.results[0].alternatives[0].transcript;
                        console.log(`[User] ${transcript}`);

                        if (data.results[0].isFinal) {
                            console.log(`[Transcription] Final: "${transcript}"`);
                            const responseText = await getGeminiResponse(transcript, session);
                            await streamSpeech(ws, streamSid, responseText, session);
                        }
                    })
                    .on('error', (err) => console.error('[STT Error]', err));

                const greeting = session.persona && session.persona.name === 'Neelum'
                    ? "Hi! Main Neelum bol rahi hoon. Aaj mera mann kiya tumse baat karne ka! Kaise ho tum? Sab theek?"
                    : "Hi, main tumhara AI hoon. Main khud call kar raha hoon. Aaj tum kaise feel kar rahe ho?";
                console.log(`[AI] Dispatching greeting: "${greeting}"`);
                await streamSpeech(ws, streamSid, greeting, session);
                break;

            case 'media':
                // Pipe audio to STT
                if (recognizeStream) {
                    recognizeStream.write(Buffer.from(msg.media.payload, 'base64'));
                }

                // Interruption Detection
                try {
                    const isSpeaking = detectEnergy(msg.media.payload);
                    if (isSpeaking && session.aiSpeaking) {
                        console.log('[Barge-in] Speech energy detected! Stopping AI...');
                        triggerInterruption(ws, streamSid, session);
                    }
                } catch (err) {
                    console.error('[Error] Media processing error:', err.message);
                }
                break;

            case 'stop':
                console.log(`[Stream] Connection closed for ${phone}`);
                if (recognizeStream) {
                    recognizeStream.destroy();
                }
                break;
        }
    });

    // Handle Interruption
    async function triggerInterruption(ws, streamSid, session) {
        console.log('[Interruption] Triggering flush and contextual response...');
        session.aiSpeaking = false;
        session.interrupted = true;
        // flushed by setting session.interrupted = true

        // Send 'clear' to Twilio to stop playback on the phone instantly
        ws.send(JSON.stringify({
            event: 'clear',
            streamSid: streamSid
        }));

        // Respond to interruption contextually
        const responseText = await getGeminiResponse("User interrupted me.. acknowledge it naturally with energy (like 'Oh sorry! Haan bolo!') and ask what's up.", session);
        console.log(`[AI] Reactive response: "${responseText}"`);
        await streamSpeech(ws, streamSid, responseText, session);
    }
});

// --- ENGINE LOGIC ---

function detectEnergy(payload) {
    const buffer = Buffer.from(payload, 'base64');
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
        sum += Math.abs(buffer[i]);
    }
    const level = sum / buffer.length;
    return level > 160; // Energy threshold for active speech
}

async function streamSpeech(ws, streamSid, text, session) {
    if (!text) return;
    session.aiSpeaking = true;
    session.interrupted = false;

    console.log(`[AI] Response being processed for streaming: "${text}"`);

    // Split into small chunks for granularity
    const chunks = text.split(/[.?!,]/).filter(c => c.length > 1);
    console.log(`[TTS] Audio split into ${chunks.length} segments`);

    for (const chunk of chunks) {
        if (session.interrupted) break;

        console.log(`[TTS] Speaking: "${chunk.trim()}"`);

        try {
            const [response] = await ttsClient.synthesizeSpeech({
                input: { text: chunk.trim() },
                voice: {
                    languageCode: 'hi-IN',
                    name: session.persona?.name === 'Neelum' ? 'hi-IN-Standard-A' : 'hi-IN-Standard-B'
                },
                audioConfig: {
                    audioEncoding: 'MULAW',
                    sampleRateHertz: 8000
                },
            });

            if (!session.interrupted) {
                ws.send(JSON.stringify({
                    event: 'media',
                    streamSid,
                    media: {
                        payload: Buffer.from(response.audioContent).toString('base64')
                    }
                }));
                // Wait for audio duration roughly
                await new Promise(r => setTimeout(r, chunk.length * 100));
            }
        } catch (err) {
            console.error('[TTS Error]', err.message);
        }
    }

    session.aiSpeaking = false;
}

// Helper: Clean JSON response
function cleanJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? match[0] : null;
}

async function getGeminiResponse(input, session) {
    const persona = session.persona || PERSONAS['1'];
    console.log(`[Gemini] Generating response for input: "${input}" with persona: ${persona.name}`);

    const prompt = `
    You are an AI voice assistant engaged in a phone call.
    
    SYSTEM INSTRUCTION:
    ${persona.instruction}

    CURRENT EMOTION STATE: ${session.emotion || 'neutral'}

    CONVERSATION HISTORY:
    ${session.history.map(h => `${h.role === 'user' ? 'User' : 'You'}: ${h.content}`).join('\n')}

    USER JUST SAID: "${input}"

    YOUR TASK:
    1. Analyze the user's input and the conversation context.
    2. Determine the user's emotion (one of: neutral, happy, sad, angry, stressed, excited).
    3. Generate a natural, human-like response (keep it under 2 sentences, conversational).
    4. Return ONLY a valid JSON object in this format:
       {
         "reply": "Your response text here",
         "emotion": "detected_emotion"
       }
    5. Do NOT include markdown formatting (like \`\`\`json). Just the raw JSON string.
    `;

    try {
        console.log(`[Gemini] Sending prompt to ${model.model}...`);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log(`[Gemini] Raw Response: ${responseText}`);

        let aiData;
        try {
            const cleaned = cleanJSON(responseText);
            if (!cleaned) throw new Error("No JSON found");
            aiData = JSON.parse(cleaned);
        } catch (parseError) {
            console.error(`[Gemini Error] Failed to parse JSON: ${parseError.message} | Response: ${responseText}`);
            // Fallback
            aiData = { reply: "Haan, main sun rahi hoon. Boliye?", emotion: "neutral" };
        }

        console.log(`[AI] Context Updated: Emotion=${aiData.emotion} | Reply="${aiData.reply}"`);

        // Update session state
        session.emotion = aiData.emotion;
        session.history.push({ role: 'user', content: input });
        session.history.push({ role: 'ai', content: aiData.reply });


        // Proactive Follow-Up: 5 minutes if sad/stressed
        if ((aiData.emotion === "sad" || aiData.emotion === "stressed") && !session.isFollowUp) {
            console.log(`[Proactive] Scheduling follow-up call for ${session.phone} in 5 mins due to ${aiData.emotion} state`);
            setTimeout(() => triggerFollowUp(session.phone), 5 * 60 * 1000);
        }

        return aiData.reply;
    } catch (e) {
        console.error(`[Error] Gemini generation failed: ${e.message}`);
        return "Theek hai, main sun raha hoon. Bolo?";
    }
}

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
