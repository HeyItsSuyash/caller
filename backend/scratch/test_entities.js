require('dotenv').config({ path: 'backend/.env' });
const { connect, getDb, closeConnection } = require('../services/mongodb');
const entityService = require('../services/entity');
const { ObjectId } = require('mongodb');

async function test() {
  const db = await connect();
  console.log('Connected to DB');

  try {
    if (!db) throw new Error('DB connection failed');
    
    // Clear test entities
    await db.collection('entities').deleteMany({ isTest: true });
    
    const userId = new ObjectId();
    
    console.log('\n--- Step 1: Create Entity ---');
    const entityData = {
      name: 'Test Sales Bot',
      purpose: 'Testing entity system',
      voice_model: 'ElevenLabs',
      instructions: 'Be helpful and sell things.',
      userId: userId,
      isTest: true
    };
    
    const created = await entityService.createEntity(entityData);
    console.log('Created Entity:', created);
    
    console.log('\n--- Step 2: Fetch User Entities ---');
    const userEntities = await entityService.getEntitiesByUser(userId);
    console.log('Fetched Entities:', userEntities.length);
    if (userEntities.length !== 1) throw new Error('Failed to fetch entities for user');
    
    console.log('\n--- Step 3: Get Entity by ID ---');
    const fetched = await entityService.getEntityById(created._id);
    console.log('Fetched by ID:', fetched.name);
    if (fetched.name !== entityData.name) throw new Error('Data mismatch');

    console.log('\n--- Step 4: Update Entity ---');
    const updated = await entityService.updateEntity(created._id, userId, { name: 'Updated Bot' });
    console.log('Updated Name:', updated.name);
    if (updated.name !== 'Updated Bot') throw new Error('Update failed');

    console.log('\n--- Step 5: Delete Entity ---');
    const deleted = await entityService.deleteEntity(created._id, userId);
    console.log('Deleted successfully:', deleted);
    if (!deleted) throw new Error('Delete failed');

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await closeConnection();
    console.log('Connection closed');
  }
}

test();
