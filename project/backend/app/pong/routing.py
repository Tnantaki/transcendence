from ninja import Router, Schema, ModelSchema, Field

from appuac.models import User
from pong.models import (Room, MatchHistory, UserGameInfo, Tournament)
from appuac.service.auth import BearerTokenAuth
from django.db.models import Q
from django.contrib.auth import get_user_model
from rich import print, inspect
import random
from app.settings import DEBUG

pong_router = Router()

class UserSchema(Schema):
    id: str
    username: str

class RoomName(Schema):
    id: int
    name: str
    number_of_player: int
    users: list[UserSchema]
    game_type: str
    
    @staticmethod
    def resolve_users(obj):
        return obj.users.all()

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

class MatchHistoryOut(ModelSchema):
    
    class Meta:
        model = MatchHistory
        fields = [
            'player_1',
            'player_1_score',
            'player_2',
            'player_2_score',
            'created',
        ]


@pong_router.get(
    "/me/match-history/",
    response={
        200: list[MatchHistoryOut],
    },
    auth=BearerTokenAuth()
)
def get_me_history(request):
    user = request.auth.user
    player_1 = Q(player_1=user)
    player_2 = Q(player_2=user)
    matches = MatchHistory.objects.filter(player_1 | player_2)
    return 200, matches

class UserSchema(ModelSchema):
    is_online: bool = Field(default=False)
    display_name: str = Field(default="")
    wins: int = Field(default=0)
    losses: int = Field(default=0)
    tour_won: int = Field(default=0)
    tour_play: int = Field(default=0)

    class Meta:
        model = User
        fields = [
            "username",
            "display_name",
            "id",
            "bio",
            "profile",
            "email",
        ]
    
    @staticmethod
    def resolve_display_name(obj):
        if obj.display_name == "":
            return obj.username
        return obj.display_name

class LeaderBoardSchema(Schema):
    id: int
    user: UserSchema
    win: int
    lose: int
    total_score: int
    
@pong_router.get(
    "/debug/gen-a-leaderboard/",
    response={
        200: dict
    },
    tags=["Debug"]
)
def test_get_leaderboard(request):
    """
    For testing purpose only
    """
    if DEBUG == False:
        return 400, {"error": "This endpoint is only available in DEBUG mode"}

    user_model = get_user_model().objects.all().order_by("?")[0]
    info, is_create = UserGameInfo.objects.get_or_create(user=user_model)
    info.win += random.randint(0, 10)
    info.lose += random.randint(0, 10)
    info.total_score += random.randint(0, 100)
    info.save()
    
    return 200, {"test": "SUCCESS"}


@pong_router.get(
    "/leaderboard/",
    response={
        200: list[LeaderBoardSchema]
    },
)
def get_leaderboard(request):
    leaderboad = UserGameInfo.objects.all().order_by("-win", "lose", "-total_score")
    return 200, leaderboad


class TournamentOut(Schema):
    id: str
    name: str
    users: list[UserSchema]
    size: int
    owner: UserSchema | None = None
    winner: UserSchema | None = None
    status: str


class TournamentBaseIn(Schema):
    name: str | None = None

@pong_router.post(
    '/tournament/create/',
    response={
        201: TournamentOut
    },
    auth=BearerTokenAuth()
)
def post_create_tournament(request, payload: TournamentBaseIn):
    """
    Create tournament
    """
    d_payload = payload.dict()
    if d_payload.get("name", None) is None:
        d_payload["name"] = f"Tournament {random.randint(0, 1000)}"
    tournament = Tournament.objects.create(
        name=d_payload["name"],
        owner=request.auth.user,
    )
    return 201, tournament

@pong_router.get(
    '/tournament/',
    response={
        200: list[TournamentOut]
    },
    auth=BearerTokenAuth()
)
def get_tornament(request):
    """
    Get all tournament
    """
    res = Tournament.objects.all().prefetch_related("users", "owner")
    return 200, res
