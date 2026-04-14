const jwt = require('jsonwebtoken');
const { findUserById } = require('../services/user');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this-in-prod';

/**
 * Middleware to verify JWT and attach user to request.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found or token invalid' });
    }

    // Normalize user object: ensure id is available
    req.user = {
      ...user,
      id: user._id.toString()
    };
    next();
  } catch (err) {
    console.error(`[AuthMiddleware] Error:`, err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Higher-order function for role-based authorization.
 */
function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize
};
