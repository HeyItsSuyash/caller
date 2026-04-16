const { performOutboundCall } = require('./service');

async function initiateOutboundCall(req, res) {
  const { to, entity } = req.body;
  
  if (!to) {
    return res.status(400).json({ error: 'Missing phone number (to)' });
  }

  try {
    const call = await performOutboundCall({ 
      to, 
      entityName: entity 
    });

    res.json({ success: true, callSid: call.sid });
  } catch (err) {
    console.error('[OutboundRoute] Error:', err.message);
    res.status(500).json({ 
      error: 'Failed to initiate call', 
      details: err.message 
    });
  }
}

module.exports = {
  initiateOutboundCall
};
