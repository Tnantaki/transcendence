from appuac.routes import auth
from appuac.routes import (
    user,
    debug,
)
from appuac.service.auth import BearerTokenAuth
from ninja import Router



UACRouter = Router()

UACRouter.add_router(
    prefix="uac/",
    router=user.router,
    tags=["User"],
    auth=BearerTokenAuth()
)

UACRouter.add_router(
    prefix="uac/",
    router=auth.router,
    tags=["Authentications"],
)

UACRouter.add_router(
    prefix="debug/",
    router=debug.debug_router,
    tags=["Debug"],
)

UACRouter.add_router(
    prefix="uac/",
    router=user.open_router,
    tags=["Authentications"]
)