import cv2
import asyncio
import websockets
import json
import time

# Direct access to the compiled modules
try:
    import mediapipe.python.solutions.face_mesh as mp_face_mesh
    import mediapipe.python.solutions.drawing_utils as mp_drawing
except ImportError:
    # If that fails, try the flat structure
    from mediapipe.tasks.python import vision
    # Emergency fallback for demo
    import mediapipe as mp
    mp_face_mesh = mp.solutions.face_meshLEFT_EYE = [362, 385, 387, 263, 373, 380]

RIGHT_EYE = [33, 160, 158, 133, 153, 144]

def get_aspect_ratio(landmarks, eye_points):
    """Calculates Eye Aspect Ratio (EAR) for drowsiness detection."""
    # Simplified vertical/horizontal distance calculation
    p2_p6 = abs(landmarks[eye_points[1]].y - landmarks[eye_points[5]].y)
    p3_p5 = abs(landmarks[eye_points[2]].y - landmarks[eye_points[4]].y)
    p1_p4 = abs(landmarks[eye_points[0]].x - landmarks[eye_points[3]].x)
    return (p2_p6 + p3_p5) / (2.0 * p1_p4)

async def start_tracking():
    uri = "ws://127.0.0.1:8000/ws"
    
    # Wait for camera and backend connection
    print("📡 Attempting to connect to SkillStream Backend...")
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Camera Tracker Online & Connected!")
            
            cap = cv2.VideoCapture(0)
            with mp_face_mesh.FaceMesh(refine_landmarks=True) as face_mesh:
                
                while cap.isOpened():
                    success, frame = cap.read()
                    if not success: continue

                    # Process the frame
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = face_mesh.process(rgb_frame)
                    
                    status = "active" # Default state

                    if results.multi_face_landmarks:
                        landmarks = results.multi_face_landmarks[0].landmark
                        
                        # Calculate EAR for both eyes
                        left_ear = get_aspect_ratio(landmarks, LEFT_EYE)
                        right_ear = get_aspect_ratio(landmarks, RIGHT_EYE)
                        avg_ear = (left_ear + right_ear) / 2.0

                        # Drowsiness detection: Threshold < 0.2
                        if avg_ear < 0.2:
                            status = "drowsy"
                        # Boredom detection: Can be set based on gaze or MAR
                        elif avg_ear > 0.4: 
                            status = "active" 
                    else:
                        # No face detected = Bored/Away
                        status = "bored"

                    # Send the signal to the dashboard
                    await websocket.send(json.dumps({"status": status}))
                    
                    # Optional: Visual feedback window
                    cv2.putText(frame, f"STATUS: {status}", (50, 50), 
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    cv2.imshow('SkillStream AI - Engine', frame)

                    if cv2.waitKey(5) & 0xFF == 27: # Press Esc to quit
                        break

            cap.release()
            cv2.destroyAllWindows()
            
    except Exception as e:
        print(f"❌ Connection Failed: {e}. Is Terminal 1 (Backend) running?")

if __name__ == "__main__":
    asyncio.run(start_tracking())