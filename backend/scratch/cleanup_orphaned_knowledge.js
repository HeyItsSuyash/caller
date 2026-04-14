require('dotenv').config({ path: 'backend/.env' });
const { connect, closeConnection } = require('../services/mongodb');

async function cleanup() {
  const db = await connect();
  if (!db) return;

  try {
    console.log('--- Cleaning up orphaned knowledge fragments ---');
    
    // 1. Fetch all existing entity names
    const entities = await db.collection('entities').find({}).toArray();
    const existingEntityNames = new Set(entities.map(e => e.name.toLowerCase()));
    
    console.log(`Found ${existingEntityNames.size} active agents in the system.`);

    // 2. Fetch all knowledge fragments
    const knowledge = await db.collection('knowledge').find({}).toArray();
    console.log(`Checking ${knowledge.length} knowledge total fragments...`);

    let deletedCount = 0;
    for (const fragment of knowledge) {
      const entityName = fragment.entity;
      
      // If the fragment is tagged with an entity but that entity doesn't exist anymore
      if (entityName && entityName !== 'unknown' && !existingEntityNames.has(entityName.toLowerCase())) {
        console.log(`Deleting orphan: "${fragment.title}" (belongs to deleted agent "${entityName}")`);
        await db.collection('knowledge').deleteOne({ _id: fragment._id });
        deletedCount++;
      }
    }

    console.log(`--- Cleanup complete! Deleted ${deletedCount} orphaned fragments. ---`);
  } catch (err) {
    console.error('Cleanup error:', err);
  } finally {
    await closeConnection();
  }
}

cleanup();
