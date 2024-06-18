from django.db import models
from .user import UserProfiles

class Friends(models.Model):
  FRIEND_STATUS = {
    "request": "Request",
    "peding": "Pedding",
    "accept": "Accept",
    "block": "Block",
  }
  my_id = models.ForeignKey(UserProfiles, on_delete=models.CASCADE, related_name='my_profile')
  friend_id = models.ForeignKey(UserProfiles, on_delete=models.CASCADE, related_name='friend_profile')
  status = models.CharField(max_length=10, choices=FRIEND_STATUS)

  class Meta:
    db_table = 'friends'
    constraints = [
      models.UniqueConstraint(fields=['my_id', 'friend_id'], name='unique_player_pair')
    ]

  def __str__(self):
    return self.name