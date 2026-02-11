# SkillStream AI 🚀

An intelligent educational intervention engine designed to bridge the gap between passive video watching and active learning.

## 🏗️ The System Architecture
This project uses a **Triple-Terminal WebSocket** setup:
1. **Backend (FastAPI):** Orchestrates state changes and generates Gemini AI summaries.
2. **Dashboard (Frontend):** Real-time UI managing video playback and student interventions.
3. **Tracker (Sensor):** MediaPipe-based engine detecting Eye Aspect Ratio (EAR) for drowsiness.

## 🛠️ Setup Instructions
1. **Clone the repository.**
2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt