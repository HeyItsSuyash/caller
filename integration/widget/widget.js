(function() {
    // 1. Configuration
    // Try to auto-detect backend URL from script source, fallback to localhost:3001
    const currentScript = document.currentScript;
    const scriptUrl = currentScript ? new URL(currentScript.src) : null;
    
    // Priority: data-backend-url attribute > script src host > fallback
    const BACKEND_URL = (currentScript && currentScript.getAttribute('data-backend-url')) || 
                        (scriptUrl ? `${scriptUrl.protocol}//${scriptUrl.host}` : 'https://caller-24ie.onrender.com');
    const CSS_URL = `${BACKEND_URL}/widget/styles.css`;
    
    // 2. Load Styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_URL;
    document.head.appendChild(link);

    let retryCount = 0;
    const init = () => {
        // Prevent multiple instances
        const existing = document.getElementById('caller-ai-widget-root');
        if (existing) existing.remove();

        const agentId = document.getElementById('caller-ai')?.getAttribute('data-agent-id') || window.CALLER_AGENT_ID;

        if (!agentId) {
            // Poll for the ID up to 10 times (5 seconds total)
            if (retryCount < 10) {
                retryCount++;
                setTimeout(init, 500);
            } else {
                console.warn('[Caller AI] Missing agent ID. Ensure <div id="caller-ai" data-agent-id="ID"> exists.');
            }
            return;
        }

        console.log('[Caller AI] Initializing widget for agent:', agentId);

        const container = document.createElement('div');
        container.id = 'caller-ai-widget-root';
        document.body.appendChild(container);

        container.innerHTML = `
            <button class="caller-widget-fab" id="caller-fab">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
            </button>

            <div class="caller-widget-modal" id="caller-modal">
                <button class="caller-widget-close" id="caller-close">×</button>
                <div class="caller-widget-header">
                    <h3>Start AI Call</h3>
                    <p>Speak with our AI assistant immediately.</p>
                </div>
                <div class="caller-widget-body">
                    <div class="caller-widget-input-group">
                        <label class="caller-widget-label">Your Phone Number</label>
                        <input type="tel" class="caller-widget-input" id="caller-phone" placeholder="+1234567890">
                    </div>
                    <button class="caller-widget-button" id="caller-start">Start Call</button>
                    <div class="caller-widget-status" id="caller-status"></div>
                </div>
            </div>
        `;

        // 4. Logic
        const fab = document.getElementById('caller-fab');
        const modal = document.getElementById('caller-modal');
        const close = document.getElementById('caller-close');
        const startBtn = document.getElementById('caller-start');
        const phoneInput = document.getElementById('caller-phone');
        const statusDiv = document.getElementById('caller-status');

        // Check for simulation mode from the target element
        const isSimulation = document.getElementById('caller-ai')?.getAttribute('data-simulate') === 'true';

        fab.addEventListener('click', () => {
            modal.classList.toggle('active');
        });

        close.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        startBtn.addEventListener('click', async () => {
            const phoneNumber = phoneInput.value.trim();
            if (!phoneNumber) {
                showStatus('Please enter a phone number', 'error');
                return;
            }

            startBtn.disabled = true;
            startBtn.textContent = 'Initiating...';
            showStatus(isSimulation ? '[SIMULATION] Connecting...' : 'Connecting to AI agent...', '');

            try {
                const response = await fetch(`${BACKEND_URL}/api/widget/call`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        agentId, 
                        phoneNumber,
                        simulate: isSimulation 
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showStatus('Success! You will receive a call shortly.', 'success');
                    phoneInput.value = '';
                    setTimeout(() => modal.classList.remove('active'), 3000);
                } else {
                    showStatus(data.error || 'Failed to start call', 'error');
                }
            } catch (err) {
                showStatus('Connection error. Try again later.', 'error');
            } finally {
                startBtn.disabled = false;
                startBtn.textContent = 'Start Call';
            }
        });

        function showStatus(msg, type) {
            statusDiv.textContent = msg;
            statusDiv.className = `caller-widget-status ${type}`;
        }
    };
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
