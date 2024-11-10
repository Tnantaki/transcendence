import asyncio
import websockets
import json
import random
from rich import print

class TournamentWebsocketClient:
    def __init__(self, token, room_id):
        self.token = token
        self.room_id = room_id
        self.ws = None
        
    async def connect(self):
        uri = f"ws://localhost:8000/ws/tournament/?token={self.token}&room_id={self.room_id}"
        print(uri)
        self.ws = await websockets.connect(uri)
        print(f"Connected to tournament room {self.room_id}")
        
    async def receive_messages(self):
        while True:
            try:
                message = await self.ws.recv()
                data = json.loads(message)
                print("=======================================================================================")
                print(f"Received:")
                print(data)
            except websockets.exceptions.ConnectionClosed:
                print("Connection closed")
                break
                
    async def send_start_game(self):
        message = {
            "type": "CLIENT_MESSAGE",
            "command": "START_GAME",
            "data": {}
        }
        await self.ws.send(json.dumps(message))
        print("Sent start game command")

async def main():
    # สร้าง clients หลายตัวเพื่อทดสอบ
    tokens = [
        "kNNltIZHAxlWvMGVeRxwAHLiZZv9w3h5Jgqc5H79SzWRnO78kDYSBAqdoeIPUXNe", # เปลี่ยนเป็น token จริง
        "1kCE1PvPRYQy31--PGFUBeYg11h4r56CdoeOhCQqaqFRlgApmLo12Ibm8oB0PMPz",
        "JbCPZZvCYQJVHjYsYGGDUzQlMl1fC7HQe2vXSvqtCJorS-thXDRn2Oac0-7hs9ZP",
        "-KpwYARQqkysU4J4A31nbt-CQrt45FPcAUO68n80BfPJz26Qky0cJjo4WhDS-Pc4",
    ]
    room_id = "9gkkspkjttt57edprmrrafjb" # เปลี่ยนเป็น room id จริง
    
    clients = []
    for token in tokens:
        client = TournamentWebsocketClient(token, room_id)
        await client.connect()
        clients.append(client)
        
    # สร้าง tasks สำหรับรับข้อความของแต่ละ client
    receive_tasks = [
        asyncio.create_task(client.receive_messages())
        for client in clients
    ]
    
    # รอสักครู่ให้ clients เชื่อมต่อ
    await asyncio.sleep(2)
    
    # ทดสอบส่งคำสั่ง start game จาก owner (client แรก)
    await clients[0].send_start_game()
    
    # รอรับข้อความ
    await asyncio.gather(*receive_tasks)

if __name__ == "__main__":
    asyncio.run(main())