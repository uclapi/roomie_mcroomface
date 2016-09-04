# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-08-25 15:32
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0010_auto_20160822_1712'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='society',
            name='user_model',
        ),
        migrations.AlterField(
            model_name='bookingsociety',
            name='society',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.UserProfile'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='associated_society',
            field=models.ManyToManyField(blank=True, related_name='_userprofile_associated_society_+', to='rooms.UserProfile'),
        ),
        migrations.DeleteModel(
            name='Society',
        ),
    ]