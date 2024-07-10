from django.contrib.auth.models import AbstractUser
from django.db import models
from nanoid import generate


def gen_id():
    return generate(size=24)


class BaseID(models.Model):
    """
    This is a base model for all models that have auto date fields.\n
    """

    id = models.CharField(
        default=gen_id,
        primary_key=True,
        editable=False,
    )

    class Meta:
        abstract = True


class BaseAutoDate(models.Model):
    """
    This is a base model for all models that have auto date fields.\n
    """

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True