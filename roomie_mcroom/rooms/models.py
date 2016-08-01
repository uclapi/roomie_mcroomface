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
    user = models.OneToOneField(User)
    society_access = models.BooleanField(default=False)
    quota_left = models.IntegerField(default = 180)
    associated_society = models.CharField(max_length=100, blank=True)

class Booking(models.Model):
    user = models.ForeignKey(UserProfile)
    room = models.ForeignKey(Room)
    start = models.DateTimeField()
    end = models.DateTimeField()
    event = models.CharField(max_length=1000)

