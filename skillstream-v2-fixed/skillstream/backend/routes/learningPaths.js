/**
 * Learning Path Routes
 * Handles adaptive learning path generation and management
 */

const express = require('express');
const db = require('../utils/database');
const adaptiveEngine = require('../utils/adaptiveEngine');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/learning-paths/generate
 * Generate a personalized learning path
 */
router.post('/generate', authenticateToken, (req, res) => {
  try {
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Target category required' });
    }

    // Generate personalized path
    const learningPath = adaptiveEngine.generateLearningPath(employee.id, category);
    
    // Save to database
    const savedPath = db.createLearningPath(learningPath);

    res.json({
      message: 'Learning path generated successfully',
      path: savedPath
    });
  } catch (error) {
    console.error('Generate path error:', error);
    res.status(500).json({ error: 'Failed to generate learning path' });
  }
});

/**
 * GET /api/learning-paths/me
 * Get all learning paths for current employee
 */
router.get('/me', authenticateToken, (req, res) => {
  try {
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    const paths = db.getLearningPathsByEmployee(employee.id);

    res.json({
      total: paths.length,
      paths
    });
  } catch (error) {
    console.error('Get paths error:', error);
    res.status(500).json({ error: 'Failed to retrieve learning paths' });
  }
});

/**
 * GET /api/learning-paths/:id
 * Get specific learning path
 */
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const path = db.getLearningPath(req.params.id);
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Verify ownership (unless admin)
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (path.employeeId !== employee?.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(path);
  } catch (error) {
    console.error('Get path error:', error);
    res.status(500).json({ error: 'Failed to retrieve learning path' });
  }
});

/**
 * POST /api/learning-paths/:id/adapt
 * Adapt learning path based on performance
 */
router.post('/:id/adapt', authenticateToken, (req, res) => {
  try {
    const path = db.getLearningPath(req.params.id);
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Verify ownership
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (path.employeeId !== employee?.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get recent performance data
    const scores = db.getScoresForEmployee(employee.id);
    const recentScores = scores.slice(-5);
    
    if (recentScores.length === 0) {
      return res.status(400).json({ 
        error: 'Not enough performance data to adapt path' 
      });
    }

    const avgScore = recentScores.reduce((sum, s) => sum + s.score, 0) / recentScores.length;
    const progress = db.getAllProgressForEmployee(employee.id);
    
    // Identify struggling topics
    const strugglingTopics = [];
    recentScores.forEach(score => {
      if (score.score < 70) {
        const asset = db.getAsset(score.assetId);
        if (asset) {
          strugglingTopics.push(...asset.tags);
        }
      }
    });

    // Calculate completion speed (modules per week)
    const completedModules = progress.filter(p => p.percentComplete === 100);
    const avgTimePerModule = completedModules.length > 0
      ? completedModules.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / completedModules.length
      : 0;
    const completionSpeed = avgTimePerModule > 0 ? 60 / avgTimePerModule : 1;

    const performanceData = {
      recentScores: { average: avgScore, scores: recentScores.map(s => s.score) },
      completionSpeed,
      strugglingTopics: [...new Set(strugglingTopics)]
    };

    // Adapt the path
    const adaptedPath = adaptiveEngine.adaptPath(req.params.id, performanceData);

    res.json({
      message: 'Learning path adapted successfully',
      path: adaptedPath,
      adaptations: adaptedPath.adaptations
    });
  } catch (error) {
    console.error('Adapt path error:', error);
    res.status(500).json({ error: 'Failed to adapt learning path' });
  }
});

/**
 * GET /api/learning-paths/:id/next
 * Get next recommended asset in path
 */
router.get('/:id/next', authenticateToken, (req, res) => {
  try {
    const path = db.getLearningPath(req.params.id);
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Verify ownership
    const employees = db.getAllEmployees();
    const employee = employees.find(e => e.email === req.user.email);
    
    if (path.employeeId !== employee?.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const nextAsset = adaptiveEngine.suggestNextAsset(employee.id, req.params.id);

    res.json(nextAsset);
  } catch (error) {
    console.error('Get next asset error:', error);
    res.status(500).json({ error: 'Failed to get next asset' });
  }
});

module.exports = router;
