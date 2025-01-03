# Generated by Django 5.0.4 on 2024-11-19 09:53

import django.db.models.deletion
import pong.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pong", "0012_room_tour_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="matchhistory",
            name="status",
            field=models.CharField(default="FINISH", max_length=255),
        ),
        migrations.CreateModel(
            name="TourRound",
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
                ("tround", models.IntegerField(default=0)),
                (
                    "matches",
                    models.ManyToManyField(
                        related_name="tournament_round_match", to="pong.matchhistory"
                    ),
                ),
                (
                    "tournament",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="pong.tournament",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
