from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from ai_services.summarizer import get_ai_intervention
import json

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections = []
    async def connect(self, ws):
        await ws.accept()
        self.active_connections.append(ws)
    def disconnect(self, ws):
        self.active_connections.remove(ws)
    async def broadcast(self, msg):
        for c in self.active_connections:
            try: await c.send_text(msg)
            except: pass

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            status = msg.get("status", "active")
            
            # Using stable ID: z6hX_2_59kI
            summary = await get_ai_intervention("z6hX_2_59kI") if status == "bored" else None
            
            await manager.broadcast(json.dumps({"status": status, "summary": summary}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)