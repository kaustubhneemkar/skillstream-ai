# SkillStream - Quick Start Guide

## 🎯 Get Running in 5 Minutes

### Step 1: Start the Backend (Terminal 1)

```bash
cd skillstream/backend
npm install
npm start
```

✅ Backend running on http://localhost:5000

### Step 2: Start the Frontend (Terminal 2)

```bash
cd skillstream/frontend
npm install
npm start
```

✅ Frontend running on http://localhost:3000

### Step 3: Login

Navigate to http://localhost:3000

**Try these accounts:**

👤 **Admin Access:**
- Email: `admin@skillstream.com`
- Password: `admin123`

👤 **Employee Access:**
- Email: `sarah.chen@company.com`
- Password: `password123`

---

## 🎓 Try These Features

### As an Employee:

1. **View Dashboard** - See your stats and current learning path
2. **Generate Learning Path** - Click a category (Cloud, AI, DevOps, etc.)
3. **Start Learning** - Click "Start" on any module
4. **Track Progress** - Complete modules and see your score trends
5. **View Analytics** - Check your strengths and areas to improve

### As an Admin:

1. **Login with admin credentials**
2. **View Platform Stats** - See total employees, assets, scores
3. **Manage Employees** - View detailed employee analytics
4. **Reseed Database** - Reset demo data with the "Reseed Database" button
5. **View Asset Analytics** - See which modules are most popular

---

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Backend
export PORT=5001

# Frontend (in package.json)
"start": "PORT=3001 react-scripts start"
```

**Database not seeding?**
```bash
cd backend
node init.js
```

**CORS errors?**
Make sure backend is running on port 5000 or update `REACT_APP_API_URL` in frontend/.env

---

## 📚 Key Files to Explore

### Backend:
- `backend/utils/adaptiveEngine.js` - Core adaptive learning logic
- `backend/data/seed.js` - Sample data (employees + assets)
- `backend/routes/learningPaths.js` - Path generation & adaptation

### Frontend:
- `frontend/src/pages/Dashboard.js` - Main employee dashboard
- `frontend/src/pages/LandingPage.js` - Marketing/landing page
- `frontend/src/context/AuthContext.js` - Authentication logic

---

## 🎨 Customization

**Change color scheme:**
Edit `frontend/src/styles/App.css` (CSS variables at top)

**Add new assets:**
1. Login as admin
2. Navigate to Asset Catalog
3. Or edit `backend/data/seed.js`

**Modify adaptive logic:**
Edit `backend/utils/adaptiveEngine.js` scoring weights

---

## 📖 Full Documentation

See [README.md](./README.md) for complete details on:
- Architecture
- API endpoints
- Adaptive learning algorithm
- Deployment guide
- Future enhancements

---

**Happy Learning! 🚀**
