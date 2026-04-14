const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../services/user');
const { authenticate } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this-in-prod';

/**
 * @route POST /auth/signup
 * @desc Register a new user
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, accountType } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password || !accountType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 2. Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User (Default role: user)
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      accountType,
      role: 'user' // Default role
    });

    // 5. Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountType: user.accountType
      }
    });

  } catch (err) {
    console.error(`[AuthRoute] Signup error:`, err.message);
    res.status(500).json({ error: 'Internal server error during signup' });
  }
});

/**
 * @route POST /auth/login
 * @desc Authenticate user and get token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 2. Find User
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountType: user.accountType
      }
    });

  } catch (err) {
    console.error(`[AuthRoute] Login error:`, err.message);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

/**
 * @route GET /auth/me
 * @desc Get current user details
 */
router.get('/me', authenticate, (req, res) => {
  const user = req.user;
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    accountType: user.accountType
  });
});

module.exports = router;
