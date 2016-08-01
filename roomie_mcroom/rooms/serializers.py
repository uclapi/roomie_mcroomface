from .models import UserProfile, Room, Booking
from rest_framework import serializers
from django.contrib.auth.models import User

class RoomSerializer(serializers.Serializer):
    name = serializers.CharField(read_only=True)
    room_id = serializers.CharField(read_only=True)
    capacity = serializers.IntegerField(read_only=True)
    printers = serializers.BooleanField(read_only=True)
    coffee = serializers.BooleanField(read_only=True)
    water_fountain = serializers.BooleanField(read_only=True)
    indiv_bookable = serializers.BooleanField(read_only=True)


class UserProfileSerializer(serializers.Serializer):
    first_name = serializers.CharField(source = 'user.first_name')
    last_name = serializers.CharField(source = 'user.last_name')
    email = serializers.EmailField(source = 'user.email')
    password = serializers.CharField(source = 'user.password')
    society_access = serializers.BooleanField()

    quota_left = serializers.IntegerField()
    associated_society = serializers.CharField()

    class Meta:
        model = User
        fields = ('id', 'email', 'last_name', 'password', 'first_name')