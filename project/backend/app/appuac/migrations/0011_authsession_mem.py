# Generated by Django 5.0.4 on 2024-07-21 19:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("appuac", "0010_fileupload_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="authsession",
            name="mem",
            field=models.BooleanField(default=False),
        ),
    ]
