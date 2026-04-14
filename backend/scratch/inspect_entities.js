require('dotenv').config({ path: 'backend/.env' });
const { connect, closeConnection } = require('../services/mongodb');

async function inspectEntities() {
  const db = await connect();
  if (!db) return;

  try {
    const apps = await db.collection('entities').find({}).toArray();
    console.log('--- Active Agents ---');
    apps.forEach(a => {
      console.log(`ID: ${a._id}, Name: ${a.name}`);
    });
    console.log('--- End ---');
  } catch (err) {
    console.error(err);
  } finally {
    await closeConnection();
  }
}

inspectEntities();
