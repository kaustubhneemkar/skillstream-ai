/**
 * Admin Routes
 * Platform administration and analytics
 */

const express = require('express');
const db = require('../utils/database');
const { seedDatabase } = require('../data/seed');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * GET /api/admin/stats
 * Get platform statistics
 */
router.get('/stats', (req, res) => {
  try {
    const employees = db.getAllEmployees();
    const assets = db.getAllAssets();
    const paths = Array.from(db.learningPaths.values());
    
    const totalProgress = Array.from(db.progress.values());
    const totalScores = Array.from(db.scores.values());

    const avgCompletionRate = employees.length > 0
      ? employees.reduce((sum, e) => sum + (e.completionRate || 0), 0) / employees.length
      : 0;

    const avgScore = totalScores.length > 0
      ? totalScores.reduce((sum, s) => sum + s.score, 0) / totalScores.length
      : 0;

    const stats = {
      totalEmployees: employees.length,
      totalAssets: assets.length,
      totalLearningPaths: paths.length,
      totalProgress: totalProgress.length,
      totalScores: totalScores.length,
      averageCompletionRate: Math.round(avgCompletionRate * 100) / 100,
      averageScore: Math.round(avgScore * 100) / 100,
      assetsByCategory: {},
      assetsByDifficulty: {},
      assetsByFormat: {}
    };

    // Group assets by category
    assets.forEach(asset => {
      stats.assetsByCategory[asset.category] = 
        (stats.assetsByCategory[asset.category] || 0) + 1;
      stats.assetsByDifficulty[asset.difficulty] = 
        (stats.assetsByDifficulty[asset.difficulty] || 0) + 1;
      stats.assetsByFormat[asset.format] = 
        (stats.assetsByFormat[asset.format] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

/**
 * GET /api/admin/employees
 * Get all employees with detailed analytics
 */
router.get('/employees', (req, res) => {
  try {
    const employees = db.getAllEmployees();
    
    const enrichedEmployees = employees.map(employee => {
      const progress = db.getAllProgressForEmployee(employee.id);
      const scores = db.getScoresForEmployee(employee.id);
      const paths = db.getLearningPathsByEmployee(employee.id);

      return {
        ...employee,
        stats: {
          activePaths: paths.filter(p => p.status === 'active').length,
          totalProgress: progress.length,
          completedModules: progress.filter(p => p.percentComplete === 100).length,
          averageScore: scores.length > 0
            ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
            : null
        }
      };
    });

    res.json({
      total: enrichedEmployees.length,
      employees: enrichedEmployees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to retrieve employees' });
  }
});

/**
 * GET /api/admin/employees/:id/details
 * Get detailed employee information
 */
router.get('/employees/:id/details', (req, res) => {
  try {
    const employee = db.getEmployee(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const progress = db.getAllProgressForEmployee(employee.id);
    const scores = db.getScoresForEmployee(employee.id);
    const paths = db.getLearningPathsByEmployee(employee.id);

    res.json({
      employee,
      progress,
      scores,
      paths,
      summary: {
        totalModulesStarted: progress.length,
        totalModulesCompleted: progress.filter(p => p.percentComplete === 100).length,
        averageScore: scores.length > 0
          ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length
          : null,
        activePaths: paths.filter(p => p.status === 'active').length
      }
    });
  } catch (error) {
    console.error('Get employee details error:', error);
    res.status(500).json({ error: 'Failed to retrieve employee details' });
  }
});

/**
 * POST /api/admin/seed
 * Seed database with sample data (development only)
 */
router.post('/seed', (req, res) => {
  try {
    seedDatabase();
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

/**
 * GET /api/admin/assets/analytics
 * Get asset usage analytics
 */
router.get('/assets/analytics', (req, res) => {
  try {
    const assets = db.getAllAssets();
    const allProgress = Array.from(db.progress.values());
    const allScores = Array.from(db.scores.values());

    const assetAnalytics = assets.map(asset => {
      const assetProgress = allProgress.filter(p => p.assetId === asset.id);
      const assetScores = allScores.filter(s => s.assetId === asset.id);

      return {
        ...asset,
        analytics: {
          totalStarted: assetProgress.length,
          totalCompleted: assetProgress.filter(p => p.percentComplete === 100).length,
          averageCompletion: assetProgress.length > 0
            ? assetProgress.reduce((sum, p) => sum + p.percentComplete, 0) / assetProgress.length
            : 0,
          averageScore: assetScores.length > 0
            ? assetScores.reduce((sum, s) => sum + s.score, 0) / assetScores.length
            : null,
          totalAttempts: assetScores.length
        }
      };
    });

    res.json({
      total: assetAnalytics.length,
      assets: assetAnalytics
    });
  } catch (error) {
    console.error('Get asset analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve asset analytics' });
  }
});

module.exports = router;
