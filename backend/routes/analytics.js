const express = require('express');
const router = express.Router();
const { getEntityCalls } = require('../services/mongodb');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /analytics/:entity_id
 * @desc    Get aggregated analytics for a specific entity
 * @access  Private
 */
router.get('/:entity_id', authenticate, async (req, res) => {
  try {
    const { entity_id } = req.params;
    
    // 1. Fetch all calls for this entity
    const calls = await getEntityCalls(entity_id);

    if (!calls || calls.length === 0) {
      return res.json({
        totalCalls: 0,
        recentSummaries: [],
        topIntents: [],
        averageResolution: 0
      });
    }

    // 2. Perform aggregations
    const totalCalls = calls.length;
    const recentSummaries = calls.slice(0, 5).map(c => ({
      summary: c.summary,
      phone: c.phone,
      createdAt: c.createdAt,
      intent: c.intent
    }));

    // Group intents
    const intentCounts = {};
    let resolvedCount = 0;

    calls.forEach(call => {
      const intent = call.intent || 'unknown';
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
      if (call.resolution === 'resolved') resolvedCount++;
    });

    const topIntents = Object.entries(intentCounts)
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const averageResolution = (resolvedCount / totalCalls) * 100;

    res.json({
      totalCalls,
      recentSummaries,
      topIntents,
      averageResolution: Math.round(averageResolution)
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
