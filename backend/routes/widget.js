const express = require('express');
const router = express.Router();
const entityService = require('../services/entity');
const { initiateOutboundCall } = require('../twilio/outbound');

/**
 * Initiate a call from the external widget
 * POST /api/widget/call
 */
router.post('/call', async (req, res) => {
  const { agentId, phoneNumber, simulate } = req.body;

  if (!agentId || !phoneNumber) {
    return res.status(400).json({ error: 'Missing agentId or phoneNumber' });
  }

  try {
    // 1. Validate entity exists
    const entity = await entityService.getEntityById(agentId);
    if (!entity) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (simulate) {
      console.log(`[WidgetAPI][SIMULATION] Mock call request for agent: ${entity.name} to: ${phoneNumber}`);
      // Artificial delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json({ success: true, simulated: true, message: 'Simulation successful' });
    }

    console.log(`[WidgetAPI] Call request for agent: ${entity.name} to: ${phoneNumber}`);

    // 2. Reuse current outbound logic
    // We mock the req/res style or call the underlying logic
    // For isolation, let's call twilio directly or reuse initiateOutboundCall logic
    // Actually, initiateOutboundCall is an express handler, so we can't easily call it directly
    // Let's refactor Twilio logic if needed, or just replicate the call for now to keep it isolated
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;
    const serverUrl = process.env.PUBLIC_BASE_URL || process.env.SERVER_URL;

    if (!accountSid || !authToken || !from || !serverUrl) {
      throw new Error('Twilio configuration missing');
    }

    const twilio = require('twilio');
    const { createCallSession } = require('../state/calls');
    const client = twilio(accountSid, authToken);

    const call = await client.calls.create({
      url: `${serverUrl}/twilio/voice`,
      to: phoneNumber,
      from: from,
    });

    createCallSession(call.sid, phoneNumber, entity.name);

    res.json({ success: true, callSid: call.sid });
  } catch (err) {
    console.error('[WidgetAPI] Error:', err);
    res.status(500).json({ error: 'Failed to initiate call', details: err.message });
  }
});

module.exports = router;
