"""
ASGI config for app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

# app/asgi.py
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from channels.db import database_sync_to_async

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from pong.urls import websocket_urlpatterns
from chat.url import websocket_urlpattern as chat_url

from channels.auth import AuthMiddlewareStack


from appuac.management.commands.remove_tournaments import Command as remove_pending_tour
# TODO DELETE ME
try:
    remove_pending_tour().handle()
except Exception as e:
    print(e)


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns + chat_url))
        ),
    }
)
