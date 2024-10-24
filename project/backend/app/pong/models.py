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
    TYPE: VERSUS, TORNAMENT
    """

    name = models.CharField(default="", max_length=255)
    number_of_player = models.IntegerField(default=0)
    users = models.ManyToManyField(AUTH_USER_MODEL, related_name="room_user")
    size = models.IntegerField(default=2)

    game_type = models.CharField(default="VERSUS", max_length=255)

    # user_player_register_affter_game_start

    def add_player(self, player):
        self.number_of_player += 1
        self.save()
        return self


class Game(BaseID, BaseAutoDate):
    """
    - param p1: player one
    - param p2: player two
    - param p1_score: player one score
    - param p2_score: player two score
    - param status: CLOSE game end, PENDING, PLAYING, FINISH,

    """

    p1 = models.ForeignKey(
        AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="game_p1",
        null=True,
    )
    p2 = models.ForeignKey(
        AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="game_p2",
        null=True,
    )
    p1_score = models.IntegerField(default=0)
    p2_score = models.IntegerField(default=0)
    status = models.CharField(default="CLOSE", max_length=255)
    room = models.ForeignKey("Room", on_delete=models.CASCADE, null=True)


class MatchHistory(BaseAutoDate, BaseID):
    """
    :param player_1: player 1
    :param player_1_score: player 1 score
    :param player_2: player 2
    :param player_2_score: player 2 score
    :param winner: player who win this match
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