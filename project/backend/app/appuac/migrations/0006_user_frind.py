# Generated by Django 5.0.4 on 2024-07-20 11:36

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("appuac", "0005_alter_friendrequest_status_delete_friendlist"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="frind",
            field=models.ManyToManyField(
                related_name="myfriend", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]