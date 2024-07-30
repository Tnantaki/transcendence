from ninja import Router, Schema
from .game_consumer import GameConsumer
from .models import Room

pong_router = Router()

class RoomName(Schema):
    name: str
    number_of_player: int

@pong_router.get(
    "/pong/room/",
    response={
        200: list[RoomName]
    }
)
def get_all_room(request):
    print("get_all_room")
    qs = Room.objects.all()
    print(qs)
    
    return 200, Room.objects.all()