from django.shortcuts import render
from .models import Room, Booking, UserProfile
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import *
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
import datetime
from django.contrib.auth import authenticate
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

@api_view(['GET'])
def get_room_bookings(request, room_id, year, month, day):
    # two things have to be implemented here
    # 1) make sure this call is from authenticated user
    # 2) then we check if the user is allowed to check this specific room, eg. common rooms
    #
    try:
        room = Room.objects.get(room_id = room_id)
    except:
        return Response({"error":"404 room id does not exist"})
    finally:
        pass


    try:
        dateString = day + month + year
        dateOfSearch = datetime.datetime.strptime(dateString, "%d%m%Y").date()
    except:
        return Response({"error":"invalid date"})
    bookings = Booking.objects.filter(date = dateOfSearch, room = room)

    # serialize this data {{start, end, duration, booked_person}}

    booking_dict = {}

    for index, booking in enumerate(bookings):
        booking_dict[index] = {
            "username" : booking.user.user.first_name + " " + booking.user.user.last_name,
            "start" : booking.start,
            "end" : booking.end,
            "notes" : booking.event
        }

    return Response(booking_dict)

# @api_view(['GET'])


def is_time_valid(date, start_time, end_time):
    pass

@api_view(['POST'])
def book_a_room(request, room_id, year, month, day, start_hour, start_minute, end_hour, end_minute):
    convert_time = lambda x: datetime.datetime(x, '%H:%M').time()

    try:
        start_time = convert_time(start_hour + ":" + start_minute)
        end_time = convert_time(end_hour + ':' + end_minute)
        dateString = day + month + year
        dateOfSearch = datetime.datetime.strptime(dateString, "%d%m%Y").date()
    except:
        return Response({"error" : "Invalid time/date given"})



    if request.method == 'POST':
        pass
    return Response({"success":"success"})


@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        print(request.POST)
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(username = username, password = password)

        if user is not None:
            print("user is authenticated idiot")
            return Response({"success": True})
        else:
            print("user isnt")
            return Response({"success": "username password dont match mate"})

    return Response({"success":False})


