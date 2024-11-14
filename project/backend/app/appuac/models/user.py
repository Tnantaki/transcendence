from django.contrib.auth.models import AbstractUser
from django.db import models
from nanoid import generate
from appuac.models.base import (
    BaseAutoDate,
    BaseID,
)
from datetime import timedelta
from django.utils import timezone
from pong.models import MatchHistory
from django.db.models import Q

def gen_id():
    return generate(size=24)


class User(AbstractUser):
    id = models.CharField(
        default=gen_id,
        primary_key=True,
        editable=False,
    )
    bio = models.TextField(default="")
    display_name = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    friend = models.ManyToManyField("User", related_name="myfriend")
    profile = models.CharField(default="/asset/img/default.jpg")

    @property
    def is_online(self):
        res = self.authsession_set.filter(
            last_used__gte=timezone.now() - timedelta(minutes=60)
        )
        return res.exists()
    
    @property
    def wins(self):
        m = MatchHistory.objects.filter(
            winner=self
        ).count()
        return m
    
    @property
    def losses(self):
        player_1 = Q(player_1=self)
        player_2 = Q(player_2=self)
        matches = abs(MatchHistory.objects.filter(player_1 | player_2).count() - self.wins)
        return matches
    
    @property
    def tour_won(self):
        return 0
    
    @property
    def tour_play(self):
        return 0

    class Meta:
        db_table = "auth_user"

    def __repr__(self) -> str:
        return f"user: {self.id} username: {self.username}"

    def __str__(self) -> str:
        return f"user: {self.id}, username: {self.username}"

    def get_display_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'display_name':self.display_name,
            'profile': self.profile
        }


class FriendRequest(BaseAutoDate, BaseID):
    requestor = models.ForeignKey(
        User,
        related_name="friend_requestor",
        on_delete=models.CASCADE,
    )
    receiver = models.ForeignKey(
        User,
        related_name="friend_reciever",
        on_delete=models.CASCADE,
    )
    status = models.CharField(max_length=255, default="PENDING")


class FileUpload(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
    )
    title = models.CharField(default="", max_length=255)
    file_db = models.ImageField(upload_to="img/")

    @property
    def url(self):
        return f"{self.file_db.url}"
