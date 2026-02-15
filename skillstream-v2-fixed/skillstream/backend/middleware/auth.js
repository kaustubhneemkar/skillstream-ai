/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

const jwt = require('jsonwebtoken');
const db = require('../utils/database');

const JWT_SECRET = process.env.JWT_SECRET || 'skillstream-secret-key-change-in-production';

/**
 * Verify JWT token and attach user to request
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  });
}

/**
 * Verify user is an admin
 */
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

/**
 * Generate JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin || false
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

module.exports = {
  authenticateToken,
  requireAdmin,
  generateToken,
  JWT_SECRET
};
