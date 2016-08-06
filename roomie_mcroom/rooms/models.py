from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser


# Create your models here.
class Room(models.Model):
    name = models.CharField(max_length=100)
    room_id = models.CharField(primary_key=True, max_length=100)
    capacity = models.IntegerField(default=0)
    printers = models.BooleanField(default=False)
    coffee = models.BooleanField(default = False)
    water_fountain = models.BooleanField(default = False)
    indiv_bookable = models.BooleanField(default = True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='user_profile')
    society_access = models.BooleanField(default=False)
    quota_left = models.IntegerField(default = 180)
    associated_society = models.CharField(max_length=100, blank=True)

class Booking(models.Model):
    user = models.ForeignKey(UserProfile, related_name='booking')
    room = models.ForeignKey(Room, related_name='booking')
    date = models.DateField()
    start = models.TimeField()
    end = models.TimeField()

    class Meta:
        abstract = True

class SocietyBooking(Booking):
    society_name = models.CharField(max_length=100)
    event_name = models.CharField(max_length=100, blank=True)

class NormalBooking(Booking):
    notes = models.CharField(max_length=150, blank=True)