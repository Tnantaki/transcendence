from django.contrib.auth.models import AbstractUser
from django.db import models
from nanoid import generate
from appuac.models.base import (
    BaseAutoDate,
    BaseID,
)
from datetime import timedelta
from django.utils import timezone

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

    @property
    def is_online(self):
        res = self.authsession_set.filter(last_used__gte=timezone.now() - timedelta(minutes=60))
        return res.exists()

    class Meta:
        db_table = "auth_user"

    def __repr__(self) -> str:
        return f"user: {self.id}"

    def __repr__(self) -> str:
        return f"user: {self.id}"


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
