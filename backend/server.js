require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const twilioRoutes = require('./routes/twilio');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Serve static audio files
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

// Routes
// Note: We mount the helper routes under /twilio to distinguish them.
// But we need to ensure the TwiML actions point to /twilio/... as well.
app.use('/twilio', twilioRoutes);

// Keep the root /voice valid if Twilio is pointing there directly for initial webhook.
// We'll redirect root /voice to the router's /voice
app.post('/voice', (req, res) => {
    // Forward to the router
    res.redirect(307, '/twilio/voice');
});

// API endpoint to initiate call (restored feature)
app.post('/api/call', async (req, res) => {
    const { phone: rawPhone } = req.body;
    if (!rawPhone) return res.status(400).json({ error: 'Phone required' });

    // Normalize phone
    const phone = rawPhone.replace(/\D/g, '');

    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    try {
        console.log(`[API] Initiating call to ${phone}`);
        await client.calls.create({
            url: `${process.env.PUBLIC_BASE_URL}/twilio/voice`, // Point to the new router path
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
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Environment config: Gemini Model=gemini-1.5-flash-latest`);
});
