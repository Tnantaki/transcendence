from django.contrib.auth.models import AbstractUser
from django.db import models
from nanoid import generate
from app.settings import AUTH_USER_MODEL


def gen_id():
    return generate(alphabet="0123456789abcdefghijklmnopqrst", size=24)


class BaseID(models.Model):
    """
    This is a base model for all models that have auto date fields.\n
    """

    id = models.CharField(
        default=gen_id,
        primary_key=True,
        editable=False,
    )

    class Meta:
        abstract = True


class BaseAutoDate(models.Model):
    """
    This is a base model for all models that have auto date fields.\n
    """

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Room(BaseAutoDate):
    """
    TYPE: VERSUS, TOURNAMENT
    """

    name = models.CharField(default="", max_length=255)
    number_of_player = models.IntegerField(default=0)
    users = models.ManyToManyField(AUTH_USER_MODEL, related_name="room_user")
    size = models.IntegerField(default=2)

    game_type = models.CharField(default="VERSUS", max_length=255)
    hide = models.BooleanField(default=False)
    tour_id = models.CharField(default="", max_length=255)

    # user_player_register_affter_game_start

    def add_player(self, player):
        self.number_of_player += 1
        self.save()
        return self


class MatchHistory(BaseAutoDate, BaseID):
    """
    :param player_1: player 1
    :param player_1_score: player 1 score
    :param player_2: player 2
    :param player_2_score: player 2 score
    :param winner: player who win this match
    :param mtype: match type VERSUS, TR1, TR2 (tour round1 and 2)
    """
    player_1 = models.ForeignKey(
        AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="mh_1",
    )
    player_1_score = models.IntegerField(default=0)
    player_2 = models.ForeignKey(
        AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="mh_2",
    )
    player_2_score = models.IntegerField(default=0)
    winner = models.ForeignKey(
        AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="mh_winner",
    )
    status = models.CharField(default="FINISH", max_length=255)
    mtype = models.CharField(default="VERSUS", max_length=255)


class UserGameInfo(BaseAutoDate):
    """
    :param user: user
    :param win: number of win
    :param lose: number of lose
    :param draw: number of draw
    :param total_play: total play
    :param total_score: total score
    """

    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    win = models.IntegerField(default=0)
    lose = models.IntegerField(default=0)
    draw = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)
    
class Tournament(BaseAutoDate, BaseID):
    """
    :param name: name of tournament
    :param users: list of users
    :param size: number of player
    :param status: status of tournament `CLOSE`, `OPEN`, `PLAYING-R1`, `PLAYING-R2`
    :param winner: winner of tournament
    """
    name = models.CharField(default="", max_length=255)
    users = models.ManyToManyField(AUTH_USER_MODEL, related_name="tournament_user")
    size = models.IntegerField(default=4)
    status = models.CharField(default="OPEN", max_length=255)
    winner = models.ForeignKey(
        AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="tournament_winner",
    )
    owner = models.ForeignKey(
        AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="tournament_owner",
    )

class TourRound(BaseAutoDate, BaseID):
    """
    :param tournament: tournament
    :param round: round number
    :param matches: list of matches
    """
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    tround = models.IntegerField(default=0)
    matches = models.ManyToManyField(MatchHistory, related_name="tournament_round_match")
    