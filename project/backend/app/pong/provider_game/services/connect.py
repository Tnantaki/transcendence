from channels.db import DatabaseSyncToAsync

from appuac.models.authsession import AuthSession

from pong.models import Room

from pong.provider_game.game_engine import GameEngine

from rich import inspect

import json

def create_query_param(obj):
    obj.param_tocheck = ['room_id', "token"]
    if not hasattr(obj, 'scope'):
        return None
    
    query_param = {
        k: v
        for (k,v) in [
            i.split("=") for i in obj.scope['query_string'].decode().split('&')
        ]
    }
    
    missing_param = set(obj.param_tocheck) - query_param.keys()
    if missing_param:
        raise ValueError(f"Missing Query Param {','.join(missing_param)}")
    
    for k,v in query_param.items():
        if k in obj.param_tocheck:
            setattr(obj, k, v)
    return obj


@DatabaseSyncToAsync
def check_user(obj):
    if not hasattr(obj, "token"):
        raise ValueError("Token Not Exist")
    session = AuthSession.objects.filter(id=obj.token).first()
    if session is None:
        raise ValueError("Session Not Found")
    user = session.user
    obj.user = user
    return obj

@DatabaseSyncToAsync
def check_room(obj):
    if not hasattr(obj, "room_id"):
        raise ValueError("room id not exist")
    room = Room.objects.filter(id=obj.room_id).first()
    if room is None:
        raise ValueError("Room Not Found")
    obj.room = room
    obj.room_id = room.id
    return obj
    

def init_game_engine(obj):
    obj.room_group_name = f"Game_Room_{obj.room_id}"
    obj.game_engine = GameEngine(obj.room_group_name, obj.room_id, obj.room.game_type)


async def process_user_connect(obj):
    if await obj.check_is_user_already_join(obj.room, obj.user):
        await obj.set_exit_code(4005, "User is already join")
        return
    await obj.user_join_room(obj.room, obj.user)
    obj.game_engine.add_user(obj.token)
    obj.game_engine.set_player(obj.token, obj.player_number, obj.user)
    await obj.channel_layer.group_add(obj.room_group_name, obj.channel_name)
    await obj.send(
        **{"text_data": json.dumps({"code": 2000, "command": "CONNECTED", "data": {}})}
    )

@DatabaseSyncToAsync
def update_room(obj):
    obj.room =Room.objects.get(id=obj.room_id)

async def connect(obj):
    create_query_param(obj)
    await check_user(obj)
    await check_room(obj)
    init_game_engine(obj)
    await process_user_connect(obj)
    await update_room(obj)