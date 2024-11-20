from channels.db import database_sync_to_async
from pong.models import (
    MatchHistory,
    Room,
    Tournament,
    TourRound,
)
from rich import inspect


@database_sync_to_async
def create_history(engine, winner):
    room = Room.objects.filter(id=engine.room_id).first()
    if not room:
        return None
    
    try:
        p1 = engine.player[0]
        p2 = engine.player[1]
        dto = {
            'player_1': p1.obj,
            'player_1_score': p1.get_score(),
            'player_2': p2.obj,
            'player_2_score': p2.get_score(),
            'winner': winner.obj,
            'status': "FINISH",
        }
        if room.game_type == 'TOURNAMENT':
            tour = Tournament.objects.get(id=room.tour_id)
            if tour.status == 'PLAYING-R1':
                tour_round = tour.tourround_set.filter(tround=1).first()
                dto['mtype'] = 'TR1'
            if tour.status == 'PLAYING-R2':
                tour_round = tour.tourround_set.filter(tround=2).first()
                dto['mtype'] = 'TR2'
                tour.winner = winner.obj
                tour.status = 'FINISH'
                tour.save()
            m = MatchHistory.objects.create(**dto)
            tour_round.matches.add(m)
            room.delete()
        else:
            m = MatchHistory.objects.create(**dto)
            room.delete()
        return m
    except Exception as e:
        print("Error ", str(e))
        raise
