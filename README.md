# SkillStream 🚀 – Dynamic Workforce Upskilling Engine

**SkillStream** is an AI-powered adaptive learning platform designed to eliminate "one-size-fits-all" corporate training. It uses real-time performance data and biometric feedback to ensure every employee learns at their peak efficiency.

## ✨ Key Features
* **Adaptive Path Logic:** Dynamically skips mastered content or re-sequences modules based on quiz scores.
* **Timestamp Navigation:** Automatically jumps "One-Shot" videos to the most relevant chapters.
* **Biometric Engagement Monitoring:** Uses **MediaPipe Face Mesh** to detect drowsiness (EAR) and distraction, triggering smart interventions.
* **AI Smart-Nudges:** Integrated with **Gemini API** to generate instant topic summaries when a user is struggling or tired.

## 🛠️ Tech Stack
* **Frontend:** React.js / Next.js (Tailwind CSS)
* **Backend:** FastAPI (Python) & PostgreSQL
* **Computer Vision:** MediaPipe / OpenCV
* **AI/LLM:** Google Gemini API

## 🚀 Getting Started
1. **Backend:** Navigate to `/backend`, run `pip install -r requirements.txt`, and start uvicorn.
2. **Frontend:** Navigate to `/frontend`, run `npm install` and `npm run dev`.
3. **Engagement Worker:** Run `python engagement_worker/tracker.py` to start the webcam monitoring.