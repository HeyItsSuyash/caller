require('dotenv').config();
const { createUser, findUserByEmail, findUserById } = require('../services/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this-in-prod';

async function verifyAuth() {
  console.log('--- CALLER AI Auth Verification ---');
  
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'password123';
  const testName = 'Test User';
  const testAccountType = 'personal';

  try {
    // 1. Test User Creation
    console.log('Testing user creation...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);
    
    const user = await createUser({
      name: testName,
      email: testEmail,
      password: hashedPassword,
      accountType: testAccountType,
      role: 'user'
    });
    
    console.log('✅ User created:', user.email, 'Role:', user.role);

    // 2. Test Finding User by Email
    console.log('Testing findUserByEmail...');
    const foundUser = await findUserByEmail(testEmail);
    if (foundUser && foundUser.name === testName) {
      console.log('✅ Found user by email!');
    } else {
      throw new Error('Could not find user by email');
    }

    // 3. Test Password Comparison
    console.log('Testing password comparison...');
    const isMatch = await bcrypt.compare(testPassword, foundUser.password);
    if (isMatch) {
      console.log('✅ Password match successful!');
    } else {
      throw new Error('Password mismatch');
    }

    // 4. Test JWT Generation and Verification
    console.log('Testing JWT flow...');
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.id.toString() === user._id.toString()) {
      console.log('✅ JWT sign/verify successful!');
    } else {
      throw new Error('JWT verification failed');
    }

    // 5. Test Find User by ID (from decoded token)
    console.log('Testing findUserById...');
    const userById = await findUserById(decoded.id);
    if (userById && userById.email === testEmail) {
      console.log('✅ Found user by ID!');
    } else {
      throw new Error('Could not find user by ID');
    }

    console.log('\n--- ALL AUTH LOGIC VERIFIED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ VERIFICATION FAILED:', err.message);
    process.exit(1);
  }
}

verifyAuth();
