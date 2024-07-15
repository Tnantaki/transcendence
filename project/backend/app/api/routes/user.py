# from ninja import Router, Schema
# from ninja.files import UploadedFile
# # from ..models import UserProfiles, MatchHistories, AvatarImages
# from typing import Optional
# from django.contrib.auth.hashers import make_password, check_password
# from django.db.models import Q

# router = Router()


# class Message(Schema):
#     message: str


# class registerIn(Schema):
#     username: str
#     password: str
#     avatar_name: str


# class registerOut(Schema):
#     id: int
#     username: str
#     avatar_name: str


# @router.post("/register", response=registerOut)
# def register(request, data: registerIn):
#     user = UserProfiles.objects.create(
#         username=data.username,
#         password=make_password(data.password),
#         avatar_name=data.avatar_name,
#     )
#     return user


# class profileForm(Schema):
#     AvatarImages: str
#     bio: Optional[str] = None
#     email: Optional[str] = None


# # not test yet
# @router.patch("/edit/{user_id}")
# def editProfile(request, user_id: int, data: profileForm):
#     user = UserProfiles.objects.get(id=user_id)
#     if data.bio:
#         user.bio = data.bio
#     if data.email:
#         user.email = data.email
#     user.save()
#     return user


# class profileOut(Schema):
#     avatar_name: str
#     bio: str
#     email: str
#     total_games_play: int
#     wins: int
#     losses: int


# @router.get("/id/{user_id}", response=profileOut)
# def viewProfile(request, user_id: int):
#     user = UserProfiles.objects.get(id=user_id)
#     total_games_play = MatchHistories.objects.filter(
#         Q(player1_id=user_id) | Q(player2_id=user_id)
#     ).count()
#     wins = MatchHistories.objects.filter(Q(win_id=user_id)).count()
#     losses = total_games_play - wins
#     return {
#         "avatar_name": user.avatar_name,
#         "bio": user.bio,
#         "email": user.email,
#         "total_games_play": total_games_play,
#         "wins": wins,
#         "losses": losses,
#     }


# @router.post("/upload", response={200: dict})
# def uploadAvartarImage(request, user_id: int, file: UploadedFile):
#     user = UserProfiles.objects.get(id=user_id)
#     f = AvatarImages.objects.create(
#         user=user,
#         file_name=file.name,
#         file_db=file,
#     )
#     return 200, {"link": f.url}


# class listImageOut(Schema):
#     id: int
#     url: str


# @router.get("/list-file", response={200: list[listImageOut]})
# def listAvatarImage(request):
#     return AvatarImages.objects.all()
