/**
 * Authentication Routes
 * Handles user login, signup, and token management
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../utils/database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/signup
 * Create new user account
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password required' });
    }

    // Check if user already exists
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = db.createUser({
      name,
      email,
      password: hashedPassword,
      role: role || 'Employee',
      isAdmin: false
    });

    // Create employee profile
    db.createEmployee({
      userId: user.id,
      name,
      email,
      role: role || 'Employee',
      department: 'General',
      skillLevel: 'Beginner',
      learningPreference: 'Visual',
      background: [],
      strengths: [],
      gaps: [],
      preferredFormats: ['Video', 'Interactive'],
      completionRate: 0,
      averageScore: 0,
      totalHoursSpent: 0
    });

    // Generate token
    const token = generateToken(user);

    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

/**
 * POST /api/auth/verify
 * Verify token validity
 */
router.post('/verify', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('../middleware/auth');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({
      valid: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: 'Invalid token'
    });
  }
});

module.exports = router;
