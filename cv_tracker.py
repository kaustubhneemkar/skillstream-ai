import cv2
import json
import websocket 
import time

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
ws = websocket.create_connection("ws://127.0.0.1:8000/ws")

cap = cv2.VideoCapture(0)

try:
    while True:
        ret, frame = cap.read()
        if not ret: break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        current_status = "active" if len(faces) > 0 else "bored"

        # Sending real-time data to backend
        ws.send(json.dumps({"status": current_status}))

        cv2.imshow('SkillStream Sensor', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break

finally:
    cap.release()
    cv2.destroyAllWindows()
    ws.close()