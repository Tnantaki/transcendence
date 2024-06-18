from django.db import models
from .user import UserProfiles

class MatchHistories(models.Model):
  player1_id = models.ForeignKey(UserProfiles, on_delete=models.CASCADE, related_name='player1_matches')
  player2_id = models.ForeignKey(UserProfiles, on_delete=models.CASCADE, related_name='player2_matches')
  win_id = models.ForeignKey(UserProfiles, on_delete=models.CASCADE, related_name='player_win')
  score1 = models.IntegerField(default=0, null=False)
  score2 = models.IntegerField(default=0, null=False)
  start_date = models.DateTimeField(null=False)
  duration = models.IntegerField(null=False)

  class Meta:
    db_table = 'match_histories'

  def __str__(self):
    return f"{self.player1_id}:score {self.score1} vs {self.player2_id}:score {self.score2} // {self.start_date}, time: {self.duration}"
  