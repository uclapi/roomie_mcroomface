from django.contrib import admin
from django.contrib.auth.models import Permission
from .models import *

# Register your models here.

admin.site.register(Permission)
admin.site.register(UserProfile)
admin.site.register(Room)
admin.site.register(BookingSociety)
admin.site.register(Booking)
