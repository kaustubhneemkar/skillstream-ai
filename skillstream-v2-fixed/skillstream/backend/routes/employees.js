/**
 * Employee Routes
 * Handles employee profile, progress tracking, and analytics
 */

const express = require('express');
const db = require('../utils/database');
const adaptiveEngine = require('../utils/adaptiveEngine');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/employees/me
 * Get current employee's profile
 */
router.get('/me', authenticateToken, (req, res) => {
  try {
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Failed to retrieve employee profile' });
  }
});

/**
 * PUT /api/employees/me
 * Update current employee's profile
 */
router.put('/me', authenticateToken, (req, res) => {
  try {
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    const updates = req.body;
    const updated = db.updateEmployee(employee.id, updates);

    res.json({
      message: 'Profile updated successfully',
      employee: updated
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * GET /api/employees/me/progress
 * Get current employee's learning progress
 */
router.get('/me/progress', authenticateToken, (req, res) => {
  try {
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    const progress = db.getAllProgressForEmployee(employee.id);
    const scores = db.getScoresForEmployee(employee.id);

    res.json({
      progress,
      scores,
      summary: {
        totalModulesStarted: progress.length,
        totalModulesCompleted: progress.filter(p => p.percentComplete === 100).length,
        averageScore: scores.length > 0 
          ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length 
          : null
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to retrieve progress' });
  }
});

/**
 * POST /api/employees/me/progress
 * Update progress for a specific asset
 */
router.post('/me/progress', authenticateToken, (req, res) => {
  try {
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    const { assetId, percentComplete, timeSpent } = req.body;

    if (!assetId || percentComplete === undefined) {
      return res.status(400).json({ error: 'assetId and percentComplete required' });
    }

    const progress = db.updateProgress(employee.id, assetId, {
      percentComplete,
      timeSpent: timeSpent || 0
    });

    res.json({
      message: 'Progress updated',
      progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

/**
 * POST /api/employees/me/scores
 * Submit quiz/assessment score
 */
router.post('/me/scores', authenticateToken, (req, res) => {
  try {
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    const { assetId, score, maxScore, timeTaken } = req.body;

    if (!assetId || score === undefined) {
      return res.status(400).json({ error: 'assetId and score required' });
    }

    const scoreRecord = db.addScore(employee.id, assetId, {
      score,
      maxScore: maxScore || 100,
      timeTaken: timeTaken || 0
    });

    res.json({
      message: 'Score recorded',
      score: scoreRecord
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

/**
 * GET /api/employees/me/analytics
 * Get performance analytics
 */
router.get('/me/analytics', authenticateToken, (req, res) => {
  try {
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    const analytics = adaptiveEngine.getPerformanceAnalytics(employee.id);

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

/**
 * GET /api/employees (Admin only)
 * Get all employees
 */
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const employees = db.getAllEmployees();
    res.json({ total: employees.length, employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to retrieve employees' });
  }
});

/**
 * GET /api/employees/:id (Admin only)
 * Get specific employee by ID
 */
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const employee = db.getEmployee(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Failed to retrieve employee' });
  }
});

module.exports = router;
