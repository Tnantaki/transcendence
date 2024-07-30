# Generated by Django 5.0.4 on 2024-07-29 13:54

import django.db.models.deletion
import pong.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Game",
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
                ("p1_score", models.IntegerField(default=0)),
                ("p2_score", models.IntegerField(default=0)),
                ("status", models.CharField(default="CLOSE", max_length=255)),
                (
                    "p1",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="game_p1",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "p2",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="game_p2",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]