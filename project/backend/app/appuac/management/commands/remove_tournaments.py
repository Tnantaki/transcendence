from django.core.management.base import BaseCommand
from appuac.routes.debug import remove_pending_tour, remove_all_user_from_room
from pong.models import Room


class Command(BaseCommand):
    help = 'Remove all users from tournaments'

    def handle(self, *args, **kwargs):
        remove_pending_tour()
        self.stdout.write(self.style.SUCCESS('Successfully removed all users from tournaments'))
        remove_all_user_from_room()
        self.stdout.write(self.style.SUCCESS('Successfully removed all users disconnect server'))
        rooms = Room.objects.all()
        
        for room in rooms:
            room.number_of_player = 0
            room.save()
