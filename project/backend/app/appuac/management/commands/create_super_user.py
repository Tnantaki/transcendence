from django.core.management.base import BaseCommand
from app.settings import AUTH_USER_MODEL
from appuac.models.user import User
from app.services.env_manager import ENVS

class Command(BaseCommand):
    help = "Create super user form env feed"

    def handle(self, *arg, **kwarg):

        print(ENVS)
        super_user = User.objects.create_superuser(
            username="admin",
            password="admin",
        )