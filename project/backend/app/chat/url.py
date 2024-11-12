from django.urls import re_path
from chat.provider_chat.chat_consumer import ChatConsumer
websocket_urlpattern = [
    re_path(r"ws/chat/$", ChatConsumer.as_asgi()),
]

urlpatterns =[]