/**
 * Adaptive Learning Engine
 * Generates personalized learning paths based on employee profile and performance
 */

const db = require('./database');

class AdaptiveLearningEngine {
  
  /**
   * Generate a personalized learning path for an employee
   * @param {string} employeeId - Employee ID
   * @param {string} targetCategory - Target skill category (e.g., "Cloud", "AI")
   * @returns {Object} Generated learning path with ordered modules
   */
  generateLearningPath(employeeId, targetCategory) {
    const employee = db.getEmployee(employeeId);
    if (!employee) throw new Error('Employee not found');

    // Get all assets in the target category
    const allAssets = db.getAssetsByFilters({ category: targetCategory });
    
    // Score and rank assets based on employee profile
    const scoredAssets = allAssets.map(asset => ({
      ...asset,
      score: this.calculateAssetScore(asset, employee)
    }));

    // Sort by score (highest first)
    scoredAssets.sort((a, b) => b.score - a.score);

    // Build the learning path with proper sequencing
    const orderedPath = this.buildOptimalSequence(scoredAssets, employee);

    // Calculate estimated completion time
    const totalDuration = orderedPath.reduce((sum, asset) => sum + asset.duration, 0);
    const estimatedWeeks = Math.ceil(totalDuration / (5 * 60)); // Assuming 5 hours per week

    return {
      employeeId,
      category: targetCategory,
      modules: orderedPath,
      totalModules: orderedPath.length,
      totalDuration,
      estimatedWeeks,
      difficulty: this.calculatePathDifficulty(orderedPath),
      createdAt: new Date(),
      status: 'active'
    };
  }

  /**
   * Calculate how well an asset fits the employee's profile
   * Higher score = better fit
   */
  calculateAssetScore(asset, employee) {
    let score = 0;

    // Match learning format preference (0-30 points)
    if (employee.preferredFormats.includes(asset.format)) {
      score += 30;
    } else if (employee.learningPreference === 'Visual' && asset.format === 'Video') {
      score += 25;
    } else if (employee.learningPreference === 'Hands-on' && asset.format === 'Interactive') {
      score += 25;
    } else if (employee.learningPreference === 'Text' && asset.format === 'Text') {
      score += 25;
    }

    // Match difficulty to skill level (0-40 points)
    const difficultyMatch = {
      'Beginner': { 'Beginner': 40, 'Intermediate': 20, 'Advanced': 5 },
      'Intermediate': { 'Beginner': 15, 'Intermediate': 40, 'Advanced': 25 },
      'Advanced': { 'Beginner': 5, 'Intermediate': 20, 'Advanced': 40 }
    };
    score += difficultyMatch[employee.skillLevel][asset.difficulty] || 0;

    // Background alignment (0-20 points)
    const hasBackgroundMatch = asset.tags.some(tag => 
      employee.background.some(bg => 
        tag.toLowerCase().includes(bg.toLowerCase()) || 
        bg.toLowerCase().includes(tag.toLowerCase())
      )
    );
    if (hasBackgroundMatch) score += 20;

    // Gap coverage (0-10 points)
    const addressesGap = asset.tags.some(tag => 
      employee.gaps.some(gap => 
        tag.toLowerCase().includes(gap.toLowerCase()) || 
        gap.toLowerCase().includes(tag.toLowerCase())
      )
    );
    if (addressesGap) score += 10;

    return score;
  }

  /**
   * Build optimal sequence considering prerequisites and difficulty progression
   */
  buildOptimalSequence(scoredAssets, employee) {
    const sequence = [];
    const added = new Set();
    const assetMap = new Map(scoredAssets.map(a => [a.title, a]));

    // Helper to check if prerequisites are met
    const prerequisitesMet = (asset) => {
      if (!asset.prerequisites || asset.prerequisites.length === 0) return true;
      return asset.prerequisites.every(prereq => added.has(prereq));
    };

    // Add assets in order, respecting prerequisites
    let maxIterations = scoredAssets.length * 2;
    let iteration = 0;
    
    while (sequence.length < scoredAssets.length && iteration < maxIterations) {
      for (const asset of scoredAssets) {
        if (!added.has(asset.title) && prerequisitesMet(asset)) {
          sequence.push(asset);
          added.add(asset.title);
        }
      }
      iteration++;
    }

    // Apply difficulty smoothing - ensure gradual progression
    return this.smoothDifficultyProgression(sequence, employee);
  }

  /**
   * Smooth out difficulty progression to avoid sudden jumps
   */
  smoothDifficultyProgression(sequence, employee) {
    const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
    const smoothed = [...sequence];

    // For beginners and intermediates, ensure we don't jump to advanced too quickly
    if (employee.skillLevel === 'Beginner') {
      smoothed.sort((a, b) => {
        const diffA = difficultyOrder[a.difficulty];
        const diffB = difficultyOrder[b.difficulty];
        if (diffA === diffB) return b.score - a.score;
        return diffA - diffB;
      });
    }

    return smoothed;
  }

