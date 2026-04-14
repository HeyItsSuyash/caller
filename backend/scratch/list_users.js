require('dotenv').config({ path: 'backend/.env' });
const { connect, closeConnection } = require('../services/mongodb');

async function listUsers() {
  const db = await connect();
  if (!db) return;
  try {
    const users = await db.collection('users').find({}).toArray();
    console.log('--- System Users ---');
    users.forEach(u => console.log(`Name: ${u.name}, Email: ${u.email}, Role: ${u.role || 'user'}`));
    console.log('--------------------');
  } catch (err) {
      console.error(err);
  } finally {
      await closeConnection();
  }
}
listUsers();
