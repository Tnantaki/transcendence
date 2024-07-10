from ninja import Router, Schema
from django.contrib.auth import authenticate
from ninja.errors import HttpError
from appuac.service.auth import BearerTokenAuth
from appuac.models.authsession import AuthSession
router = Router()

class LoginPostIn(Schema):
    username: str
    password: str

class LoginPostOut(Schema):
    token: str

@router.post(
    "/login/",
    response={
        201: LoginPostOut
    }
)
def post_login(request, payload: LoginPostIn):
    """
    Post log in from FE
    """
    user = authenticate(
        **payload.dict(),
    )
    if user is None:
        raise HttpError(404, "User not found")
    auth = AuthSession.objects.create(user=user)    

    return 201, {
        "token": auth.id
    }

@router.post(
    "/logout/",
    response={
        204: None
    },
    auth=BearerTokenAuth()
)
def post_logout(request):
    auth = request.auth
    auth.delete()
    return 204, None

