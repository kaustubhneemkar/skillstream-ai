# SkillStream - Adaptive Learning Platform

**Intelligent, personalized corporate training that adapts to every employee.**

![SkillStream](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop)

## 🚀 Overview

SkillStream is a next-generation adaptive learning platform designed for corporate training. It uses intelligent algorithms to create personalized learning paths that adapt in real-time based on employee performance, learning style, and background.

### Key Features

✅ **Smart Employee Profiling** - Track skills, preferences, and learning styles  
✅ **Adaptive Learning Paths** - AI-generated certification paths that evolve with performance  
✅ **Real-Time Adaptation** - Struggling? Get easier content. Excelling? Skip ahead  
✅ **Performance Analytics** - Detailed insights into strengths, gaps, and progress  
✅ **Rich Asset Catalog** - Video, text, and interactive learning modules  
✅ **Admin Dashboard** - Platform management and employee analytics  

---

## 📁 Project Structure

```
skillstream/
├── backend/              # Node.js + Express API
│   ├── routes/          # API route handlers
│   ├── models/          # Data models (future DB schemas)
│   ├── utils/           # Adaptive engine & database
│   ├── middleware/      # Authentication middleware
│   ├── data/            # Sample seed data
│   ├── server.js        # Express server
│   ├── init.js          # Initialization script
│   └── package.json     
│
├── frontend/            # React application
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   ├── context/     # React context (auth)
│   │   ├── styles/      # CSS files
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   └── package.json
│
└── README.md           # This file
```

---

## 🏗️ Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on: **http://localhost:5000**

The database will automatically seed with sample data on first run.

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Application runs on: **http://localhost:3000**

---

## 🔐 Default Login Credentials

### Admin Account
- **Email:** admin@skillstream.com  
- **Password:** admin123

### Sample Employees
- **Email:** sarah.chen@company.com  
- **Password:** password123

- **Email:** marcus.williams@company.com  
- **Password:** password123

- **Email:** emily.rodriguez@company.com  
- **Password:** password123

*All sample employees use password: `password123`*

---

## 🎯 Features in Detail

### 1. Asset Catalog Module

Structured library of learning assets with:
- **12+ sample assets** across Cloud, AI, DevOps, and Cybersecurity
- **Multiple formats**: Video, Text, Interactive simulations
- **Difficulty levels**: Beginner, Intermediate, Advanced
- **Rich metadata**: Tags, prerequisites, duration, thumbnails
- **Admin management**: Add, edit, delete, and tag assets

### 2. Employee Profiling Engine

Tracks comprehensive employee data:
- **Skill background** and current level
- **Learning preferences** (Visual, Text, Hands-on)
- **Progress percentage** across all modules
- **Quiz/simulation scores**
- **Time spent** on each module
- **Strengths and gaps** identification

### 3. Adaptive Learning Path Logic

The core intelligence engine that:

**Generation:**
- Analyzes employee profile to score and rank assets
- Matches learning format preferences (30 points)
- Aligns difficulty to skill level (40 points)
- Considers background alignment (20 points)
- Addresses identified gaps (10 points)
- Respects prerequisites and builds optimal sequences

**Real-Time Adaptation:**
- **Low scores (<70)**: Adds easier content, prerequisites, alternate formats
- **High scores (>85)**: Skips redundant modules, adds advanced content
- **Fast completion**: Expands path with supplementary modules
- **Struggling topics**: Inserts remedial materials

### 4. Professional Dashboard

Employee view includes:
- **Current certification path** with visual timeline
- **Estimated time to completion**
- **Recommended next asset**
- **Performance insights**: Scores, time, strengths, gaps
- **Learning progress graph** with trend analysis
- **Module cards** with quick-start actions

### 5. Admin Panel

Platform management tools:
- **Platform statistics**: Total employees, assets, paths, average scores
- **Employee analytics**: Detailed per-employee metrics
- **Asset analytics**: Usage stats, completion rates, average scores
- **Database management**: Reseed with sample data
- **Asset management**: Full CRUD operations

---

## 🧠 How the Adaptive Engine Works

### Scoring Algorithm

Each asset receives a score (0-100) based on employee fit:

