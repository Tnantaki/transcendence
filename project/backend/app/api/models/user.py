from django.db import models
from .avatarImage import AvatarImages

class UserProfiles(models.Model):
  username = models.CharField(max_length=40, unique=True, null=False)
  password = models.CharField(max_length=255, null=False)
  avatar_name = models.CharField(max_length=40, unique=True)
  avatar_image_id = models.OneToOneField(AvatarImages, on_delete=models.SET_NULL, blank=True, null=True)
  bio = models.TextField(blank=True, null=True)
  email = models.EmailField(max_length=255, blank=True, null=True)

  class Meta:
    db_table = 'user_profiles'
    
  def __str__(self):
    return f"{self.username}, {self.avatar_name}"
