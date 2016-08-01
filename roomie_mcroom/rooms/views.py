from django.shortcuts import render
from .models import Room, Booking, UserProfile
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
# Create your views here.


@api_view(['GET'])
def get_rooms_list(request):
    rooms = Room.objects.all()
    roomDict = {}
    for index, room in enumerate(rooms):
        roomDict[index] = {
            "capacity": room.capacity,
            "coffee": room.coffee,
            "water_fountain": room.water_fountain,
            "room_name": room.name,
            "individual_access": room.indiv_bookable,
            "printers": room.printers,
            "room_id": room.room_id
        }

    return Response(roomDict)


