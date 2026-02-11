from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
import uvicorn
from ai_services.summarizer import generate_intervention_summary

app = FastAPI()

# Add CORS middleware to ensure browser access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    # If you see this in Terminal, the browser IS connected
    print("🚀 BROWSER TOTALLY CONNECTED") 
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            status = message.get("status")
            print(f"📡 Received Signal: {status}")

            if status == "bored":
                message["summary"] = generate_intervention_summary("Dijkstra's Algorithm")
                print("✅ Summary generated.")
            
            # Send the JSON back to the browser
            await websocket.send_text(json.dumps(message))
            
    except Exception as e:
        print(f"📡 WebSocket Status: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)