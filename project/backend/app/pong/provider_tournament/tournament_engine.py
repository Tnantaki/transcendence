from rich import print, inspect
from channels.db import database_sync_to_async
from pong.models import Tournament
from django.contrib.auth import get_user_model
import random
from rich import print
from pong.models import Room
from pong.shared_services.database_syn_to_async.create import create
from pong.shared_services.utils.group_message import server_send_message_to_group
from channels.db import DatabaseSyncToAsync

from channels.layers import get_channel_layer

@database_sync_to_async
def get_tournament(tour_id, engine):
    tour = Tournament.objects.filter(id=tour_id)
    if tour is None:
        raise ValueError("Tour Not Found")
    return tour


class TournamentEngine:
    tournamentEngineInstance = {}

    def __new__(cls, id, *args, **kwargs):
        obj = cls.tournamentEngineInstance.get(id, None)
        if obj:
            return obj
        instance = super().__new__(cls)
        cls.tournamentEngineInstance[id] = instance
        instance.task = None
        return instance

    def __init__(self, id, tour_id, *arg, **kwarg):
        """
        """
        if hasattr(self, '_is_init'):
            return None
        # Consumer instance
        self.c_instance = {}
        self.id = id
        self.user_count = 0
        self._is_init = True
        self.owner_id = None
        # = room group name == channel name
        self.tour_id = tour_id
        # CONSTANT
        self.max_player = 4
        self.minimun_player = 3

    def __str__(self):
        return f"Tournament Engine {self.id}"

    def __repr__(self):
        return f"Tournament Engine {self.id}"

    def get_info(self):
        ATTRBUTE = [
            'id',
            'user_count',
        ]
        res = {}
        for attr in ATTRBUTE:
            res[attr] = getattr(self, attr)
        return res

    # ปิดการทำงาน
    async def register_instance(self, id, inst):
        """
        เก็บ instance ของ user ที่เข้ามาเล่น
        {
            'user_id': (instance, is_owner)
        }
        """
        old, _ = self.get_intstance(id)
        if old:
            await old.close()
        
        self.c_instance[id] = (inst, False)
        if self.owner_id is None:
            self.set_owner(id)

    async def remove_instance(self, id):
        self.c_instance.pop(id)
        if self.owner_id == id:
            self.owner_id = None

    def set_owner(self, id):
        self.owner_id = id
        self.c_instance[id] = (self.c_instance[id][0], True)

    def get_intstance(self, id):
        try:
            return self.c_instance[id]
        except:
            return (None, False)

    async def owner_active(self, obj):
        self.dumb_user(self)

    def check_owner(self, id):
        return self.owner_id == id

    @database_sync_to_async
    def user_in_tour(self, is_print=False):
        users = get_user_model().objects.filter(tournament_user__id=self.tour_id)
        res = [
            {
                "id": u.id,
                "username": u.username,
                'is_owner': u.id == self.owner_id,
                'display_name': u.display_name,
                'profile': u.profile,
            }
            for u in users
        ]
        if is_print:
            print(res)
        return res

    async def get_tournament_info(self):
        user = await self.user_in_tour()
        return {
            'id': self.id,
            'user_count': len(user),
            'user': user,
            'can_start': len(user) >= 3,
        }
            
    
    async def start_tournament(self, user_id):
        if user_id != self.owner_id:
            return "Not Owner"
        info = await self.get_tournament_info()
        
        # if self.user_count < 3:
            # return "Can't Start Tournament"
        bracket = self.create_bracket(info['user'])
        data = await create_game_for_tournament(self, bracket)

        print(data)

        # # create room for all matching
        layer = get_channel_layer()
        await layer.group_send(
            self.id,
            {
                "type": "consumer.talk",
                "code": 2000,
                "command": "START_ROUND",
                "data": data
            }
        )
    
    def create_bracket(self, user_list):
        """
        create bracket for tournament
        """
        random.shuffle(user_list)
        
        # Create Match
        bracket = []
        while len(user_list) >= 2:
            player1 = user_list.pop()
            player2 = user_list.pop()
            bracket.append({
                'player1': player1,
                'player2': player2,
                'status': 'WAITING',
                'winner': None,
            })

        if len(user_list) == 1:
            bracket.append({
                'player1': user_list[0],
                'player2': None,
                'status': 'FREE_WIN',
                'winner': user_list[0],
            })


        return bracket
            

    
"""
Tournament Data
{
    rounds: [
        {
            'round': 1,
            'match': [
                {
                    'room_id': 1,
                    'player1': {
                        'id': 1,
                        'username': 'user1',
                        'display_name': 'User 1',
                        'profile': 'profile1'
                    },
                    'player2': {
                        'id': 2,
                        'username': 'user2',
                        'display_name': 'User 2',
                        'profile': 'profile2'
                        'score': 0
                    },
                    'status': 'WAITING' | 'PLAYING' | 'FINISH' | 'PLAYER1_DISQ' | 'PLAYER2_DISQ' | 'FREE_WIN',
                    'winner': 'player1' | 'player2' | None,
                },
            ]
        }
    ]
}
"""
        



async def broadcast_info(obj, is_print=False):
    message =  await obj.tour_engine.get_tournament_info()
    if is_print:
        print(message)
    await obj.send_message(
        command='TOURNAMENT_INFOMATION',
        message=message
    )

async def startRound(obj, data, is_print=False):
    message = data
    if is_print:
        print(message)
    await obj.send_message(
        command='ROUND_START',
        message=message
    )

@DatabaseSyncToAsync
def create_game_for_tournament(obj, user_list):
    # create room for game match
    for pair in user_list:
        room = Room.objects.create(
            name=f"tourGame",
            hide=True,
            game_type="TOURNAMENT",
            tour_id=obj.tour_id,
        )
        pair['room_id'] = room.id
        pair['tour_id'] = obj.tour_id
    
    return user_list

