from appuac.routes import (
    user,
)
from ninja import Router

UACRouter = Router()

UACRouter.add_router(
    prefix="uac/",
    router=user.router,
    tags=["Authentications"],
)