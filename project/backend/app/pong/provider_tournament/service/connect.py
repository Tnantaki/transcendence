import json

from channels.db import database_sync_to_async
from appuac.models.authsession import AuthSession
from pong.models import Tournament
from rich import print, inspect
from pong.shared_services.utils.group_message import server_send_message_to_group


@database_sync_to_async
def find_tour_and_user(obj):

    if not hasattr(obj, "room_id"):
        raise ValueError("room id not set")
    if not hasattr(obj, "token"):
        raise ValueError("Obj Token Not set")

    tour = Tournament.objects.filter(id=obj.room_id).first()
    if tour is None:
        raise ValueError("Tour Not Found")

    session = AuthSession.objects.filter(id=obj.token).first()
    if session is None:
        raise ValueError("Token Nont exist")

    if session.is_expired:
        raise ValueError("Session Exprired")
    
    obj.is_owner = tour.owner == session.user
    obj.user = session.user
    obj.tour = tour
    session.in_game = True
    session.save()

    # add relation
    tour.users.add(obj.user)

    return obj


def create_query_param(obj):
    obj.param_tocheck = ["room_id", "token"]
    if not hasattr(obj, "scope"):
        return None

    query_param = {
        k: v
        for (k, v) in [
            i.split("=") for i in obj.scope["query_string"].decode().split("&")
        ]
    }
    for k, v in query_param.items():
        if k in obj.param_tocheck:
            setattr(obj, k, v)
    return obj


async def create_or_channel_to_group(obj):
    obj.room_group_name = f"Tournament_GROUP_{obj.room_id}"
    await obj.channel_layer.group_add(
        obj.room_group_name,
        obj.channel_name
    )
    print(f"---LOG--- add group {obj.room_group_name} to channel {obj.channel_name}")

    return obj


async def message_user_join(obj):
    user_info = {
        "id": obj.user.id,
        "username": obj.user.username,
        "display_name": obj.user.display_name,
        "profile": obj.user.profile,
    }
    await server_send_message_to_group(
        obj,
        command="USER_CONNECTED",
        data={"user": user_info},
    )


async def tour_connect(obj):
    print("Call Service create connection")

    create_query_param(obj)
    await find_tour_and_user(obj)
    await create_or_channel_to_group(obj)
    await message_user_join(obj)
