import uuid

from datetime import datetime

from django.db import models
from django.contrib.auth.models import User


class Room(models.Model):
    name = models.CharField(max_length=100)
    room_id = models.CharField(primary_key=True, max_length=100)
    capacity = models.IntegerField(default=0)
    printers = models.BooleanField(default=False)
    coffee = models.BooleanField(default=False)
    water_fountain = models.BooleanField(default=False)
    indiv_bookable = models.BooleanField(default=True)


class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='user_profile')
    society_access = models.BooleanField(default=False)
    quota_left = models.IntegerField(default=180)
    associated_society = models.ManyToManyField('self', blank=True)
    department = models.CharField(max_length=100, default="No Department")



class Booking(models.Model):
    booking_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(UserProfile, related_name='booking')
    room = models.ForeignKey(Room, related_name='booking')
    date = models.DateField()
    start = models.TimeField()
    end = models.TimeField()
    remarks = models.CharField(max_length=150, blank=True)


class BookingSociety(models.Model):
    booking_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(UserProfile, related_name='society_booking')
    room = models.ForeignKey(Room, related_name='society_booking')
    date = models.DateField()
    start = models.TimeField()
    end = models.TimeField()
    remarks = models.CharField(max_length=150, blank=True)
    society = models.ForeignKey(UserProfile)


class Verifier(models.Model):
    user_id = models.IntegerField(default=180)
    param = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)


class ShibLoginToken(models.Model):
    """
        Class to store temporary Shibboleth login tokens.
        The sid: Session ID. Basically a random key generated
        to track authentication and push
        streaming
        Status: An integer that's either 0 (not logged in yet),
        1 (logged in) or 2
            (cancelled / error). More could be added, I guess...
        Timestamp: when the request was made so that we can expire
        old ones after, say, 10 minutes.
    """
    sid = models.CharField(max_length=64, primary_key=True)
    status = models.IntegerField(default=0)
    timestamp = models.DateTimeField(default=datetime.now)
    user = models.OneToOneField(
        User, related_name='shib_login_token', blank=True, null=True)
