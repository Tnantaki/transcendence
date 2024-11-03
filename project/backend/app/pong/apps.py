from django.apps import AppConfig
from django.contrib.auth import get_user_model

class PongConfig(AppConfig):
    """
    Asyn game server
    """
    default_auto_field = "django.db.models.BigAutoField"
    name = "pong"
    # Clear all tournament_user
    
