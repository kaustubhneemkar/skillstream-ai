/**
 * Asset Routes
 * Handles learning asset CRUD and filtering
 */

const express = require('express');
const db = require('../utils/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/assets
 * Get all assets with optional filtering
 */
router.get('/', authenticateToken, (req, res) => {
  try {
    const { category, difficulty, format } = req.query;
    
    let assets = db.getAllAssets();

    // Apply filters
    if (category) {
      assets = assets.filter(a => a.category === category);
    }
    if (difficulty) {
      assets = assets.filter(a => a.difficulty === difficulty);
    }
    if (format) {
      assets = assets.filter(a => a.format === format);
    }

    res.json({
      total: assets.length,
      assets
    });
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({ error: 'Failed to retrieve assets' });
  }
});

/**
 * GET /api/assets/:id
 * Get single asset by ID
 */
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const asset = db.getAsset(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(asset);
  } catch (error) {
    console.error('Get asset error:', error);
    res.status(500).json({ error: 'Failed to retrieve asset' });
  }
});

/**
 * GET /api/assets/categories/list
 * Get unique categories
 */
router.get('/categories/list', authenticateToken, (req, res) => {
  try {
    const assets = db.getAllAssets();
    const categories = [...new Set(assets.map(a => a.category))];
    
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

/**
 * POST /api/assets
 * Create new asset (Admin only)
 */
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const assetData = req.body;

    // Validate required fields
    const required = ['title', 'description', 'category', 'difficulty', 'format', 'duration'];
    const missing = required.filter(field => !assetData[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missing.join(', ')}` 
      });
    }

    // Generate thumbnail from first video if playlist provided
    if (assetData.content?.playlist && assetData.content.playlist.length > 0) {
      const firstVideoId = assetData.content.playlist[0].videoId;
      assetData.thumbnail = `https://img.youtube.com/vi/${firstVideoId}/maxresdefault.jpg`;
    }

    const asset = db.createAsset(assetData);
    
    res.status(201).json({
      message: 'Asset created successfully',
      asset
    });
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

/**
 * PUT /api/assets/:id
 * Update asset (Admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const updates = req.body;
    const asset = db.updateAsset(req.params.id, updates);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({
      message: 'Asset updated successfully',
      asset
    });
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

/**
 * DELETE /api/assets/:id
 * Delete asset (Admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const deleted = db.deleteAsset(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

module.exports = router;
