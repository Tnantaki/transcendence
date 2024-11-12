from django.db import models
from app.settings import AUTH_USER_MODEL

class BaseAutoDate(models.Model):
    """
    This is a base model for all models that have auto date fields.\n
    """

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# Create your models here.
class ChatRoom(models.Model):
    """
    Title = user1+user2 id
    """
    title = models.CharField(unique=True, null=False)
    users = models.ManyToManyField(AUTH_USER_MODEL, related_name='chatRooms')


class Message(BaseAutoDate):
    message = models.TextField(default="")
    sender = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, related_name="s_message")
    recipient = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, related_name="r_message")
    is_read = models.BooleanField(default=False)
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, null=True)