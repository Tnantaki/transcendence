from django.contrib.auth.models import AbstractUser
from django.db import models
from nanoid import generate
from appuac.models.base import (
    BaseAutoDate,
    BaseID,
)


def gen_id():
    return generate(size=24)

class User(AbstractUser):
    id = models.CharField(
        default=gen_id,
        primary_key=True,
        editable=False,
    )
    bio = models.TextField(default="")
    avatar_name = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "auth_user"


class MakeFriend(BaseID, BaseAutoDate):
    """
    if statis is accept both are friend
    """

    requestor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="friend_request",
    )
    reciever = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="friend_list",
    )

    class StatusChoice(models.TextChoices):
        pending = "P", "Pending"
        accept = "A", "Accept"
        reject = "R", "Reject"

    status = models.CharField(
        choices=StatusChoice.choices,
        default=StatusChoice.pending,
    )
