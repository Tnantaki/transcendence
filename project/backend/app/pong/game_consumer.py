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
from django.utils import timezone
from datetime import timedelta


# GET TOKEN FROM SCOPE
def get_token_from_scope(scope_headers):
    if b"authorization" in scope_headers:
        token = scope_headers[b"authorization"]
        token_text = token.decode()
        return token_text
    return None


class GameConsumer(AsyncWebsocketConsumer):
    # ยังไม่ได้คิดเรื่อง Anonnymous User

    # Header map when user create connection
    header_map = {}
    exit_code = None
    room_id = None
    room = None
    player_number = 0
    room_group_name = None
    is_join = False

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def connect(self):
        self.room_name = ""

        # Accept connection
        # if error send message to client and close connection
        await self.accept()

        # Convert query string to dict
        self.query_param = {
            k: v
            for (k, v) in [
                i.split("=") for i in self.scope["query_string"].decode().split("&")
            ]
        }

        # Check room is exist
        room_id = self.query_param.get("room_id", None)
        if not room_id:
            await self.set_exit_code(4002, "Room ID is required")
            return

        # Query room from database
        self.room = await self.query_room(room_id)
        if not self.room:
            await self.set_exit_code(4003, "Room is not exist")
            return
        self.room_group_name = f"Game_{self.room_name}"

        # Check token in query string
        token = self.query_param.get("token", None)
        if token is None:
            await self.set_exit_code(4001, "Token is required")
            return
        # Check Token exist and not expired then get user
        user = await self.auth_user(token)
        if user is None:
            await self.set_exit_code(4000, "Token is invalid")
            return

        # Add user to room
        # Check room is not full
        if self.room.number_of_player >= self.room.size:
            await self.set_exit_code(4004, "Room is full")
            return

        self.room_id = room_id
        self.token = token

        await self.user_join_room(self.room, user)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.send(text_data=json.dumps({"message": "CONNECTED"}))
        if self.room.number_of_player == self.room.size:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game.assign",
                    "command": "START",
                    "sender": "SERVER",
                },
            )
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game.assign",
                    "command": "ASSIGN_PLAYER",
                    "sender": "SERVER",
                },
            )

    @database_sync_to_async
    def query_room(self, room_id):
        room = Room.objects.filter(id=room_id).first()
        return room

    @database_sync_to_async
    def user_join_room(self, room, user):
        room.number_of_player += 1
        room.save()
        room.users.add(user)
        self.player_number = room.number_of_player
        self.is_join = True
        return room

    @database_sync_to_async
    def auth_user(self, token):
        session = AuthSession.objects.filter(id=token).first()
        if session is None:
            return None
        if session.is_expired:
            return None
        # TODO change again later
        session.mem = True
        session.save()
        user = session.user
        return user

    @database_sync_to_async
    def leave_room(self):
        if self.room:
            self.room.number_of_player -= 1
            self.room.save()
            if self.room.number_of_player == 0:
                self.room.delete()
        return None

    async def disconnect(self, close_code):
        # Leave room group
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )
        if self.is_join:
            await self.leave_room()

    # Receive message from WebSocket
    async def receive(self, text_data):
        # {
        #     "type": "game-control",
        #     "player": 1,
        #     "command": "up"
        # }
        message = json.loads(text_data)

        if message["type"] == "game-control":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    # Handle for message type game.control at function name game_control
                    "type": "game.control",
                    "command": message["command"],
                    "player": message["player"],
                },
            )

    # Receive message from room group
    # Handle for message type game.control WTF
    async def game_control(self, event):
        message = event["command"]
        player = event["player"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"command": message, "sender": player, }))

    async def game_assign(self, event):
        message = event["command"]

        # Send message to WebSocket
        await self.send(
            text_data=json.dumps(
                {"command": message, "player": self.player_number, })
        )

    async def set_exit_code(self, code, reason):
        self.exit_code = {"code": code, "reason": reason}
        await self.send(text_data=json.dumps(self.exit_code))
        await self.close()
