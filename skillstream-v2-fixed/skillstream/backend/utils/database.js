/**
 * In-Memory Database
 * Simple data storage layer for demo purposes
 * In production, replace with MongoDB, PostgreSQL, etc.
 */

const { v4: uuidv4 } = require('uuid');

class Database {
  constructor() {
    this.users = new Map();
    this.employees = new Map();
    this.assets = new Map();
    this.learningPaths = new Map();
    this.progress = new Map();
    this.scores = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  createUser(userData) {
    const id = uuidv4();
    const user = { id, ...userData, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  getUserByEmail(email) {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  getUserById(id) {
    return this.users.get(id);
  }

  // Employee methods
  createEmployee(employeeData) {
    const id = uuidv4();
    const employee = { id, ...employeeData, createdAt: new Date() };
    this.employees.set(id, employee);
    return employee;
  }

  getEmployee(id) {
    return this.employees.get(id);
  }

  updateEmployee(id, updates) {
    const employee = this.employees.get(id);
    if (!employee) return null;
    const updated = { ...employee, ...updates, updatedAt: new Date() };
    this.employees.set(id, updated);
    return updated;
  }

  getAllEmployees() {
    return Array.from(this.employees.values());
  }

  // Asset methods
  createAsset(assetData) {
    const id = uuidv4();
    const asset = { id, ...assetData, createdAt: new Date() };
    this.assets.set(id, asset);
    return asset;
  }

  getAsset(id) {
    return this.assets.get(id);
  }

  updateAsset(id, updates) {
    const asset = this.assets.get(id);
    if (!asset) return null;
    const updated = { ...asset, ...updates, updatedAt: new Date() };
    this.assets.set(id, updated);
    return updated;
  }

  deleteAsset(id) {
    return this.assets.delete(id);
  }

  getAllAssets() {
    return Array.from(this.assets.values());
  }

  getAssetsByFilters(filters) {
    let assets = this.getAllAssets();
    
    if (filters.category) {
      assets = assets.filter(a => a.category === filters.category);
    }
    if (filters.difficulty) {
      assets = assets.filter(a => a.difficulty === filters.difficulty);
    }
    if (filters.format) {
      assets = assets.filter(a => a.format === filters.format);
    }
    
    return assets;
  }

  // Learning Path methods
  createLearningPath(pathData) {
    const id = uuidv4();
    const path = { id, ...pathData, createdAt: new Date() };
    this.learningPaths.set(id, path);
    return path;
  }

  getLearningPath(id) {
    return this.learningPaths.get(id);
  }

  updateLearningPath(id, updates) {
    const path = this.learningPaths.get(id);
    if (!path) return null;
    const updated = { ...path, ...updates, updatedAt: new Date() };
    this.learningPaths.set(id, updated);
    return updated;
  }

  getLearningPathsByEmployee(employeeId) {
    return Array.from(this.learningPaths.values())
      .filter(p => p.employeeId === employeeId);
  }

  // Progress tracking methods
  updateProgress(employeeId, assetId, progressData) {
    const key = `${employeeId}-${assetId}`;
    const existing = this.progress.get(key) || {};
    const updated = { 
      ...existing, 
      ...progressData, 
      employeeId, 
      assetId,
      lastUpdated: new Date() 
    };
    this.progress.set(key, updated);
    return updated;
  }

  getProgress(employeeId, assetId) {
    const key = `${employeeId}-${assetId}`;
    return this.progress.get(key);
  }

  getAllProgressForEmployee(employeeId) {
    return Array.from(this.progress.values())
      .filter(p => p.employeeId === employeeId);
  }

  // Score tracking methods
  addScore(employeeId, assetId, scoreData) {
    const id = uuidv4();
    const score = { 
      id, 
      employeeId, 
      assetId, 
      ...scoreData, 
      timestamp: new Date() 
    };
    this.scores.set(id, score);
    return score;
  }

  getScoresForEmployee(employeeId) {
    return Array.from(this.scores.values())
      .filter(s => s.employeeId === employeeId);
  }

  getScoresForAsset(employeeId, assetId) {
    return Array.from(this.scores.values())
      .filter(s => s.employeeId === employeeId && s.assetId === assetId);
  }

  // Initialize sample data
  initializeSampleData() {
    // This will be populated by the seed data file
    console.log('Database initialized - ready for sample data');
  }
}

// Export singleton instance
const db = new Database();
module.exports = db;
