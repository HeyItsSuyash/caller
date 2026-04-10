require("dotenv").config();
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
const { getCallSession, getAllCalls } = require("./state/calls");
const { getAllAnalytics, getKnowledge, addKnowledge, deleteKnowledge } = require("./services/mongodb");

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/call/outbound", initiateOutboundCall);
app.post("/twilio/voice", handleTwilioWebhook);

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
  const data = await getAllAnalytics();
  res.json(data);
});

// Knowledge Base APIs
app.get("/knowledge", async (req, res) => {
  const data = await getKnowledge();
  res.json(data);
});

app.post("/knowledge/text", async (req, res) => {
  const { title, content } = req.body;
  const result = await addKnowledge({ title, content, type: 'TEXT' });
  res.json(result);
});

app.delete("/knowledge/:id", async (req, res) => {
  const success = await deleteKnowledge(req.params.id);
  res.json({ success });
});


app.post("/call/outbound", initiateOutboundCall);
app.post("/twilio/voice", handleTwilioWebhook);

// Create HTTP server to attach both Express and WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Array to hold connected frontend clients
const frontendClients = new Set();

// WebSocket connection handler
wss.on("connection", (ws, req) => {
  console.log(`[WebSocket] Incoming connection to URL: ${req.url}`);
  
  if (req.url.startsWith("/twilio/stream")) {
    handleStreamConnection(ws);
  } else if (req.url.startsWith("/live")) {
    console.log("Frontend client connected for live updates");
    frontendClients.add(ws);
    ws.on("close", () => frontendClients.delete(ws));
  } else {
    console.log(`[WebSocket] Unknown connection path: ${req.url}`);
    ws.on("message", (msg) => console.log("Other WS msg:", msg));
  }
});

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


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
