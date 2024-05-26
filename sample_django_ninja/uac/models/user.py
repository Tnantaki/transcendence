from django.contrib.auth.models import AbstractBaseUser, User
from nanoid import generate
from django.db import models



def getId():
    return generate(size=16)

class Token(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,)
    token = models.CharField(default=getId)