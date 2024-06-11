from typing import List, Optional
from django.shortcuts import render
from ninja import Router, Schema
from ninja.files import UploadedFile
from . import models
from datetime import datetime
from .func import convertTime
from django.db.models import Q
from typing import Literal

api = Router()

####################
#---- USER API ----#
####################

class Message(Schema):
  message: str

class userIn(Schema):
  username: str
  password: str
  avatar_name: str

class userOut(Schema):
  id: int
  username: str

@api.post("/user/create", response=userOut)
def register(request, data: userIn):
  user = models.appUser.objects.create(
    username = data.username,
    password = data.password,
    avatar_name = data.avatar_name
  )
  return user

# @api.post("/profile/upload")
# def uploadAvatarPic(request, file: UploadedFile):

class profileForm(Schema):
  user_id: int
  avatar_image: str
  bio: str
  email: str

# not test yet
@api.patch("/user/edit")
def editProfile(request, data: profileForm):
  user = models.appUser.objects.get(id = data.user_id)
  if data.bio:
    user.bio = data.bio
  if data.email:
    user.email = data.email
  user.save()
  return user

class profileOut(Schema):
  avatar_name: str
  bio: Optional[str] = None
  email: Optional[str] = None
  total_games_play: int
  wins: int
  losses: int

@api.get("/user/id/{user_id}", response=profileOut)
def viewProfile(request, user_id: int):
  user = models.appUser.objects.get(id = user_id)
  total_games_play = models.MatchHistories.objects.filter(Q(player1_id = user_id) | Q(player2_id = user_id)).count()
  wins = models.MatchHistories.objects.filter(Q(win_id = user_id)).count()
  losses = total_games_play - wins
  # print("total game: ", )
  return {
    'avatar_name': user.avatar_name,
    'bio': user.bio,
    'email': user.email,
    'total_games_play': total_games_play,
    'wins': wins,
    'losses': losses
  }

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

@api.post("/match/save", response=matchOut)
def matchHistorySave(request, data: matchIn):
  player1 = models.appUser.objects.get(id = data.player1_id)
  player2 = models.appUser.objects.get(id = data.player2_id)
  winplayer: models.appUser
  if data.score1 > data.score2:
    winplayer = player1
  else:
    winplayer = player2
  match = models.MatchHistories.objects.create(
    player1_id = player1,
    player2_id = player2,
    score1 = data.score1,
    score2 = data.score2,
    start_date = convertTime(data.start_date),
    duration = data.duration,
    win_id = winplayer
  )
  return match

@api.get("/match/id/{user_id}", response=List[matchOut])
def viewHistory(request, user_id: int):
  histories = models.MatchHistories.objects.filter(Q(player1_id = user_id) | Q(player2_id = user_id))
  return histories

class friendIn(Schema):
  player1_id: int
  player2_id: int

class friendOut(Schema):
  player1_id: int
  player2_id: int
  status: str

  @staticmethod
  def resolve_player1_id(obj):
    if type(obj.my_id) != int:
      return obj.my_id.id
    return obj.my_id

  @staticmethod
  def resolve_player2_id(obj):
    if type(obj.friend_id) != int:
      return obj.friend_id.id
    return obj.friend_id

@api.post("/friends/request", response={200: friendOut, 500: Message})
def friendStatus(request, data: friendIn):
  try:
    my_id = models.appUser.objects.get(id = data.player1_id)
    friend_id = models.appUser.objects.get(id = data.player2_id)
    try:
      friend = models.Friends.objects.create(
        my_id = friend_id,
        friend_id = my_id,
        status = "request"
      )
      me = models.Friends.objects.create(
        my_id = my_id,
        friend_id = friend_id,
        status = "pending"
      )
    except:
      return 500, {'message': 'Repeat requested'}
  except:
    return 500, {'message': "Not found the id."}
  return me

@api.post("/friends/accept", response={200: friendOut, 500: Message})
def friendRequest(request, data: friendIn):
  try:
    me = models.Friends.objects.get(my_id = data.player1_id, friend_id = data.player2_id)
    friend = models.Friends.objects.get(my_id = data.player2_id, friend_id = data.player1_id)
    if me.status == 'request':
      me.status = 'accept'
      friend.status = 'accept'
      me.save()
      friend.save()
    else:
      return 500, {'message': "This id didn't get requested friend"}
  except:
    return 500, {'message': "Not found the id."}
  return me

@api.get("/friends/list/{user_id}", response=List[friendOut])
def friendList(request, user_id: int):
  list = models.Friends.objects.filter(my_id = user_id)
  return list