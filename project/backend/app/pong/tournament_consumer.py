import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rich import inspect, print
from .models import Tournament
from appuac.models.authsession import AuthSession
from channels.db import database_sync_to_async

class TournamentRoomConsumer(AsyncWebsocketConsumer):
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    
    async def connect(self):
        
        # 
        await self.accept()
        
        
        print(self.scope)
        self.param_tocheck = ["room_id", "token"]
        self.query_param = {
            k: v
            for (k, v) in [
                i.split("=") for i in self.scope["query_string"].decode().split("&")
            ]
        }
        # TODO
        # Check if query string has all required parameter
        # for param in self.param_tocheck:
        #     if param not in self.query_param:
        #         await self.close()
        #         return
        
        # check tour id 
        print(self.query_param)
        self.tour_id = self.query_param.get("room_id", None)
        # TODO
        await self.query_tour(self.tour_id)
        # TODO
        # if not self.tour:
        #     await self.close()
        #     return
        self.tour_group = self.tour.name
        print(self.tour_group)
        
        token = self.query_param.get("token", None)
        self.user = await  self.auth_user(token)
        # TODO check user is in tournament
        
        # Add user to Tournament group
        await self.user_join_tour(self.tour, self.user)
        
        # TODO notify user joined tournament
        
        # TODO set user to tournament group
        
        
        
        self.channel_layer.group_add("tournament", self.channel_name)

    @database_sync_to_async
    def query_tour(self, id):
        self.tour = Tournament.objects.filter(id=id).first()
        return self.tour

    @database_sync_to_async
    def auth_user(self, token):
        session = AuthSession.objects.filter(id=token).first()
        if session is None:
            return None
        if session.is_expired:
            return None
        session.mem = True
        session.save()
        user = session.user
        return user
    
    @database_sync_to_async
    def user_join_tour(self, tour, user):
        tour.users.add(user)
        tour.save()
        return tour
    
    @database_sync_to_async
    def user_leave_tour(self, tour, user):
        tour.users.remove(user)
        tour.save()
        return tour
        
    async def disconnect(self, close_code):
        ...

    async def receive(self, text_data):
        print("TOURNAMENT - RECEIVE")
        print(json.loads(text_data))
    
    async def send_message(self, message):
        ...
    
    