  /**
   * Adapt learning path based on real-time performance
   * @param {string} pathId - Learning path ID
   * @param {Object} performanceData - Recent performance metrics
   * @returns {Object} Adapted learning path
   */
  adaptPath(pathId, performanceData) {
    const path = db.getLearningPath(pathId);
    if (!path) throw new Error('Learning path not found');

    const employee = db.getEmployee(path.employeeId);
    const { recentScores, completionSpeed, strugglingTopics } = performanceData;

    let adaptations = [];
    let newModules = [...path.modules];

    // If struggling (average score < 70), suggest easier alternatives or prerequisites
    if (recentScores.average < 70) {
      adaptations.push({
        type: 'difficulty_reduction',
        reason: 'Recent performance indicates need for foundational review',
        action: 'Adding prerequisite content'
      });

      // Find easier alternatives in the same category
      const category = path.category;
      const beginnerAssets = db.getAssetsByFilters({ 
        category, 
        difficulty: 'Beginner' 
      });

      // Insert easier content before struggling modules
      strugglingTopics.forEach(topic => {
        const relevantAsset = beginnerAssets.find(asset => 
          asset.tags.some(tag => topic.toLowerCase().includes(tag.toLowerCase()))
        );
        if (relevantAsset && !newModules.find(m => m.id === relevantAsset.id)) {
          const insertIndex = newModules.findIndex(m => 
            m.tags.some(tag => topic.toLowerCase().includes(tag.toLowerCase()))
          );
          if (insertIndex > 0) {
            newModules.splice(insertIndex, 0, relevantAsset);
          }
        }
      });
    }

    // If performing well (average score > 85), skip redundant modules or add advanced content
    if (recentScores.average > 85) {
      adaptations.push({
        type: 'acceleration',
        reason: 'Strong performance indicates readiness for advanced content',
        action: 'Skipping intermediate modules and adding advanced content'
      });

      // Remove beginner modules if employee is excelling
      newModules = newModules.filter(m => m.difficulty !== 'Beginner');

      // Add advanced modules
      const advancedAssets = db.getAssetsByFilters({ 
        category: path.category, 
        difficulty: 'Advanced' 
      });
      advancedAssets.forEach(asset => {
        if (!newModules.find(m => m.id === asset.id)) {
          newModules.push(asset);
        }
      });
    }

    // If completion speed is fast, suggest more content
    if (completionSpeed > 1.5) { // 1.5x expected speed
      adaptations.push({
        type: 'content_expansion',
        reason: 'Rapid completion rate',
        action: 'Adding supplementary advanced modules'
      });
    }

    // Update the path
    const updatedPath = {
      ...path,
      modules: newModules,
      adaptations,
      lastAdapted: new Date()
    };

    db.updateLearningPath(pathId, updatedPath);
    return updatedPath;
  }

  /**
   * Suggest next best asset based on current progress
   */
  suggestNextAsset(employeeId, currentPathId) {
    const path = db.getLearningPath(currentPathId);
    const progress = db.getAllProgressForEmployee(employeeId);
    
    // Find first incomplete module
    const nextModule = path.modules.find(module => {
      const moduleProgress = progress.find(p => p.assetId === module.id);
      return !moduleProgress || moduleProgress.percentComplete < 100;
    });

    if (!nextModule) {
      return { completed: true, message: 'Learning path completed!' };
    }

    return {
      completed: false,
      nextAsset: nextModule,
      position: path.modules.indexOf(nextModule) + 1,
      totalModules: path.modules.length
    };
  }

  /**
   * Calculate overall difficulty of a learning path
   */
  calculatePathDifficulty(modules) {
    const difficultyScores = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
    const avgScore = modules.reduce((sum, m) => sum + difficultyScores[m.difficulty], 0) / modules.length;
    
    if (avgScore < 1.5) return 'Beginner';
    if (avgScore < 2.5) return 'Intermediate';
    return 'Advanced';
  }

  /**
   * Get performance analytics for an employee
   */
  getPerformanceAnalytics(employeeId) {
    const scores = db.getScoresForEmployee(employeeId);
    const progress = db.getAllProgressForEmployee(employeeId);
    
    if (scores.length === 0) {
      return {
        averageScore: null,
        recentScores: [],
        strengths: [],
        weaknesses: [],
        completionRate: 0
      };
    }

    // Calculate average score
    const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

    // Recent scores (last 5)
    const recentScores = scores.slice(-5).map(s => s.score);

    // Identify strengths (topics with avg score > 80)
    const topicScores = {};
    scores.forEach(score => {
      const asset = db.getAsset(score.assetId);
      if (asset) {
        asset.tags.forEach(tag => {
          if (!topicScores[tag]) topicScores[tag] = [];
          topicScores[tag].push(score.score);
        });
      }
    });

    const strengths = Object.entries(topicScores)
      .map(([topic, scores]) => ({
        topic,
        avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
      }))
      .filter(t => t.avgScore > 80)
      .map(t => t.topic);

    const weaknesses = Object.entries(topicScores)
      .map(([topic, scores]) => ({
        topic,
        avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
      }))
      .filter(t => t.avgScore < 70)
      .map(t => t.topic);

    // Completion rate
    const completedModules = progress.filter(p => p.percentComplete === 100).length;
    const totalModules = progress.length;
    const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

    return {
      averageScore,
      recentScores,
      strengths,
      weaknesses,
      completionRate,
      totalModulesCompleted: completedModules,
      totalModulesStarted: totalModules
    };
  }
}

module.exports = new AdaptiveLearningEngine();
