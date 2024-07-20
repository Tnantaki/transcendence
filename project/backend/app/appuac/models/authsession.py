from django.db import models
from nanoid import generate
from appuac.models.user import User
from django.utils import timezone
from datetime import timedelta

def gen_id():
    return generate(size=64)


class AuthSession(models.Model):
    TOKEN_TTL = 60 * 60 * 4 # 4 hour
    id = models.CharField(default=gen_id, primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    create_at = models.DateTimeField(
        auto_now_add=True,
    )
    last_used = models.DateTimeField(auto_now=True)
    
    @property
    def is_expired(self):
        return timezone.now() > self.last_used + timedelta(self.TOKEN_TTL)
