from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import *
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
import datetime
from django.contrib.auth import authenticate
from django.shortcuts import render
# Create your views here.
closing_time = {"weekend":datetime.time(18, 0), "week":datetime.time(21, 0)}
opening_time = { "weekend": datetime.time(9, 0), "week":datetime.time(8, 0)}

@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((permissions.IsAuthenticated,))
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
    bookings.extend(BookingSociety.object.filter(date=dateOfSearch, room=room))
    # serialize this data {{start, end, duration, booked_person}}

    booking_dict = {}

    for index, booking in enumerate(bookings):
        booking_dict[index] = {
            "username" : booking.user.user.first_name + " " + booking.user.user.last_name,
            "start" : booking.start,
            "end" : booking.end,
            "notes" : booking.remarks if type(booking) is Booking else booking.remarks + " -"+ booking.society
        }

    return Response(booking_dict)

# @api_view(['GET'])


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


#only people in group 3 and 4 can access this
@api_view(['POST'])
def book_a_room_society(request):
    if request.mehtod == 'POST':
        try:
            room_id = request.POST["room_id"]
            day = request.POST["day"] #DD
            month = request.POST["month"] #MM
            year = request.POST["year"] #YYYY
            start_time = request.POST["start_time"] #HH:MM
            end_time = request.POST["end_time"]
            society = request.POST["society"]
            event_name = request.POST["event_name"]
        except:
            return Response({"error":"post request data parsing failed"})

        try:
            room = Room.objects.get(room=room_id)
        except:
            return Response({"error": "room_id does not exist"})

        return book_a_room(request, room, year, month, day, start_time, end_time, is_society_booking = True, meta_data ={"event_name" : event_name, "society":society})


# people in any group can access this
# -- IMPORTANT -->  Check careers team access before reducing the quota user.groups.exist("careers_team") or something
@api_view(['POST'])
def book_a_room_normal(request):
    if request.method == 'POST':
        try:
            room_id = request.POST["room_id"]
            day = request.POST["day"]  # DD
            month = request.POST["month"]  # MM
            year = request.POST["year"]  # YYYY
            start_time = request.POST["start_time"]  # HH:MM
            end_time = request.POST["end_time"]
            notes = request.POST["notes"]
        except:
            return Response({"error": "post request data parsing failed"})

        try:
            room = Room.objects.filter(room=room_id, indiv_bookable=True)[0]
        except:
            return Response({"error": "No permission to acces this room / or room_id does not exist"})

        return book_a_room(request, room, year, month, day, start_time, end_time, is_society_booking=False, meta_data = {"notes" : notes})

def book_a_room(request, room, year, month, day, start_time, end_time, is_society_booking, meta_data):

    current_user = request.user.user_profile
    convert_time = lambda x: datetime.datetime(x, '%H:%M').time()


    ## Once the new Booking model is migrated, copy the below snippet to duplicate function for society bookings
    ## and move the rest of the functions to a general function body with society booking as a parameter

    # when fetching the rooms list, check if we are booking for society or normal,
    # and use double filters to get rooms from the database

    try:
        start_time = convert_time(start_time)
        end_time = convert_time(end_time)
        dateString = day + month + year
        dateOfSearch = datetime.datetime.strptime(dateString, "%d%m%Y").date()
    except:
        return Response({"error" : "Invalid time/date given"})

    if is_time_valid(dateOfSearch, start_time, end_time)["success"]:
        if checkAvailability(room, dateOfSearch, start_time, end_time)["success"]:
            return _book_room(current_user, room, dateOfSearch, start_time, end_time, is_society_booking, meta_data)
        else:
            return Response()
    else:
        return Response(is_time_valid(dateOfSearch, start_time, end_time)["error"])


## implement quota reduction in this function and  appropriate restrictions and return messages
def _book_room(current_user, room, dateOfSearch, start_time, end_time, is_society_booking, meta_data):
    if is_society_booking:
        instance = BookingSociety(
            user = current_user,
            room = room,
            date = dateOfSearch,
            start = start_time,
            end = end_time,
            society_name = current_user.associated_society,
            event_name = meta_data["event_name"]
        )
        instance.save()
        return Response({"success": True})
    else:
        instance = Booking(
            user = current_user,
            room = room,
            date = dateOfSearch,
            start = start_time,
            end = end_time,
            remarks = meta_data["notes"]
        )
        instance.save()
        return Response({"success": True})

def weekOrWeekend(date):
    return "weekend" if date.weekday() in [5, 6] else "week"

def is_time_valid(date, start_time, end_time):
    if end_time >= start_time:
        return {"success": False, "error":{"error":"Invalid times given"}}

    dayMode = weekOrWeekend(date)

    if end_time > closing_time[dayMode]:
        return {"success":False, "error":{"error":"Choose an end time before closing time"}}

    if start_time < opening_time[dayMode]:
        return {"success":False, "error":{"error":"Choose a starting time after opening time"}}

    return {"success" : True}

def checkAvailability(room, date, start_time, end_time):

    soc_bookings = BookingSociety.objects.filter(room = room, date = date)
    normal_bookings = Booking.objects.filter(room = room, date = date)

    booking_times = list(map(lambda k: (k.start, k.end), (soc_bookings + normal_bookings)))

    for booking in booking_times:
        if (booking[0] <= start_time <= booking[1]) or (booking[0] <= end_time <= booking[1]):
            return {"success":False, "error":{"error":"this slot is already booked"}}

    return {"success":True}


## parameters are => date: YYYYMMDD
@api_view(['GET'])
def get_users_booking(request):
    try:
        date = request.GET.get("date")
    except:
        return Response({"error":"No parameters found"})

    try:
        date = datetime.datetime.strptime(date, "%Y%m%d").date()
    except:
        return Response({"error":"invalid dates given"})

    current_user = request.user.user_profile

    bookings = Booking.objects.filter(date = date, user = current_user)


    ## ---IMPORTANT -- change this to access permissions once the persmission groups are created
    ## add booking id to the field
    if current_user.society_access:
        bookings.extend(BookingSociety.objects.filter(date = date, user = current_user))

    #serialize the data and send it back
    retDict = {}
    for index, booking in enumerate(bookings):
        retDict[1] = {
            "username": booking.user.user.first_name + " " + booking.user.user.last_name,
            "start" : booking.start,
            "end": booking.end,
            "notes": booking.remarks if type(booking) is Booking else booking.remarks + " -" + booking.society
        }

    return Response(retDict)



def web_app(request):
    return render(request, 'index.html')
