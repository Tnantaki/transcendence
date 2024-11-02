import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rich import inspect, print
from pong.models import Tournament
from appuac.models.authsession import AuthSession
from channels.db import database_sync_to_async
from pong.provider_tournament.service.connect import tour_connect, tournament_consumer_info
from pong.provider_tournament.service.disconnect import tour_disconnect
from pong.provider_tournament.event_handler import tournament_event_handler
from pong.provider_tournament.tournament_engine import TournamentEngine
from pong.provider_tournament.user_message_handler import user_tournament_event_handler
from pong.provider_tournament.error_message_generator import error_message_generator
from pong.shared_services.server_message_generator import server_message_generator

# Consider as controller /ws/tournament
class TournamentLobbyConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def connect(self):
        self.tour_engine: TournamentEngine = {}
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
        try:
            await user_tournament_event_handler(self, text_data)
            # await user_tournament_event_handler(self, text_data)
        except Exception as e:
            await self.send_message(
                command='ERROR',
                message=error_message_generator(
                    error=str(e)
                )
            )
            return 

    async def send_message(self, command,  message):
        data = server_message_generator(command, message)
        await self.send(text_data=data)

    async def tour_boradcast(self, event):
        """
        message ใน group ทั้งหมด จะถูกส่งไปที่ client ทุกตัว ใน group
        """
        print("TOUR_BROADCAST")
        if hasattr(event, "type"):
            event.pop('type')
        await self.send(text_data=json.dumps(event))

    async def consumer_talk(self, event):
        """
        สำหรับ handle event ระหว่าง consumer กับ consumer
        """
        try:
            await tournament_event_handler(self, event)
        except Exception as e:
            print(e)