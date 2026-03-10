/**
 * Initialize and Start Server
 * Seeds database and starts the API server
 */

const { seedDatabase } = require('./data/seed');

// Seed the database with sample data
console.log('🌱 Initializing SkillStream...');
seedDatabase();

// Start the server
require('./server');
