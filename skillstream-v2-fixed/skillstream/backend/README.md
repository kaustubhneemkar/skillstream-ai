# SkillStream Backend

Adaptive Learning Platform API

## Setup

```bash
npm install
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/verify` - Verify token

### Assets
- `GET /api/assets` - Get all assets (with optional filters)
- `GET /api/assets/:id` - Get single asset
- `GET /api/assets/categories/list` - Get unique categories
- `POST /api/assets` - Create new asset (Admin)
- `PUT /api/assets/:id` - Update asset (Admin)
- `DELETE /api/assets/:id` - Delete asset (Admin)

### Employees
- `GET /api/employees/me` - Get current employee profile
- `PUT /api/employees/me` - Update current employee profile
- `GET /api/employees/me/progress` - Get learning progress
- `POST /api/employees/me/progress` - Update progress
- `POST /api/employees/me/scores` - Submit quiz score
- `GET /api/employees/me/analytics` - Get performance analytics
- `GET /api/employees` - Get all employees (Admin)
- `GET /api/employees/:id` - Get specific employee (Admin)

### Learning Paths
- `POST /api/learning-paths/generate` - Generate personalized path
- `GET /api/learning-paths/me` - Get all paths for current employee
- `GET /api/learning-paths/:id` - Get specific path
- `POST /api/learning-paths/:id/adapt` - Adapt path based on performance
- `GET /api/learning-paths/:id/next` - Get next recommended asset

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/employees` - All employees with analytics
- `GET /api/admin/employees/:id/details` - Detailed employee info
- `POST /api/admin/seed` - Reseed database
- `GET /api/admin/assets/analytics` - Asset usage analytics

## Default Credentials

**Admin:**
- Email: admin@skillstream.com
- Password: admin123

**Sample Employees:**
- Email: [any employee email from seed data]
- Password: password123

Example: sarah.chen@company.com / password123

## Architecture

- **Express.js** - REST API framework
- **In-memory Database** - Simple data storage (replace with MongoDB/PostgreSQL in production)
- **JWT Authentication** - Token-based auth
- **Adaptive Engine** - Personalized learning path generation
- **bcrypt** - Password hashing

## Adaptive Learning Logic

The platform adapts learning paths based on:

1. **Employee Profile**: Skill level, learning preferences, background
2. **Real-time Performance**: Quiz scores, completion speed, struggling topics
3. **Dynamic Adjustments**:
   - Low scores (<70) → Add easier content, prerequisites
   - High scores (>85) → Skip basics, add advanced modules
   - Fast completion → Expand content
   - Struggling topics → Add remedial materials

## Folder Structure

```
backend/
├── data/
│   └── seed.js          # Sample data
├── middleware/
│   └── auth.js          # JWT authentication
├── models/              # (Future: Database schemas)
├── routes/
│   ├── admin.js         # Admin endpoints
│   ├── assets.js        # Asset management
│   ├── auth.js          # Authentication
│   ├── employees.js     # Employee profiles
│   └── learningPaths.js # Learning path generation
├── utils/
│   ├── adaptiveEngine.js # AI-powered path generation
│   └── database.js       # In-memory database
├── init.js              # Initialize and start
├── server.js            # Express server
└── package.json
```
