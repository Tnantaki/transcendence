from ninja import Router, Schema
from ..models import appUser, MatchHistories
from typing import Optional
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q

router = Router()

class Message(Schema):
  message: str

class registerIn(Schema):
  username: str
  password: str
  avatar_name: str

class registerOut(Schema):
  id: int
  username: str
  avatar_name: str

@router.post("/register", response=registerOut)
def register(request, data: registerIn):
  user = appUser.objects.create(
    username = data.username,
    password = make_password(data.password),
    avatar_name = data.avatar_name
  )
  return user

# class logIn(Schema):
#   username: str
#   password: str

# class logOut(Schema):
#   pass

# @router.post("/login", response=logOut)
# def login(request, data: logIn):
#   user = appUser.objects.get(username = data.username)
#   if check_password(data.password, user.password):
#     print("Login Success")
#   else:
#     print("wrong password")

# @api.post("/profile/upload")
# def uploadAvatarPic(request, file: UploadedFile):

class profileForm(Schema):
  user_id: int
  avatar_image: str
  bio: str
  email: str

# not test yet
@router.patch("/edit")
def editProfile(request, data: profileForm):
  user = appUser.objects.get(id = data.user_id)
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

@router.get("/id/{user_id}", response=profileOut)
def viewProfile(request, user_id: int):
  user = appUser.objects.get(id = user_id)
  total_games_play = MatchHistories.objects.filter(Q(player1_id = user_id) | Q(player2_id = user_id)).count()
  wins = MatchHistories.objects.filter(Q(win_id = user_id)).count()
  losses = total_games_play - wins
  return {
    'avatar_name': user.avatar_name,
    'bio': user.bio,
    'email': user.email,
    'total_games_play': total_games_play,
    'wins': wins,
    'losses': losses
  }
