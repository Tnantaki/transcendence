from ninja import Router, Path, Field
from ninja.errors import HttpError
from appuac.models.user import User
from ninja import Schema, ModelSchema
from pydantic import field_validator
from django.shortcuts import get_object_or_404

debug_router = Router()


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

