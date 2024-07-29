
from ninja import Router, Path, Field
from ninja import Schema, ModelSchema
from django.shortcuts import get_object_or_404
from appuac.models.user import (
    User,
    FriendRequest,
    FileUpload,
)
from pydantic import field_validator
from ninja.errors import HttpError

class SimpleRespond(Schema):
    message: str = Field(default="")


class UserSchema(ModelSchema):
    is_online: bool = Field(default=False)
    display_name: str = Field(default="")
    wins: int = Field(default=0)
    losses: int = Field(default=0)
    tour_won: int = Field(default=0)
    tour_play: int = Field(default=0)

    class Meta:
        model = User
        fields = [
            "username",
            "display_name",
            "id",
            "bio",
            "profile",
            "email",
        ]
    
    @staticmethod
    def resolve_display_name(obj):
        if obj.display_name == "":
            return obj.username
        return obj.display_name

class UserPatchIn(ModelSchema):
    
    class Meta:
        model = User
        fields = [
            "display_name",
            "bio",
            "email",
        ]


class UserPathParam(Schema):

    user: str = Field(alias="user_id")

    @field_validator("user")
    @classmethod
    def q_user_by_id(cls, v):
        return get_object_or_404(User, id=v)


class FriendRequestPostIn(Schema):
    receiver: str = Field(..., alias="receiver_id")

    @field_validator("receiver")
    @classmethod
    def q_user_by_id(cls, v):
        return get_object_or_404(User, id=v)


class RegisterPostIn(Schema):
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

class FriendRequestS(Schema):
    receiver: str = Field(alias="receiver_id")

    @field_validator("receiver")
    @classmethod
    def validate_user_exist(cls, v):
        user = User.objects.filter(id=v)
        if not user.exists():
            raise HttpError(404, "USER_NOT_FOUND")
        return user.first()
    
class FriendReceiveBaseOut(Schema):
    id: str
    user: UserSchema
    status: str

    @staticmethod
    def resolve_user(self):
        return self.receiver


class FriendRequestorBaseOut(Schema):
    id: str
    user: UserSchema
    status: str

    @staticmethod
    def resolve_user(self):
        return self.requestor
