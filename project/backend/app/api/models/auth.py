from django.db import models
from .user import UserProfiles

class Auths(models.Model):
  user_id = models.OneToOneField(UserProfiles, on_delete=models.CASCADE, primary_key=True)
  token = models.CharField(max_length=20, null=False)

  class Meta:
    db_table = 'auths'

  def __str__(self):
    return self.token