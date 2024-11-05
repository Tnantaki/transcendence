import asyncio
import websockets
import json
from rich import print

class GameTestClient:
    def __init__(self, token, room_id):
        self.token = token
        self.room_id = room_id
        self.ws = None
        
    async def connect(self):
        uri = f"ws://localhost:8000/ws/pong/?token={self.token}&room_id={self.room_id}"
        self.ws = await websockets.connect(uri)
        print(f"เชื่อมต่อสำเร็จด้วย token: {self.token}")
        
    async def receive_messages(self):
        while True:
            try:
                message = await self.ws.recv()
                data = json.loads(message)
                if data['command'] == 'GAME_STATE':
                    continue
                print("=======================================================================================")
                print(f"ได้รับข้อความ:")
                print(data)
            except websockets.exceptions.ConnectionClosed:
                print("การเชื่อมต่อถูกปิด")
                break
                
    async def send_move(self, key_code, action="PRESS"):
        """
        ส่งคำสั่งเคลื่อนที่
        key_code: 38=UP, 40=DOWN
        action: PRESS หรือ RELEASE
        """
        # message = {
        #     "type": "CLIENT_MESSAGE",
        #     "command": action,
        #     "data": {
        #         "key_code": key_code
        #     }
        # }
        # await self.ws.send(json.dumps(message))
        # print(f"ส่งคำสั่ง {action} key:{key_code}")
        ...

async def main():
    # ทดสอบด้วย client หลายตัว
    tokens = [
        "kNNltIZHAxlWvMGVeRxwAHLiZZv9w3h5Jgqc5H79SzWRnO78kDYSBAqdoeIPUXNe", # เปลี่ยนเป็น token จริง
        "1kCE1PvPRYQy31--PGFUBeYg11h4r56CdoeOhCQqaqFRlgApmLo12Ibm8oB0PMPz",
        # "JbCPZZvCYQJVHjYsYGGDUzQlMl1fC7HQe2vXSvqtCJorS-thXDRn2Oac0-7hs9ZP",
        # "-KpwYARQqkysU4J4A31nbt-CQrt45FPcAUO68n80BfPJz26Qky0cJjo4WhDS-Pc4",
    ]
    room_id = '397'
    
    clients = []
    for token in tokens:
        client = GameTestClient(token, room_id)
        await client.connect()
        clients.append(client)
        
    # สร้าง tasks สำหรับรับข้อความ
    receive_tasks = [
        asyncio.create_task(client.receive_messages())
        for client in clients
    ]
    
    # รอให้เชื่อมต่อเสร็จ
    await asyncio.sleep(2)
    
    # ทดสอบส่งคำสั่งเคลื่อนที่
    # await clients[0].send_move(38) # กด UP
    # await asyncio.sleep(1)
    # await clients[0].send_move(38, "RELEASE") # ปล่อย UP
    
    # await clients[1].send_move(40) # กด DOWN
    # await asyncio.sleep(1) 
    # await clients[1].send_move(40, "RELEASE") # ปล่อย DOWN
    
    # รอรับข้อความ
    await asyncio.gather(*receive_tasks)

if __name__ == "__main__":
    asyncio.run(main())