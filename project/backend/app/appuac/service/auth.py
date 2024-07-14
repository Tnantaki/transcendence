from typing import Any
from django.http import HttpRequest
from ninja.security import HttpBearer
from appuac.models.authsession import AuthSession



def token_auth(token: str):
    auth_session: AuthSession | None = AuthSession.objects.filter(id=token).first()
    if auth_session is None:
        return None
    if auth_session.is_expired:
        auth_session.delete()
        return None
    auth_session.user.last_login = auth_session.last_used
    auth_session.user.save()
    return auth_session


class BearerTokenAuth(HttpBearer):
    """
    Bearer TOken Cass
    """
    def authenticate(self, request: HttpRequest, token: str) -> Any | None:
        
        return token_auth(token)