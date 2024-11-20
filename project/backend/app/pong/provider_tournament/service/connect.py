import json

from channels.db import database_sync_to_async
from appuac.models.authsession import AuthSession
from pong.models import Tournament
from rich import print, inspect
from pong.shared_services.utils.group_message import server_send_message_to_group
from pong.provider_tournament.tournament_engine import TournamentEngine

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
    obj.user_id = session.user.id
    session.in_game = True
    session.save()
    obj.instance_id = session.user.id
    obj.room_group_name = f"Tournament_GROUP_{obj.room_id}"

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
    
    # check query param
    missing_params = set(obj.param_tocheck) - query_param.keys()
    if missing_params:
        raise ValueError(f"Missing Query Param {', '.join(missing_params)}")
    
    for k, v in query_param.items():
        if k in obj.param_tocheck:
            setattr(obj, k, v)
    return obj


async def create_or_channel_to_group(obj):
    
    await obj.channel_layer.group_add(
        obj.room_group_name,
        obj.channel_name
    )

    return obj


async def message_user_join(obj):
    await server_send_message_to_group(
        obj,
        command="BROADCAST_INFO",
        message_type='consumer.talk',
    )

async def s2s_message(obj, command):
    await server_send_message_to_group(
        obj,
        command=command,
        type='consumer.talk',
        data={},
    )

async def tour_connect(obj):

    create_query_param(obj)
    await find_tour_and_user(obj)
    await tournament_init_engine(obj)
    await create_or_channel_to_group(obj)
    await message_user_join(obj)
    obj.is_init = True
    

def tournament_consumer_info(obj, is_print=False):
    attribute_list = [
        'room_id',
        'is_owner',
        'is_init',
        'room_id',
        'room_group_name',
        'channel_name',
        'user_count',
        'tour_engine',
        'user_id'
    ]
    # inspect(obj)
    res = {}
    for k in attribute_list:
        try:
            res[k] = getattr(obj, k)
        except:
            res[k] = None

    if is_print or True:
        print(res)

    return res
    
async def tournament_init_engine(obj):
    obj.tour_engine = TournamentEngine(obj.room_group_name, obj.tour.id)
    await obj.tour_engine.register_instance(obj.user_id, obj)
    return obj