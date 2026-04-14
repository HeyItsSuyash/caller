require('dotenv').config({ path: 'backend/.env' });
const { connect, closeConnection, saveCall, getEntityCalls } = require('../services/mongodb');
const entityService = require('../services/entity');
const { ObjectId } = require('mongodb');

async function verifySystem() {
  const db = await connect();
  if (!db) return;

  try {
    console.log('--- System Verification Start ---');

    // 1. Create a Test Entity
    const testEntity = await entityService.createEntity({
      name: 'Verification Bot',
      purpose: 'System testing',
      instructions: 'You are a test bot. Be extremely formal.',
      userId: new ObjectId() // Random test user
    });
    console.log(`[1] Test Entity Created: ${testEntity.name}`);

    // 2. Simulate Save Call
    const callData = {
      phone: '+1234567890',
      entity_id: testEntity._id,
      transcript: [{ speaker: 'user', text: 'I want to buy everything.' }],
      summary: 'User expressed extreme interest in purchasing.',
      intent: 'high_interest',
      resolution: 'resolved'
    };
    await saveCall(callData);
    console.log(`[2] Simulated Call Saved.`);

    // 3. Verify Analytics Aggregation
    const calls = await getEntityCalls(testEntity._id);
    console.log(`[3] Analytics Check: Found ${calls.length} calls for entity.`);

    if (calls.length > 0 && calls[0].intent === 'high_interest') {
      console.log('--- ✅ All Core Systems Synchronized ---');
    } else {
      console.error('--- ❌ Verification Failed: Data mismatch ---');
    }

  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await closeConnection();
  }
}

verifySystem();
