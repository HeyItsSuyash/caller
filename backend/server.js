const fs = require('fs');
require("dotenv").config({ path: fs.existsSync('.env.local') ? '.env.local' : '.env' });
const { execSync } = require('child_process');

try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  console.log('[startup] ffmpeg found');
} catch {
  console.error('[startup] ffmpeg NOT found — audio pipeline will fail. Install ffmpeg.');
  process.exit(1);
}

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure permissive CORS for the frontend deployed on Vercel
const corsOptions = {
  origin: '*', // Better to specify exact origin in prod
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const { initiateOutboundCall } = require("./twilio/outbound");
const { handleTwilioWebhook } = require("./twilio/webhook");
const { handleStreamConnection } = require("./twilio/stream");
const { initiateExotelOutboundCall } = require("./exotel/outbound");
const { handleExotelStreamConnection } = require("./exotel/stream");
const { getCallSession, getAllCalls } = require("./state/calls");

const { getAllAnalytics, getKnowledge, addKnowledge, deleteKnowledge } = require("./services/mongodb");
const authRoutes = require('./routes/auth');
const entityRoutes = require('./routes/entities');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');
const widgetRoutes = require('./routes/widget');

app.use("/auth", authRoutes);
app.use('/entities', entityRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/admin', adminRoutes);
app.use('/api/widget', widgetRoutes);

// Demo Page for Integration Testing
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, '../integration/html/example.html'));
});

// Serve Widget Static Files
app.use('/widget', express.static(path.join(__dirname, '../integration/widget')));
app.get('/widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../integration/widget/widget.js'));
});

app.get(["/", "/health"], (req, res) => {
  res.status(200).send("OK");
});

// Telephony Status Check: Both Twilio and Exotel available simultaneously
app.get("/api/telephony/status", (req, res) => {
  res.json({
    exotelConfigured: Boolean(process.env.EXOTEL_ACCOUNT_SID && process.env.EXOTEL_API_KEY),
    twilioConfigured: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    exotelNumber: process.env.EXOTEL_PHONE_NUMBER || '08047281152',
    twilioNumber: process.env.TWILIO_PHONE_NUMBER || '+16624818479'
  });
});

// Outbound Call Initiation: auto-routes or allows specifying provider
app.post("/call/outbound", (req, res, next) => {
  const provider = (req.body.provider || '').toLowerCase();
  if (provider === 'exotel' || (!process.env.TWILIO_ACCOUNT_SID && process.env.EXOTEL_ACCOUNT_SID)) {
    return initiateExotelOutboundCall(req, res);
  }
  return initiateOutboundCall(req, res);
});
app.post("/exotel/outbound", initiateExotelOutboundCall);
app.post("/twilio/outbound", initiateOutboundCall);

// Inbound Voice Webhooks for both carriers
app.post("/twilio/voice", handleTwilioWebhook);
app.all("/exotel/voice", (req, res) => {
  const serverUrl = (process.env.PUBLIC_BASE_URL || process.env.SERVER_URL || 'https://caller-24ie.onrender.com').replace(/\/$/, '');
  const wsUrl = serverUrl.replace(/^http/, 'ws') + '/exotel/stream';
  const callSid = req.body.CallSid || req.query.CallSid || req.body.CallUUID || `exo_${Date.now()}`;
  const caller = req.body.From || req.query.From || req.body.CallFrom || 'Unknown';
  
  const exoML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}">
      <Parameter name="callSid" value="${callSid}" />
      <Parameter name="caller" value="${caller}" />
      <Parameter name="provider" value="exotel" />
    </Stream>
  </Connect>
</Response>`;
  res.set('Content-Type', 'application/xml');
  res.send(exoML);
});
app.all("/exotel/status", (req, res) => {
  res.json({ success: true });
});


// Dashboard APIs
app.get("/calls", (req, res) => {
  res.json(getAllCalls());
});

app.get("/call/:sid/status", (req, res) => {
  const session = getCallSession(req.params.sid);
  if (!session) return res.status(404).json({ error: "Call not found" });
  res.json(session);
});

app.get("/call/:sid/summary", (req, res) => {
  const session = getCallSession(req.params.sid);
  if (!session) return res.status(404).json({ error: "Call not found" });
  res.json({ summary: session.summary, resolution_status: session.resolution_status });
});

app.get("/analytics", async (req, res) => {
  try {
    const data = await getAllAnalytics();
    res.json(data);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Knowledge Base APIs
app.get("/knowledge", async (req, res) => {
  const { entity } = req.query;
  const data = await getKnowledge(entity);
  res.json(data);
});

app.post("/knowledge/text", async (req, res) => {
  const { title, content, entity } = req.body;
  const result = await addKnowledge({ title, content, entity, type: 'TEXT' });
  res.json(result);
});

app.delete("/knowledge/:id", async (req, res) => {
  const success = await deleteKnowledge(req.params.id);
  res.json({ success });
});



// Create HTTP server to attach both Express and WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Array to hold connected frontend clients
const frontendClients = new Set();

// A simple helper to broadcast events to all frontend clients
function broadcastEvent(event, data) {
  const message = JSON.stringify({ event, data });
  console.log(`[Broadcast] Sending '${event}' to ${frontendClients.size} clients`);
  for (const client of frontendClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

// Attach broadcast helper to global so stream.js can use it easily without circular deps
global.broadcastEvent = broadcastEvent;

// WebSocket connection handler
wss.on("connection", (ws, req) => {
  // Robust path detection: remove query params and double slashes
  const rawPath = (req.url || "").split('?')[0];
  const path = rawPath.replace(/\/+/g, '/');
  
  console.log(`[WebSocket] Connection request path: ${path} (raw: ${rawPath}) | Origin: ${req.headers.origin}`);
  
  if (path === "/twilio/stream" || path.startsWith("/twilio/stream/")) {
    handleStreamConnection(ws);
  } else if (path === "/exotel/stream" || path.startsWith("/exotel/stream/")) {
    console.log("[WebSocket] Exotel media stream connected");
    handleExotelStreamConnection(ws);
  } else if (path === "/live" || path === "/live/") {
    console.log("[WebSocket] Frontend dashboard connected for updates");
    frontendClients.add(ws);
    ws.on("close", () => frontendClients.delete(ws));
  } else {
    console.log(`[WebSocket] Dropping unknown connection path: ${path}`);
    ws.close();
  }
});


// Attachment moved to earlier in file for availability during connection handshake
// global.broadcastEvent = broadcastEvent;

// FINAL CATCH-ALL: Ensure any unhandled routes return JSON 404, not HTML
app.use((req, res) => {
  console.warn(`[Routing] 404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: "Resource not found", 
    path: req.url,
    method: req.method
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server fully operational on port ${PORT}`);
  console.log(`- Local access: http://localhost:${PORT}`);
  console.log(`- Network access: http://127.0.0.1:${PORT}`);
});