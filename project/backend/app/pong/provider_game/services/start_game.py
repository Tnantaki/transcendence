from channels.db import DatabaseSyncToAsync

from appuac.models.authsession import AuthSession

from pong.models import Room

from pong.provider_game.game_engine import GameEngine

from rich import inspect

import json

async def start_game(obj):
    if len(obj.game_engine.player) != 2:
        print(obj.game_engine.player)
        return
    