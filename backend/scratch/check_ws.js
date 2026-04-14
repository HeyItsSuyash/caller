const WebSocket = require('ws');

const url = 'ws://localhost:3001/live';
console.log(`Connecting to ${url}...`);

const ws = new WebSocket(url);

ws.on('open', () => {
  console.log('SUCCESS: Connection opened!');
  ws.close();
});

ws.on('error', (err) => {
  console.error('FAILED: Connection error:', err.message);
});

ws.on('close', () => {
  console.log('Connection closed.');
});

setTimeout(() => {
  if (ws.readyState !== WebSocket.OPEN) {
    console.log('Timeout: Connection took too long.');
    ws.terminate();
  }
}, 5000);
