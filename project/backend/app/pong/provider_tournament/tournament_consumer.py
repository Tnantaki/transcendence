import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rich import inspect, print
from ..models import Tournament
from appuac.models.authsession import AuthSession
from channels.db import database_sync_to_async
from pong.provider_tournament.service.connect import tour_connect
from pong.provider_tournament.service.disconnect import tour_disconnect


# Consider as controller /ws/tournament
class TournamentLobbyConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def connect(self):
        try:
            await tour_connect(self)
        except Exception as e:
            print(e)
            await self.close()
        await self.accept()

    async def disconnect(self, close_code):
        # Call When Affter close แล้ว
        await tour_disconnect(self)

    async def receive(self, text_data):
        print(json.loads(text_data))

    async def send_message(self, message):
        ...

    async def tour_boradcast(self, event):
        """
        message ใน group ทั้งหมด จะถูกส่งไปที่ client ทุกตัว ใน group
        """
        if hasattr(event, "type"):
            event.pop('type')
        await self.send(text_data=json.dumps(event))

    async def consumer_talk(self, event):
        """
        สำหรับ handle event ระหว่าง consumer กับ consumer
        """
        ...

    async def tournament_close(self, event):
        # Clear Tournament Data
        if hasattr(event, "type"):
            event.pop('type')
        await self.send(text_data=json.dumps(event))
        self.close()
