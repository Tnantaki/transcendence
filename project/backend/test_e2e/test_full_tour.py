import asyncio
import websockets
import json
import random
from rich import print, inspect
import requests

HOST_URL = "http://localhost:8000"

G_TASK = []

def fast_token():
    token = requests.get(
        HOST_URL + '/i/debug/fast-token'
    )
    return token.json()


def create_tournament(token):
    respone = requests.post(
        HOST_URL + '/i/game/tournament/create/',
        headers={
            'authorization': 'Bearer ' + token,
            'content-type': 'application/json',
        },
        json={
            "name": f"Test {random.randint(0, 100000)}"
        }
    )
    return respone.json()


class TestWebsocketClient:
    def __init__(self, u):
        self.token = u['token']
        self.ws_tour = None
        self.ws_game = None
        self.u = u

    async def connect_tournament(self, room_id):
        uri = f"ws://localhost:8000/ws/tournament/?token={self.token}&room_id={room_id}"
        self.ws_tour = await websockets.connect(uri)
        print(f"เชื่อมต่อกับห้องทัวร์นาเมนต์ {room_id} สำเร็จ")

    async def connect_game(self, room_id):
        uri = f"ws://localhost:8000/ws/pong/?token={self.token}&room_id={room_id}"
        self.ws_game = await websockets.connect(uri)
        print(f"{self.u['username']} เชื่อมต่อกับห้องเกม {room_id} สำเร็จ")

    async def receive_tournament_messages(self):
        while True:
            try:
                message = await self.ws_tour.recv()
                data = json.loads(message)
                match data['command']:
                    case 'ROUND_START':
                        print(
                            f"==== ข้อความจากห้องทัวร์นาเมนต์ {self.u['username']}====")
                        await self.goto_play_game(data['data'])
            except websockets.exceptions.ConnectionClosed:
                print("การเชื่อมต่อกับห้องทัวร์นาเมนต์ถูกปิด")
                break

    async def receive_game_messages(self):
        close_state = False
        while True:
            try:
                message = await self.ws_game.recv()
                data = json.loads(message)
                print(data)
                # match data['command']:
                #     case 'GAME_STATE':
                #         if not close_state:
                #             print(data['command'])
                #             close_state = True
                #     case 'COUNTDOWN':
                #         pass
                #     case 'GAME_FINISHED':
                #         print(data['command'])
                #     case _:
                #         print(data['command'])
            except websockets.exceptions.ConnectionClosed:
                print("การเชื่อมต่อกับห้องเกมถูกปิด")
                break

    async def goto_play_game(self, data):
        room_id = None
        for i in data:
            if i['player1']['id'] == self.u['id']:
                print(i)
                room_id = i['room_id']
            if i['player2']['id'] == self.u['id']:
                room_id = i['room_id']
        if room_id:
            await self.connect_game(room_id)
            G_TASK.append(asyncio.create_task(self.receive_game_messages()))

    async def send_start_tournament(self):
        message = {
            "type": "CLIENT_MESSAGE",
            "command": "START_GAME",
            "data": {}
        }
        await self.ws_tour.send(json.dumps(message))
        print("ส่งคำสั่งเริ่มทัวร์นาเมนต์")


async def main():
    # ใช้ tokens จากตัวอย่างเดิม
    tour_room_id = "9gkkspkjttt57edprmrrafjb"  # เปลี่ยนเป็น room id จริง

    tokens = fast_token()
    owner = tokens[0]
    tour = create_tournament(owner['token'])

    # สร้าง clients
    clients = []
    for u in tokens:
        client = TestWebsocketClient(u)
        await client.connect_tournament(tour['id'])
        clients.append(client)

    # # สร้าง tasks สำหรับรับข้อความ
    tour_tasks = [
        asyncio.create_task(client.receive_tournament_messages())
        for client in clients
    ]

    # รอให้เชื่อมต่อเสร็จ
    await asyncio.sleep(2)

    # ส่งคำสั่งเริ่มเกมจาก owner (client แรก)
    await clients[0].send_start_tournament()

    await asyncio.sleep(6)

    # # เมื่อได้รับข้อมูลห้องเกม ให้เชื่อมต่อกับห้องเกม
    # await asyncio.sleep(2)

    # # รอรับข้อความจนกว่าจะปิดการเชื่อมต่อ
    await asyncio.gather(*G_TASK)
    # await asyncio.gather(*tour_tasks)

if __name__ == "__main__":
    asyncio.run(main())