```javascript
Score Components:
- Format Preference Match:  30 points
- Difficulty-Level Alignment: 40 points
- Background Alignment:     20 points
- Gap Coverage:            10 points
```

### Path Sequencing

1. **Sort assets** by score (highest first)
2. **Respect prerequisites** (can't take advanced before basics)
3. **Smooth difficulty progression** (gradual ramp-up)
4. **Calculate estimates** (total duration, weeks to complete)

### Real-Time Adaptation

After every 5 completed modules:
- **Calculate average score** from recent performance
- **Identify struggling topics** (score < 70)
- **Measure completion speed** (vs. expected)
- **Modify path dynamically**:
  - Insert easier/harder content
  - Remove redundant modules
  - Add remedial materials

---

## 🎨 Design Philosophy

**Industrial-Modern Aesthetic**

- **Typography**: Bebas Neue (display), Work Sans (body), IBM Plex Mono (code)
- **Color Palette**: 
  - Primary: Electric Orange (#FF6B35)
  - Secondary: Deep Blue (#004E89)
  - Accent: Golden Yellow (#F7B801)
  - Dark neutrals with high contrast
- **Visual Style**: Bold, utilitarian, tech-forward
- **Animations**: Subtle micro-interactions, slide-ins, shimmer effects
- **Components**: Card-based layout, gradient accents, geometric patterns

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login      - User login
POST   /api/auth/signup     - Create account
POST   /api/auth/verify     - Verify token
```

### Assets
```
GET    /api/assets                    - Get all assets (with filters)
GET    /api/assets/:id                - Get single asset
GET    /api/assets/categories/list    - Get categories
POST   /api/assets                    - Create asset (Admin)
PUT    /api/assets/:id                - Update asset (Admin)
DELETE /api/assets/:id                - Delete asset (Admin)
```

### Employees
```
GET    /api/employees/me              - Get current profile
PUT    /api/employees/me              - Update profile
GET    /api/employees/me/progress     - Get learning progress
POST   /api/employees/me/progress     - Update progress
POST   /api/employees/me/scores       - Submit quiz score
GET    /api/employees/me/analytics    - Get performance analytics
GET    /api/employees                 - Get all employees (Admin)
```

### Learning Paths
```
POST   /api/learning-paths/generate   - Generate personalized path
GET    /api/learning-paths/me         - Get employee's paths
GET    /api/learning-paths/:id        - Get specific path
POST   /api/learning-paths/:id/adapt  - Adapt based on performance
GET    /api/learning-paths/:id/next   - Get next recommended asset
```

### Admin
```
GET    /api/admin/stats                    - Platform statistics
GET    /api/admin/employees                - All employees with analytics
GET    /api/admin/employees/:id/details    - Detailed employee info
POST   /api/admin/seed                     - Reseed database
GET    /api/admin/assets/analytics         - Asset usage analytics
```

---

## 🚀 Deployment

### Backend (Production)

```bash
cd backend
npm install --production
export NODE_ENV=production
export PORT=5000
export JWT_SECRET=your-secret-key
node init.js
```

### Frontend (Production)

```bash
cd frontend
npm run build
# Serve the build folder with nginx, Apache, or static hosting
```

### Environment Variables

**Backend (.env):**
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=production
```

**Frontend (.env):**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

---

## 🔮 Future Enhancements

- **Database Integration**: Replace in-memory storage with MongoDB/PostgreSQL
- **Machine Learning**: Train models on historical data for better predictions
- **Gamification**: Badges, leaderboards, streak tracking
- **Social Learning**: Peer discussions, study groups
- **Mobile App**: Native iOS/Android applications
- **Video Streaming**: Built-in video player with progress tracking
- **Certificate Generation**: Automated PDF certificates
- **LMS Integration**: Connect with existing learning management systems
- **Advanced Analytics**: Predictive models, cohort analysis
- **Multi-tenancy**: Support for multiple organizations

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🤝 Contributing

This is a demo/portfolio project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

For questions or issues:
- Create an issue in the GitHub repository
- Email: support@skillstream.example.com

---

**Built with ❤️ for smarter corporate learning**
