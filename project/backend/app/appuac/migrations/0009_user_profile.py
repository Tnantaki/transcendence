# Generated by Django 5.0.4 on 2024-07-21 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("appuac", "0008_fileupload"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="profile",
            field=models.CharField(default="/asset/img/default.jpg"),
        ),
    ]