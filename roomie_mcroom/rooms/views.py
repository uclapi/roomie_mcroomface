from django.shortcuts import render
from .models import Room, Booking, UserProfile
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions

from rest_framework.decorators import authentication_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
# Create your views here.


@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((permissions.IsAuthenticated,))
def get_rooms_list(request):
    print(request.user)
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


