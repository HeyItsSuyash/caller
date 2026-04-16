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

    const { performOutboundCall } = require('../twilio/service');

    if (simulate) {
      console.log(`[WidgetAPI][SIMULATION] Mock call request for agent: ${entity.name} to: ${phoneNumber}`);
      // Artificial delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json({ success: true, simulated: true, message: 'Simulation successful' });
    }

    console.log(`[WidgetAPI] Call request for agent: ${entity.name} to: ${phoneNumber}`);

    const call = await performOutboundCall({
      to: phoneNumber,
      entityName: entity.name
    });

    res.json({ success: true, callSid: call.sid });
  } catch (err) {
    console.error('[WidgetAPI] Error:', err.message);
    res.status(500).json({ 
      error: 'Failed to initiate call', 
      details: err.message 
    });
  }
});

module.exports = router;
