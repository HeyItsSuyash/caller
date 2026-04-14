const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const entityService = require('../services/entity');
const { connect } = require('../services/mongodb');

/**
 * @route   GET /admin/users
 * @desc    Get all users with entity counts (Admin only)
 * @access  Private/Admin
 */
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const db = await connect();
    const users = await db.collection('users').find({}).toArray();
    
    // Enrich with entity counts
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const count = await db.collection('entities').countDocuments({ 
        userId: new (require('mongodb').ObjectId)(user._id) 
      });
      const { password, ...safeUser } = user;
      return { ...safeUser, entityCount: count };
    }));

    res.json(enrichedUsers);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @route   GET /admin/analytics
 * @desc    Get global system analytics (Admin only)
 * @access  Private/Admin
 */
router.get('/analytics', authenticate, authorize('admin'), async (req, res) => {
  try {
    const db = await connect();
    const totalCalls = await db.collection('calls').countDocuments({});
    const totalUsers = await db.collection('users').countDocuments({});
    const totalEntities = await db.collection('entities').countDocuments({});
    
    // Top intents across system
    const intentAggr = await db.collection('calls').aggregate([
      { $group: { _id: "$intent", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();

    res.json({
      totalCalls,
      totalUsers,
      totalEntities,
      topIntents: intentAggr.map(i => ({ intent: i._id || 'unknown', count: i.count }))
    });
  } catch (error) {
    console.error('Global analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch system analytics' });
  }
});

/**
 * @route   GET /admin/leads
 * @desc    Get all leads across system (Admin only)
 * @access  Private/Admin
 */
router.get('/leads', authenticate, authorize('admin'), async (req, res) => {
  try {
    const db = await connect();
    const leads = await db.collection('leads')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(leads);
  } catch (error) {
    console.error('Admin leads error:', error);
    res.status(500).json({ error: 'Failed to fetch global leads' });
  }
});

/**
 * @route   GET /admin/entities
 * @desc    Get all entities (Admin only)
 */
router.get('/entities', authenticate, authorize('admin'), async (req, res) => {
  try {
    const entities = await entityService.getAllEntities();
    res.json(entities);
  } catch (error) {
    console.error('Admin entities error:', error);
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

/**
 * @route   GET /admin/calls
 * @desc    Get all calls (Admin only)
 */
router.get('/calls', authenticate, authorize('admin'), async (req, res) => {
  try {
    const db = await connect();
    const calls = await db.collection('calls')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    res.json(calls);
  } catch (error) {
    console.error('Admin calls error:', error);
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
});

module.exports = router;
