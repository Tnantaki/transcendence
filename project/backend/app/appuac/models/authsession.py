from django.db import models
from nanoid import generate
from appuac.models.user import User
from django.utils import timezone
from datetime import timedelta

def gen_id():
    return generate(size=64)


class AuthSession(models.Model):
    
    SHORT_TTL = 10 * 20  # 10 min
    LONG_TTL = 60 * 24 * 7 # 7 day 
    
    id = models.CharField(default=gen_id, primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    create_at = models.DateTimeField(
        auto_now_add=True,
    )
    last_used = models.DateTimeField(auto_now=True)
    mem = models.BooleanField(default=False)
    in_game = models.BooleanField(default=False)
    
    @property
    def is_expired(self):
        """
        If user check remember me token have long ttl
        """
        if self.in_game:
            return False
            
        if self.mem:
            return timezone.now() > self.last_used + timedelta(minutes=self.LONG_TTL)
            # return False
        return timezone.now() > self.last_used + timedelta(minutes=self.SHORT_TTL)
    
    def refresh(self):
        """
        Refresh last_use
        """
        self.save()
