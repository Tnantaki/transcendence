from channels.db import database_sync_to_async
from appuac.models.authsession import AuthSession

@database_sync_to_async()
async def query_user_from_token(token):
    token = AuthSession.objects.get(token=token)
    if token is None:
        return None
    if token.is_expired():
        return None
    user = token.user
    return user