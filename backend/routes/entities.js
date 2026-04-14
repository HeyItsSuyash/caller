const express = require('express');
const router = express.Router();
const entityService = require('../services/entity');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   POST /entities
 * @desc    Create a new entity
 * @access  Private
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, purpose, voice_model, instructions } = req.body;
    
    if (!name || !purpose) {
      return res.status(400).json({ error: 'Name and Purpose are required' });
    }

    const entity = await entityService.createEntity({
      name,
      purpose,
      voice_model: voice_model || 'Google Standard',
      instructions: instructions || '',
      userId: req.user.id
    });

    res.status(201).json(entity);
  } catch (error) {
    console.error('Create entity error:', error);
    res.status(500).json({ error: 'Failed to create entity' });
  }
});

/**
 * @route   GET /entities
 * @desc    Get all entities for the logged-in user
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    let targetUserId = req.user.id;

    // Admin override: Fetch for a specific user if userId param is provided
    if (req.user.role === 'admin' && req.query.userId) {
      targetUserId = req.query.userId;
      console.log(`[Admin Override] Admin ${req.user.id} fetching entities for user ${targetUserId}`);
    }

    const entities = await entityService.getEntitiesByUser(targetUserId);
    res.json(entities);
  } catch (error) {
    console.error('Get entities error:', error);
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

/**
 * @route   GET /entities/all
 * @desc    Get all entities (Admin only)
 * @access  Private/Admin
 */
router.get('/all', authenticate, authorize('admin'), async (req, res) => {
  try {
    const entities = await entityService.getAllEntities();
    res.json(entities);
  } catch (error) {
    console.error('Get all entities error:', error);
    res.status(500).json({ error: 'Failed to fetch all entities' });
  }
});

/**
 * @route   GET /entities/:id
 * @desc    Get entity by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const entity = await entityService.getEntityById(req.params.id);
    
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    // Check ownership
    if (entity.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.json(entity);
  } catch (error) {
    console.error('Get entity error:', error);
    res.status(500).json({ error: 'Failed to fetch entity' });
  }
});

/**
 * @route   PATCH /entities/:id
 * @desc    Update an entity
 * @access  Private
 */
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const entity = await entityService.updateEntity(req.params.id, req.user.id, req.body);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found or unauthorized' });
    }
    res.json(entity);
  } catch (error) {
    console.error('Update entity error:', error);
    res.status(500).json({ error: 'Failed to update entity' });
  }
});

/**
 * @route   DELETE /entities/:id
 * @desc    Delete an entity
 * @access  Private
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const success = await entityService.deleteEntity(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ error: 'Entity not found or unauthorized' });
    }
    res.json({ message: 'Entity deleted successfully' });
  } catch (error) {
    console.error('Delete entity error:', error);
    res.status(500).json({ error: 'Failed to delete entity' });
  }
});

module.exports = router;
