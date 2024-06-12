from typing import List
from ninja import Router, Schema
from ..models import appUser, MatchHistories
from django.db.models import Q

import datetime
import pytz

def convertTime(unix_time):
  utc_datetime = datetime.datetime.utcfromtimestamp(unix_time)
  utc_timezone = pytz.timezone('UTC')
  utc_aware_datetime = utc_timezone.localize(utc_datetime)
  utc_plus_7_timezone = pytz.timezone('Asia/Bangkok')  # UTC+7 is Bangkok time
  utc_plus_7_aware_datetime = utc_aware_datetime.astimezone(utc_plus_7_timezone)
  return utc_plus_7_aware_datetime

router = Router()

class matchIn(Schema):
  player1_id: int
  player2_id: int
  score1: int
  score2: int
  start_date: int
  duration: int

class matchOut(Schema):
  player1_id: int
  player2_id: int
  win_id: int
  score1: int
  score2: int
  start_date: str
  duration: int

  @staticmethod
  def resolve_player1_id(obj):
    if type(obj.player1_id) != int:
      return obj.player1_id.id
    return obj.player1_id

  @staticmethod
  def resolve_player2_id(obj):
    if type(obj.player2_id) != int:
      return obj.player2_id.id
    return obj.player2_id

  @staticmethod
  def resolve_win_id(obj):
    if type(obj.win_id) != int:
      return obj.win_id.id
    return obj.win_id.id

  @staticmethod
  def resolve_start_date(obj):
    return obj.start_date.strftime('%Y-%m-%d %H:%M')

@router.post("/save", response=matchOut)
def matchHistorySave(request, data: matchIn):
  player1 = appUser.objects.get(id = data.player1_id)
  player2 = appUser.objects.get(id = data.player2_id)
  winplayer: appUser
  if data.score1 > data.score2:
    winplayer = player1
  else:
    winplayer = player2
  match = MatchHistories.objects.create(
    player1_id = player1,
    player2_id = player2,
    score1 = data.score1,
    score2 = data.score2,
    start_date = convertTime(data.start_date),
    duration = data.duration,
    win_id = winplayer
  )
  return match

@router.get("/id/{user_id}", response=List[matchOut])
def viewHistory(request, user_id: int):
  histories = MatchHistories.objects.filter(Q(player1_id = user_id) | Q(player2_id = user_id))
  return histories