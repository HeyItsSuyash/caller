require('dotenv').config({ path: 'backend/.env' });
const { connect, closeConnection } = require('../services/mongodb');

async function cleanup() {
  const db = await connect();
  if (!db) {
    console.error('Failed to connect to DB');
    return;
  }

  try {
    console.log('--- Cleaning up leaked entities ---');
    
    // 1. Delete entities where userId is null or undefined (leaked across accounts)
    const result = await db.collection('entities').deleteMany({
      $or: [
        { userId: { $exists: false } },
        { userId: null },
        { userId: "undefined" }, // In case it was saved as a string "undefined"
        { userId: { $type: "undefined" } }
      ]
    });

    console.log(`Successfully deleted ${result.deletedCount} leaked entities.`);
    console.log('The system is now secure and clean.');
  } catch (error) {
    console.error('Cleanup failed:', error);
  } finally {
    await closeConnection();
  }
}

cleanup();
