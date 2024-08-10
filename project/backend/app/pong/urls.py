# chat/routing.py
from django.urls import re_path

from . import game_consumer

websocket_urlpatterns = [
    re_path(r"ws/pong/$", game_consumer.GameConsumer.as_asgi()),
]

urlpatterns = []
