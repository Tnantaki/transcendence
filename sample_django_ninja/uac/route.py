from ninja import Router, ModelSchema, Schema
from django.contrib.auth.models import User


router = Router()

class UserRegisterForm(ModelSchema):
    class Meta:
        model = User
        fields = [
            "username",
            "password"
        ]

class UserBaseOut(Schema):
    username: str
    password: str


@router.get(
    "/user",
    response={
        200: UserBaseOut,
    }
)
def get_user(request):
    return {
        "hello": "hi"
    }

from rich import print, inspect

@router.post(
    "/user",
    response={
        201: UserBaseOut,
    }
)
def post_user(request, payload: UserRegisterForm):

    d_payload = payload.dict()
    user = User.objects.create_user(
        username=d_payload['username'],
        password=d_payload['password']
    )
    print(d_payload)
    inspect(user)
    return 201, user