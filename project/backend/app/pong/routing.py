from ninja import Router, Schema
from .game_consumer import GameConsumer
from .models import Room
from appuac.service.auth import BearerTokenAuth

pong_router = Router()

class RoomName(Schema):
    id: int
    name: str
    number_of_player: int

class RoomPostIn(Schema):
    name: str

@pong_router.get(
    "/pong/room/",
    response={
        200: list[RoomName]
    }
)
def get_all_room(request):
    qs = Room.objects.all()
    return 200, Room.objects.all()

@pong_router.post(
    "/pong/room/",
    response={
        201: RoomName
    },
    auth=BearerTokenAuth()
)
def post_create_room(request, payload: RoomPostIn):
    room = Room.objects.create(name=payload.name)
    return 201, room

@pong_router.post(
    "/pong/room/{room_id}/join/",
    response={
        200: RoomName
    },
    auth=BearerTokenAuth()
)
def post_join_room(request, room_id: int):
    room = Room.objects.get(id=room_id)
    room.add_player(request.user)
    return 200, room
