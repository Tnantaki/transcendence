from channels.db import database_sync_to_async
from pong.models import (
    MatchHistory
)
from rich import inspect

@database_sync_to_async
def create_history(engine, winner):
    try:
        p1 = engine.player[0]
        p2 = engine.player[1]
        dto = {
            'player_1': p1.obj,
            'player_1_score': p1.get_score() ,
            'player_2': p2.obj,
            'player_2_score': p2.get_score(),
            'winner': winner.obj
        }
        m = MatchHistory.objects.create(**dto)
        
        return m
    except Exception as e:
        print("Error ", str(e))
        raise