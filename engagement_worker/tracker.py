import cv2
import mediapipe as mp
import numpy as np
import websockets
import asyncio
import json

# MediaPipe Setup
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, min_detection_confidence=0.5)

# Eye Landmark Indices (MediaPipe specific)
LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
MOUTH = [13, 14, 78, 308] # Inner lips

def get_distance(p1, p2):
    return np.linalg.norm(np.array(p1) - np.array(p2))

def calculate_ear(landmarks, eye_indices):
    points = [landmarks[i] for i in eye_indices]
    # Vertical distances
    v1 = get_distance(points[1], points[5])
    v2 = get_distance(points[2], points[4])
    # Horizontal distance
    h = get_distance(points[0], points[3])
    return (v1 + v2) / (2.0 * h)

async def detect_engagement():
    uri = "ws://localhost:8000/ws"
    async with websockets.connect(uri) as websocket:
        cap = cv2.VideoCapture(0)
        while cap.isOpened():
            success, frame = cap.read()
            if not success: break
            
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_frame)
            
            if results.multi_face_landmarks:
                for face_lms in results.multi_face_landmarks:
                    # Convert landmarks to pixel coordinates
                    ih, iw, _ = frame.shape
                    coords = [(int(lm.x * iw), int(lm.y * ih)) for lm in face_lms.landmark]
                    
                    ear_left = calculate_ear(coords, LEFT_EYE)
                    ear_right = calculate_ear(coords, RIGHT_EYE)
                    avg_ear = (ear_left + ear_right) / 2.0
                    
                    # ⚠️ Threshold Logic
                    status = "active"
                    if avg_ear < 0.21: # Eyes closing
                        status = "drowsy"
                    
                    # Send signal to backend
                    await websocket.send(json.dumps({"status": status, "ear": round(avg_ear, 3)}))
            
            cv2.imshow('SkillStream AI Tracker', frame)
            if cv2.waitKey(1) & 0xFF == 27: break
        cap.release()

asyncio.run(detect_engagement())