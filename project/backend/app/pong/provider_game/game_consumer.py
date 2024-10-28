# game/consumers.py
import json
import asyncio

from channels.generic.websocket import AsyncWebsocketConsumer
from pong.models import Room
from appuac.models.authsession import AuthSession
from channels.db import database_sync_to_async
from pong.provider_game.game_engine import GameEngine


# GET TOKEN FROM SCOPE
def get_token_from_scope(scope_headers):
    if b"authorization" in scope_headers:
        token = scope_headers[b"authorization"]
        token_text = token.decode()
        return token_text
    return None


# Server Message
"""
JSON Format for Server Message

Command
{
    "code": 2xxx, 4xxx
    "message": "COMMAND",
    "sender": "SERVER",
    "data": {}
}

# ERROR 
{
    "code": 4xxx,
    "reason": "Token is invalid"
}

# Client Message interface
{
    "type": "CLIENT_MESSAGE",
    "command": "COMMAND",
    "sender": "Should be player token",
    "data": {}
}

# Data that server keep for the room
{
    "id": "ROOM ID",
    "size": 2,
    "number_of_player": 2,
    "users": ["USER 1", "USER 2"],
    "type": "VERSUS" | "TORNAMENT"
}

"""


class GameRoome:
    player_1: str = None
    player_2: str = None
    room_token: str = None


class GameConsumer(AsyncWebsocketConsumer):
    # ยังไม่ได้คิดเรื่อง Anonnymous User

    # Header map when user create connection
    header_map = {}
    exit_code = {"code": 2000, "reason": "OK"}
    room_id = None
    room = None
    player_number = 0
    room_group_name = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def connect(self):
        print("GAME - CONNECT")
        self.room_name = ""
        self.is_join = None

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
        try:
            room_id = int(room_id)
            if not room_id:
                await self.set_exit_code(4002, f"Room ID is required: {room_id}")
                return
        except ValueError:
            await self.set_exit_code(4002, f"Room ID is invalid: {room_id}")
            return

        # Query room from database
        self.room = await self.query_room(room_id)
        if not self.room:
            await self.set_exit_code(4003, f"Room is not exist: {room_id}")
            return
        self.room_group_name = f"Game_Group_{room_id}"
        self.game_engine = GameEngine(self.room_group_name)

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
        self.user = user

        # Add user to room
        # Check room is not full
        self.room_id = room_id
        self.token = token
        # Reconnection process mebey

        if await self.check_is_user_already_join(self.room, user):
            await self.set_exit_code(4005, "User is already join")
            return

        await self.user_join_room(self.room, user)
        self.game_engine.add_user(self.token)
        self.game_engine.set_player(self.token, self.player_number)

        # User Join Room
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.send(
            {"text_data": json.dumps({"code": 2000, "message": "Connected"})}
        )
        if self.room.number_of_player == 2:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game.assign",
                    "command": "ASSIGN_PLAYER",
                    "sender": "SERVER",
                },
            )
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game.assign",
                    "command": "GAME_START",
                    "sender": "SERVER",
                },
            )
            for i in range(4):
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "game_countdown",
                        "command": f"COUNTDOWN={i}",
                        "sender": "SERVER",
                    },
                )
            if not self.game_engine.running:
                await self.game_engine.check()
                loop = asyncio.get_event_loop()
                self.game_engine.run(loop)

    @database_sync_to_async
    def check_is_user_already_join(self, room, user):
        return user in room.users.all()

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
            self.room.users.remove(self.user)
            self.room.save()
        return None

    async def disconnect(self, close_code):
        # Leave room group
        print("Exit worker", self.exit_code)
        print("is join when disconnect ", self.is_join)

        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )
        if self.is_join:
            await self.leave_room()
        if hasattr(self, "game_engine"):
            self.game_engine.stop()

    # Receive message from WebSocket
    async def receive(self, text_data):
        message = json.loads(text_data)
        d = message["data"]
        if message["type"] == "CLIENT_MESSAGE":
            self.game_engine.handle_message(message)

    async def game_countdown(self, event):
        """
        Send Message Count down form Server
        """
        t = int(event["command"].split("=")[1])
        await asyncio.sleep(t)
        await self.send(
            text_data=json.dumps(
                {
                    "code": 2000,
                    "command": "COUNTDOWN",
                    "data": {"time": 3 - t},
                    "sender": "SERVER",
                }
            )
        )

    async def client_message(self, event):
        data = event["data"]

        await self.send(
            text_data=json.dumps({"code": 2000, "sender": "PLAYER", **event["data"]})
        )

    async def game_control(self, event):
        """
        this function will send message to client
        when call type: game.control
        """
        command = event["command"]
        player = event["player"]
        full_message = event["full_message"]

        # Send message to WebSocket
        WB_HELPER.server_send_message(
            self, code=2000, command=command, sender=player, data=full_message
        )
        await self.send(
            text_data=json.dumps(
                {
                    "code": 2000,
                    "sender": player,
                    "command": command,
                    "full_message": full_message,
                }
            )
        )

    async def game_assign(self, event):
        message = event["command"]

        # Send message to WebSocket
        await self.send(
            text_data=json.dumps(
                {
                    "code": 2000,
                    "command": message,
                    "sender": "SERVER",
                    "data": {
                        "player": self.player_number,
                    },
                }
            )
        )

    async def game_state(self, state):
        await self.send(
            text_data=json.dumps(
                {
                    "code": 2000,
                    "command": "GAME_STATE",
                    "sender": "SERVER",
                    "data": state["game_state"],
                }
            )
        )

    async def set_exit_code(self, code, reason):
        self.exit_code = {"code": code, "reason": reason}
        await self.send(text_data=json.dumps(self.exit_code))
        await self.close()

    async def game_score(self, event):
        message = event["command"]
        await self.send(
            text_data=json.dumps(
                {
                    "code": 2000,
                    "command": message,
                    "sender": "SERVER",
                    "data": event["data"],
                }
            )
        )
