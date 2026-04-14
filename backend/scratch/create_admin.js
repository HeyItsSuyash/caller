require('dotenv').config({ path: 'backend/.env' });
const { connect, closeConnection } = require('../services/mongodb');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const db = await connect();
  if (!db) return;

  try {
    const adminEmail = 'admin@caller.ai';
    const adminPassword = 'admin123';
    
    // Check if admin already exists
    const existing = await db.collection('users').findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin account already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = {
      name: 'System Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      accountType: 'enterprise',
      createdAt: new Date()
    };

    await db.collection('users').insertOne(adminUser);
    
    console.log('-----------------------------------');
    console.log('SUCCESS: Admin Account Created!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('-----------------------------------');
    console.log('You can now log in to the dashboard with these credentials.');

  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await closeConnection();
  }
}

createAdmin();
