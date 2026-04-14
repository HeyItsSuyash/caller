require('dotenv').config({ path: 'backend/.env' });
const { connect, closeConnection } = require('../services/mongodb');

const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.error('Error: Please provide an email address. Usage: node promote_admin.js email@example.com');
  process.exit(1);
}

async function promote() {
  const db = await connect();
  if (!db) return;

  try {
    const result = await db.collection('users').updateOne(
      { email: emailToPromote.toLowerCase() },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      console.log(`User with email "${emailToPromote}" not found.`);
    } else {
      console.log(`Success! User "${emailToPromote}" has been promoted to Admin.`);
    }
  } catch (err) {
    console.error('Error during promotion:', err);
  } finally {
    await closeConnection();
  }
}

promote();
