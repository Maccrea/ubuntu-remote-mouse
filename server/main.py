import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pynput.mouse import Button, Controller

app = FastAPI()
mouse = Controller()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("HP berhasil terhubung!")
    
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            action_type = payload.get("type")

            if action_type == "move":
                dx = payload.get("dx", 0)
                dy = payload.get("dy", 0)
                mouse.move(dx, dy)

            elif action_type == "click":
                btn = payload.get("button", "left")
                target_btn = Button.left if btn == "left" else Button.right
                mouse.click(target_btn)

            elif action_type == "scroll":
                dy = payload.get("dy", 0)
                mouse.scroll(0, dy)

    except WebSocketDisconnect:
        print("HP terputus!")