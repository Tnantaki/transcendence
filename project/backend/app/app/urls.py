"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
from appuac.url import UACRouter
# from api.urls import apiRouter
from ninja import Swagger
from django.urls import path, include
from django.conf.urls.static import static
from app import settings
from pong import urls as pong_urls
from pong.routing import  pong_router
from chat import url as chat_urls

api = NinjaAPI(
    # docs=Swagger(),
)

api.add_router(
    prefix="/",
    router=UACRouter,
)

api.add_router(
    prefix="/game",
    router=pong_router
)

urlpatterns = [
    path("i/", api.urls),
    path('admin/', admin.site.urls),
    path('game/pong/', include(pong_urls)),
    path('chat/', include(chat_urls))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)