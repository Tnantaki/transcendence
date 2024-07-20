from ninja import Router, Path, Field
from ninja.errors import HttpError
from appuac.models.user import User, FriendRequest
from ninja import Schema, ModelSchema
from pydantic import field_validator
from django.shortcuts import get_object_or_404

debug_router = Router()


class SimpleRespone(Schema):
    message : str = Field(default="")


class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = [
            "username",
            "display_name",
            "id",
            "bio",
        ]


class UserPathParam(Schema):

    user: str = Field(alias="user_id")

    @field_validator("user")
    @classmethod
    def q_user_by_id(cls, v):
        return get_object_or_404(User, id=v)


class FrendRequestPostIn(Schema):
    receiver: str = Field(..., alias="receiver_id")

    @field_validator("receiver")
    @classmethod
    def q_user_by_id(cls, v):
        return get_object_or_404(User, id=v)


class RegistetPostIn(Schema):
    email: str
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def q_user_by_id(cls, v):
        u = User.objects.filter(username=v).first()
        if u is not None:
            raise HttpError(409, "username already exist")
        return v


router = Router()
open_router = Router()


@router.get(
    "/me/",
    response={
        200: UserSchema,
    },
)
def get_me(request):
    user = request.auth.user
    return 200, user


@router.get(
    "/user/{user_id}/",
    response={
        200: UserSchema,
    },
)
def get_user_by_id(request, path_param: UserPathParam = Path(...)):
    return path_param.user


@open_router.post(
    "/register/",
    response={
        201: UserSchema,
    },
)
def post_create_user(request, payload: RegistetPostIn):
    """
    Post Create User
    """
    user = User.objects.create_user(**payload.dict())
    return 201, user


@router.patch(
    "/me/",
    response={
        200: UserSchema,
    },
)
def patch_user_by_id(request, payload: UserSchema):
    """
    User Patch him self
    """
    user = request.auth.user
    return 200, user

@router.get(
    "/user/",
    response={
        200: list[UserSchema],
    },
)
def get_all_user(request):
    return User.objects.all()


# Create Friend Request
class FriendRequestS(Schema):
    receiver: str = Field(alias="receiver_id")
    
    @field_validator("receiver")
    @classmethod
    def validate_user_exist(cls, v):
        user = User.objects.filter(id = v)
        if not user.exists():
            raise HttpError(404, "USER_NOT_FOUND")
        return user.first()

class FriendRequestBaseOut(Schema):
    id: str
    receiver: UserSchema
    status: str
    
    @staticmethod
    def resolve_reciver(self):
        return self.receiver
        
# accept request
    
# Remove friend
# list friend

@router.post(
    "/friend-request/",
    response={
        201: SimpleRespone,
    }
)
def post_request_friend(request, payload: FriendRequestS):
    req = request.auth.user
    
    f = FriendRequest.objects.filter(
        requestor=req,
        **payload.dict()
    )
    if f.exists():
        raise HttpError(409, "ALREADY_EXIST")
    f = FriendRequest.objects.create(
        requestor=req,
        status="PENDING",
        **payload.dict(),
    )
    
    return 201, {
        "message" : "FRIEND_REQUEST_HAS_BEEN_CREATE"
    }


@router.get(
    "/friend-request/",
    response={
        200: list[FriendRequestBaseOut]
    },
)
def get_request_friend(request):
    req = request.auth.user
    qs = FriendRequest.objects.filter(requestor=req)
    return 200, qs

@router.get(
    "/my-friend-request/",
    response={
        200: list[FriendRequestBaseOut]
    },
)
def get_my_request_friend(request):
    req = request.auth.user
    qs = FriendRequest.objects.filter(receiver=req)
    print(qs)
    return 200, qs



class AcceptFriend(Schema):
    
    status: str
    
    @field_validator("status")
    @classmethod
    def accept_friend_status(cls, v):
        if v not in ["ACCEPT", "REJECT"]:
            raise HttpError(400, "INVALID STATUS")
        return v

class FormRequestPathParam(Schema):
    
    form: str = Field(alias="form_id")
    
    @field_validator("form")
    @classmethod
    def qs_form(cls, v):
        qs = FriendRequest.objects.filter(id=v).first()
        if v is None:
            raise HttpError(404)
        return qs
        
        
@router.post(
    "/accept-request/{form_id}/",
    response={
        200: FriendRequestBaseOut,
    }
)
def post_accept_friend_request(
    request, 
    payload: AcceptFriend, 
    path_param: FormRequestPathParam = Path(...),
):
    """
    # Allow Status
    "ACCEPT", "REJECT"
    """
    user = request.auth.user
    form = path_param.form
    
    if form.receiver != user:
        raise HttpError(400, "UNAUTH")
    if form.status != "PENDING":
        raise HttpError(409, "UNABLE_TO_UPDATE")
    form.status = payload.dict()['status']
    form.save()
    
    if form.status == "ACCEPT":
       form.requestor.friend.add(form.receiver)
       form.receiver.friend.add(form.requestor)
    
    return 200, form

@router.get(
    "/friend/", 
    response={
        200:list[UserSchema],
    }
)
def get_friend_list(request):
    user = request.auth.user
    return user.friend

@router.delete(
    "/friend/{user_id}/",
    response={
        204: None,
    }
)
def delete_friend(request, friend_id: str):
    user = request.auth.user
    friend_obj = User.objects.filter(id=friend_id).first()
    if friend_obj is None:
        raise HttpError(404, "USER_NOT_FOUND")
    user.friend.remove(friend_obj)
    friend_obj.friend.remove(user)
    
    return 204, None
    