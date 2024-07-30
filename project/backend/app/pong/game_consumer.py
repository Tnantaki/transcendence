# game/consumers.py
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rich import inspect, print
from .models import Room
from appuac.models.user import User
from appuac.models.authsession import AuthSession
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from asyncio import run

class GameConsumer(AsyncWebsocketConsumer):
    
    # Header map when user create connection
    header_map = {}
    
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"Game_{self.room_name}"
        # print(self.scope["headers"])

        for i in self.scope["headers"]:
            self.header_map[i[0].decode()] = i[1].decode()
        
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()
        # user = await self.check_session()
        
        # room, is_create = await self.create_room(self.room_name)

    @database_sync_to_async
    def create_room(self, room_name):
        data, is_create = Room.objects.get_or_create(name=room_name)
        data.add_player(self.scope["user"])
        return data, is_create
    
    @database_sync_to_async
    def check_session(self):
        session = AuthSession.objects.get(id=self.header_map["authorization"])
        user = session.user
        return user
    
    @database_sync_to_async
    def leave_room(self, room_name):
        room = Room.objects.get(name=room_name)
        room.number_of_player -= 1
        room.save()
        inspect(room)
        if room.number_of_player == 0:
            room.delete()
        return None

    async def disconnect(self, close_code):
        # Leave room group
        print("DISCONNECT CALL")
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        # await self.leave_room(self.room_name)

    # Receive message from WebSocket
    async def receive(self, text_data):

        await self.channel_layer.group_send(
            self.room_group_name, {"type": "game.message", "message": text_data}
        )

    # Receive message from room group
    async def game_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))