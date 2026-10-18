import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pynput.mouse import Button, Controller as MouseController
from pynput.keyboard import Controller as KeyboardController, Key

app = FastAPI()
mouse = MouseController()
keyboard = KeyboardController()

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

            # --- FITUR KEYBOARD ---
            elif action_type == "type_text":
                text = payload.get("text", "")
                keyboard.type(text)

            elif action_type == "press_key":
                key_name = payload.get("key")
                if key_name == "enter":
                    keyboard.press(Key.enter)
                    keyboard.release(Key.enter)
                elif key_name == "backspace":
                    keyboard.press(Key.backspace)
                    keyboard.release(Key.backspace)

    except WebSocketDisconnect:
        print("HP terputus!")