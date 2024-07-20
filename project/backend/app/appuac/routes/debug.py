from ninja import Router
from appuac.models.user import User
from appuac.models.authsession import AuthSession
from ninja import Schema, ModelSchema
from faker import Faker
import re

debug_router = Router()

class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = "__all__"

@debug_router.post(
    "/create-simple-user/",
    response={
        201: UserSchema,
    }
)
def post_create_userschema(request):
    """
    Create User
    """
    
    user = User.objects.create_user(
        username=Faker().user_name(),
        password="1234",
    )
    
    return 201, user

@debug_router.get(
    "/all-user/",
    response={
        200: list[UserSchema],
    }
)
def get_all_user(request):
    return User.objects.all()

@debug_router.get(
    "/fast-token",
    response={
        200:dict
    }
)
def fast_create_simple_token(request):
    user = User.objects.create_user(
        username=Faker().user_name(),
        password="1234",
    )
    auth = AuthSession.objects.create(user=user) 
    
    return 200, {
        "token": auth.id
    }