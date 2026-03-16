require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure permissive CORS for the frontend deployed on Vercel
const corsOptions = {
  origin: '*', // Better to specific origins in prod, e.g., 'https://callerai-five.vercel.app'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const { initiateOutboundCall } = require("./twilio/outbound");
const { handleTwilioWebhook } = require("./twilio/webhook");
const { handleStreamConnection } = require("./twilio/stream");
const { getCallSession, getAllCalls } = require("./state/calls");

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


app.post("/call/outbound", initiateOutboundCall);
app.post("/twilio/voice", handleTwilioWebhook);

// Create HTTP server to attach both Express and WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Array to hold connected frontend clients
const frontendClients = new Set();

// WebSocket connection handler
wss.on("connection", (ws, req) => {
  if (req.url === "/twilio/stream") {
    handleStreamConnection(ws);
  } else if (req.url === "/live") {
    console.log("Frontend client connected for live updates");
    frontendClients.add(ws);
    ws.on("close", () => frontendClients.delete(ws));
  } else {
    ws.on("message", (msg) => console.log("Other WS msg:", msg));
  }
});

// A simple helper to broadcast events to all frontend clients
function broadcastEvent(event, data) {
  const message = JSON.stringify({ event, data });
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
