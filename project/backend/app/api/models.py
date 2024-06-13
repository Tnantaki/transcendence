from django.db import models

# Create your models here.
class appUser(models.Model):
  username = models.CharField(max_length=20, unique=True, null=False)
  password = models.CharField(max_length=256, null=False)
  avatar_name = models.CharField(max_length=20, unique=True)
#  avatar_image = models.ImageField(upload_to='avatars', blank=True, null=True)
  bio = models.TextField(blank=True, null=True)
  email = models.EmailField(max_length=255, blank=True, null=True)

  def __str__(self):
    return f"{self.username}, {self.avatar_name}"

class Auths(models.Model):
  user_id = models.OneToOneField(appUser, on_delete=models.CASCADE, primary_key=True)
  token = models.CharField(max_length=20, null=False)

  def __str__(self):
    return self.token

class MatchHistories(models.Model):
  player1_id = models.ForeignKey('appUser', on_delete=models.CASCADE, related_name='player1_matches')
  player2_id = models.ForeignKey('appUser', on_delete=models.CASCADE, related_name='player2_matches')
  win_id = models.ForeignKey('appUser', on_delete=models.CASCADE, related_name='player_win')
  score1 = models.IntegerField(default=0, null=False)
  score2 = models.IntegerField(default=0, null=False)
  start_date = models.DateTimeField(null=False)
  duration = models.IntegerField(null=False)

  def __str__(self):
    return f"{self.player1_id}:score {self.score1} vs {self.player2_id}:score {self.score2} // {self.start_date}, time: {self.duration}"
  
class Friends(models.Model):
  FRIEND_STATUS = {
    "request": "Request",
    "peding": "Pedding",
    "accept": "Accept",
    "block": "Block",
  }
  my_id = models.ForeignKey('appUser', on_delete=models.CASCADE, related_name='my_profile')
  friend_id = models.ForeignKey('appUser', on_delete=models.CASCADE, related_name='friend_profile')
  status = models.CharField(max_length=10, choices=FRIEND_STATUS)

  class Meta:
    constraints = [
      models.UniqueConstraint(fields=['my_id', 'friend_id'], name='unique_player_pair')
    ]

  def __str__(self):
    return self.name
