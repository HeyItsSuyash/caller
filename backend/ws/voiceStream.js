const WebSocket = require('ws');
const url = require('url');
const sessions = require('../sessionStore');
const ConversationManager = require('../services/conversationManager');

function initializeVoiceStream(server) {
    const wss = new WebSocket.Server({ noServer: true });

    // Handle the HTTP upgrade to WebSocket
    server.on('upgrade', (request, socket, head) => {
        const pathname = url.parse(request.url).pathname;

        if (pathname === '/ws/audio') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        } else {
            socket.destroy();
        }
    });

    wss.on('connection', (ws, request) => {
        const queryObject = url.parse(request.url, true).query;
        const phone = queryObject.phone;
        
        console.log(`📞 [VoiceStream] Connection established for phone: ${phone}`);

        if (!phone || !sessions[phone]) {
            console.error(`📞 [VoiceStream] No session found for phone: ${phone}. Closing connection.`);
            ws.close();
            return;
        }

        const manager = new ConversationManager(sessions[phone], ws);

        ws.on('message', async (message) => {
            try {
                const msg = JSON.parse(message);

                if (msg.event === 'connected') {
                    console.log(`📞 [VoiceStream] Stream Connected: ${msg.streamSid}`);
                } else if (msg.event === 'start') {
                    console.log(`📞 [VoiceStream] Stream Started: ${msg.start.streamSid} (CallSid: ${msg.start.callSid})`);
                    await manager.init(msg.start.streamSid);
                } else if (msg.event === 'media') {
                    // Pass the base64 encoded payload to the manager
                    manager.receiveAudio(msg.media.payload);
                } else if (msg.event === 'stop') {
                    console.log(`📞 [VoiceStream] Stream Stopped: ${msg.streamSid}`);
                    manager.cleanup();
                }
            } catch (err) {
                console.error('📞 [VoiceStream] Message error:', err);
            }
        });

        ws.on('close', () => {
            console.log(`📞 [VoiceStream] Connection closed for ${phone}`);
            manager.cleanup();
        });

        ws.on('error', (err) => {
            console.error(`📞 [VoiceStream] Error for ${phone}:`, err);
            manager.cleanup();
        });
    });

    return wss;
}

module.exports = { initializeVoiceStream };
