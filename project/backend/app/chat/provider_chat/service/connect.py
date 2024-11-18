import json

from channels.db import database_sync_to_async
from appuac.models.authsession import AuthSession
from pong.models import Tournament
from rich import print, inspect
from pong.shared_services.utils.group_message import server_send_message_to_group
from pong.provider_tournament.tournament_engine import TournamentEngine
from chat.models import Message

@database_sync_to_async
def find_user(obj):

    if not hasattr(obj, "token"):
        raise ValueError("Obj Token Not set")

    session = AuthSession.objects.filter(id=obj.token).first()
    if session is None:
        raise ValueError("Token Nont exist")

    if session.is_expired:
        raise ValueError("Session Exprired")
    
    obj.user = session.user
    obj.user_id = session.user.id
    session.in_game = True
    session.save()
    obj.instance_id = session.user.id
    # add relation
    obj.room_group_name = obj.user_id
    obj.groups.append(obj.user_id)

    return obj


def create_query_param(obj):
    obj.param_tocheck = ["token"]
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
    res = await server_send_message_to_group(
        obj,
        command="BROADCAST_INFO",
        message_type='consumer.talk',
    )
    print("Add Ress", res)

async def s2s_message(obj, command):
    await server_send_message_to_group(
        obj,
        command=command,
        type='consumer.talk',
        data={},
    )

async def connect(obj):

    create_query_param(obj)
    await find_user(obj)
    await create_or_channel_to_group(obj)
    obj.is_init = True
    await obj.accept()
    
    noti = await check_unread_message(obj)
    if noti:
        await obj.new_message(None)
    


@database_sync_to_async
def check_unread_message(obj):
    m = Message.objects.filter(
        recipient_id=obj.user_id,
        is_read=False
    )
    print("m= ", m)
    if m.count() > 0:
        return True
    return False
    

def consumer_info(obj, is_print=False, is_inspect=False):
    attribute_list = [
        'is_init',
        'channel_name',
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
    
    if is_inspect:
        inspect(obj)

    return res
    