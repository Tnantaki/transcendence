# chat/routing.py
from django.urls import re_path

from pong.provider_game.game_consumer import GameConsumer
from pong.provider_tournament.tournament_consumer import TournamentLobbyConsumer

websocket_urlpatterns = [
    re_path(r"ws/pong/$", GameConsumer.as_asgi()),
    re_path(r"ws/tournament/$", TournamentLobbyConsumer.as_asgi()),
]

urlpatterns = []
