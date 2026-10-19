import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pynput.mouse import Button, Controller as MouseController
from pynput.keyboard import Controller as KeyboardController, Key

app = FastAPI()
mouse = MouseController()
keyboard = KeyboardController()

KEY_MAPPING = {
    "esc": Key.esc, "tab": Key.tab, "enter": Key.enter, "backspace": Key.backspace,
    "space": Key.space, "shift": Key.shift, "ctrl": Key.ctrl, "alt": Key.alt,
    "win": Key.cmd, "up": Key.up, "down": Key.down, "left": Key.left,
    "right": Key.right, "home": Key.home, "end": Key.end, "pgup": Key.page_up,
    "pgdn": Key.page_down, "ins": Key.insert
}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("✅ HP Terhubung!")
    
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            action_type = payload.get("type")

            if action_type == "move":
                mouse.move(payload.get("dx", 0), payload.get("dy", 0))
            elif action_type == "click":
                btn = Button.left if payload.get("button", "left") == "left" else Button.right
                mouse.click(btn)
                
            elif action_type == "key_down":
                raw_key = payload.get("key", "").lower()
                target_key = KEY_MAPPING.get(raw_key, raw_key)
                print(f"👇 HOLD: {raw_key}")
                keyboard.press(target_key)
                
            elif action_type == "key_up":
                raw_key = payload.get("key", "").lower()
                target_key = KEY_MAPPING.get(raw_key, raw_key)
                print(f"☝️ RELEASE: {raw_key}")
                keyboard.release(target_key)
                
    except WebSocketDisconnect:
        print("❌ HP Terputus!")