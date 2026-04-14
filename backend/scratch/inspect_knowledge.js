require('dotenv').config({ path: 'backend/.env' });
const { connect, closeConnection } = require('../services/mongodb');

async function inspect() {
  const db = await connect();
  if (!db) return;

  try {
    const knowledge = await db.collection('knowledge').find({}).toArray();
    console.log('--- Knowledge Base Content ---');
    knowledge.forEach(k => {
      console.log(`ID: ${k._id}, Title: ${k.title}, Entity: ${k.entity || 'GLOBAL'}`);
    });
    console.log('--- End ---');
  } catch (err) {
    console.error(err);
  } finally {
    await closeConnection();
  }
}

inspect();
