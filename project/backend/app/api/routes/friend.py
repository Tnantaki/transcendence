from typing import List
from ninja import Router, Schema
from ..models import UserProfiles, Friends

router = Router()

class Message(Schema):
  message: str

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

@router.post("/request", response={200: friendOut, 500: Message})
def friendStatus(request, data: friendIn):
  try:
    my_id = UserProfiles.objects.get(id = data.player1_id)
    friend_id = UserProfiles.objects.get(id = data.player2_id)
    try:
      friend = Friends.objects.create(
        my_id = friend_id,
        friend_id = my_id,
        status = "request"
      )
      me = Friends.objects.create(
        my_id = my_id,
        friend_id = friend_id,
        status = "pending"
      )
    except:
      return 500, {'message': 'Repeat requested'}
  except:
    return 500, {'message': "Not found the id."}
  return me

@router.post("/accept", response={200: friendOut, 500: Message})
def friendRequest(request, data: friendIn):
  try:
    me = Friends.objects.get(my_id = data.player1_id, friend_id = data.player2_id)
    friend = Friends.objects.get(my_id = data.player2_id, friend_id = data.player1_id)
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

@router.get("/list/{user_id}", response=List[friendOut])
def friendList(request, user_id: int):
  list = Friends.objects.filter(my_id = user_id)
  return list