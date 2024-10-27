# Generated by Django 5.0.4 on 2024-10-19 11:10

import django.db.models.deletion
import pong.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pong", "0005_matchhistory_usergameinfo"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Tournament",
            fields=[
                (
                    "id",
                    models.CharField(
                        default=pong.models.gen_id,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("updated", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(default="", max_length=255)),
                ("size", models.IntegerField(default=4)),
                ("status", models.CharField(default="CLOSE", max_length=255)),
                (
                    "users",
                    models.ManyToManyField(
                        related_name="tournament_user", to=settings.AUTH_USER_MODEL
                    ),
                ),
                (
                    "winner",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="tournament_winner",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]