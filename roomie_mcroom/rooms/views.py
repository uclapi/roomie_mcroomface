from .authentication import ExpiringTokenAuthentication, ValidatingTokenAuthentication
from .custom_permission import *
from .models import *
from .mailgun_keys import key, sandbox

import datetime
import requests
import pytz

from django.contrib.auth import authenticate, logout
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.models import Group
from django.shortcuts import render
from django.template.context_processors import csrf

from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response


# Create your views here.
closing_time = {"weekend": datetime.time(18, 0), "week": datetime.time(21, 0)}
opening_time = {"weekend": datetime.time(9, 0), "week": datetime.time(8, 0)}


@api_view(['GET', 'POST'])
def no_access(request):
    return Response({"error": "You do not have appropiate permissions."})


@api_view(['GET', 'POST'])
def set_password(request):
    if request.method == 'GET':
        param = request.GET.get("uid", '')
        if not param:
            return Response({"error": "user_id or password isn't found"})
        return render(request, 'set_password.html', {
                      'param': param, 'csrf_token': csrf(request)['csrf_token']})

    else:
        # getting the uuid of verifier object
        param = request.POST.get("uuid", '')
        new_password = request.POST.get("password", '')

        if not param or not new_password:
            return Response({"error": "user_id or password isn't found"})

        try:
            verifier = Verifier.objects.get(param=param)
        except:
            return Response({"error": "404 verifier object not found"})

        # retrieve the user profile object from the verifier object
        user_profile = UserProfile.objects.get(id=verifier.user_id)

        user_profile.user.set_password(new_password)
        user_profile.user.save()
        user_profile.save()

        # delete the verifier object
        verifier.delete()

        return Response({'success': "Your password has been set"})


@api_view(['GET'])
def forgot_password(request):
    email = request.GET.get('email', '')
    if not email:
        return Response({'error': "email not provided"})

    try:
        us = User.objects.get(email=email)
    except:
        return Response({"error": "email not found"})

    # getting the UserProfile object
    up = us.user_profile

    # creating a temporary verifier
    verifier = Verifier()
    verifier.user_id = up.id
    verifier.save()

    # sending the email
    password_setting_link = "http://127.0.0.1:8000/set_password?uid={}".format(
        verifier.param)
    request = requests.post('https://api.mailgun.net/v3/{}/messages'.format(sandbox), auth=('api', key), data={
        'from': 'hello@example.com',
        'to': email,
        'subject': 'Hello',
        'text': 'Click on {} to set your password'.format(password_setting_link)
    })

    if request.status_code == 200:
        return Response({'success': "Check your email"})
    else:
        return Response({'error': "Email not sent {}".format(request.text)})


@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication, ValidatingTokenAuthentication))
@permission_classes((permissions.IsAuthenticated,))
def get_rooms_list(request):
    print(request.user)
    print(request.auth)
    rooms = Room.objects.all()
    room_dict = {}
    for index, room in enumerate(rooms):
        room_dict[index] = {
            "capacity": room.capacity,
            "coffee": room.coffee,
            "water_fountain": room.water_fountain,
            "room_name": room.name,
            "individual_access": room.indiv_bookable,
            "printers": room.printers,
            "room_id": room.room_id
        }

    return Response(room_dict)


# permission class needs to include group 4
@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication, ValidatingTokenAuthentication))
@permission_classes((permissions.IsAuthenticated,))
@permission_required('rooms.can_generate_tokens')
def obtain_expiring_auth_token(request):
    local_tz = pytz.timezone('Europe/Moscow')
    # change this => get user's associated society, and use that to create tokens
    # hopefully one person can only be in one society lmao
    try:
        soc_id = request.GET.get("society_id")
    except:
        return Response({"error": "society_id couldnt be found"})

    try:
        society = User.objects.get(username=soc_id)
    except:
        return Response({"error":"society id doesnt exist"})

    if society.user_profile not in request.user.user_profile.associated_society.all():
        return Response({"error": "you dont belong to this society"})

    token, created = Token.objects.get_or_create(user=society)

    utc_now = datetime.datetime.utcnow() - datetime.timedelta(days=100)
    utc_now = pytz.utc.localize(utc_now, is_dst=None).astimezone(local_tz)

    if not created and token.created < utc_now:
        token.delete()
        token = Token.objects.create(user=society)
        token.created = datetime.datetime.utcnow()
        token.save()

    print(token.key)

    # just for testing non expiring token
    # token = Token.objects.get_or_create(user=request.user)
    # print(token[0].key)

    return Response({'token': token.key})


@api_view(['GET'])
@authentication_classes((BasicAuthentication, SessionAuthentication, ValidatingTokenAuthentication))
@permission_classes((permissions.IsAuthenticated,))
def get_room_bookings(request):
    # two things have to be implemented here
    # 1) make sure this call is from authenticated user
    # 2) then we check if the user is allowed to check this specific room, eg.
    # common rooms

    try:
        room_id = request.GET.get("room_id")
        date = request.GET.get("date")  # YYYY-MM-DD
    except:
        return Response({"error": "room_id/date isn't found"})

    try:
        room = Room.objects.get(room_id=room_id)
    except:
        return Response({"error": "404 room id does not exist"})
    finally:
        pass

    try:
        dateString = date
        dateOfSearch = datetime.datetime.strptime(dateString, "%Y%m%d").date()
    except:
        return Response({"error": "invalid date"})

    bookings = list(Booking.objects.filter(date=dateOfSearch, room=room))
    bookings.extend(
        list(BookingSociety.objects.filter(date=dateOfSearch, room=room)))
    # serialize this data {{start, end, duration, booked_person}}

    booking_dict = {}

    for index, booking in enumerate(bookings):
        booking_dict[index] = {
            "username": (booking.user.user.username + " " + booking.user.user.first_name + " " + booking.user.user.last_name),
            "start": booking.start,
            "end": booking.end,
            "notes": booking.remarks if isinstance(booking, Booking) else booking.remarks + " -" + booking.society.user.first_name
        }

    return Response(booking_dict)


@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        try:
            username = request.POST['username']
            password = request.POST['password']
        except:
            return Response({"error": "username/password is not given"})

        user = authenticate(username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            token.save()
            return Response({
                "email": user.email,
                "quota_left": user.user_profile.quota_left,
                'token': token.key,
                "societies": [[k.user.first_name, k.user.username] for k in user.user_profile.associated_society.all()],
                "groups" : [k.name for k in user.groups.all()]
            })
        else:
            return Response({"success": "username password dont match mate"})

    return Response({"error": "only POST request is allowed"})


@api_view(['GET'])
def password_changed_successfully(request):
    return Response({"success": "thanks bud"})


# the method below can't be called logout, django gets confused. So that's
# why logout_view
@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication, ValidatingTokenAuthentication))
@permission_classes((permissions.IsAuthenticated,))
def logout_view(request):
    if request.method == 'GET':
        token, created = Token.objects.get_or_create(user=request.user)
        token.delete()
        logout(request)
        return Response({"success": "You've logged out"})
    return Response({"success": False})


# only people in group 3 and 4 can access this
@api_view(['POST'])
@authentication_classes((SessionAuthentication, BasicAuthentication, ValidatingTokenAuthentication, ExpiringTokenAuthentication))
@permission_classes((permissions.IsAuthenticated,))
@permission_required('rooms.can_book_society_rooms')
def book_a_room_society(request):
    if request.method == 'POST':
        try:
            room_id = request.POST["room_id"]
            date = request.POST["date"]  # YYYYMMDD
            start_time = request.POST["start_time"]  # HH:MM
            end_time = request.POST["end_time"]
            society = request.POST["society"]  # change this to soc id
            event_name = request.POST["event_name"]
        except:
            return Response({"error": "post request data parsing failed"})

        try:
            soc = User.objects.get(username=society)
        except:
            return Response({"error": "wrong soc id"})

        if soc.user_profile not in request.user.user_profile.associated_society.all():
            return Response({"error": "Permission denied with this society access"})

        try:
            room = Room.objects.get(room_id=room_id)
        except:
            return Response({"error": "room_id does not exist"})

        return book_a_room(request, room, date, start_time, end_time, is_society_booking=True, meta_data={
                           "event_name": event_name, "society": soc.user_profile})


# people in any group can access this
# -- IMPORTANT -->  Check careers team access before reducing the quota user.groups.exist("careers_team") or something
@api_view(['POST'])
@authentication_classes((SessionAuthentication, BasicAuthentication, ValidatingTokenAuthentication))
@permission_classes((permissions.IsAuthenticated,))
@permission_required(('rooms.can_book_normal_rooms'))
def book_a_room_normal(request):
    if request.method == 'POST':
        try:
            room_id = request.POST["room_id"]
            date = request.POST.get("date")  # YYYYMMDD
            start_time = request.POST["start_time"]  # HH:MM
            end_time = request.POST["end_time"]
            notes = request.POST["notes"]
        except:
            return Response({"error": "post request data parsing failed"})

        try:
            room = Room.objects.filter(room_id=room_id, indiv_bookable=True)[0]
        except:
            return Response(
                {"error": "No permission to acces this room / or room_id does not exist"})

        return book_a_room(request, room, date, start_time, end_time,
                           is_society_booking=False, meta_data={"notes": notes})


def book_a_room(request, room, date, start_time,
                end_time, is_society_booking, meta_data):

    current_user = request.user.user_profile
    convert_time = lambda x: datetime.datetime.strptime(x, '%H:%M').time()

    try:
        start_time = convert_time(start_time)
        end_time = convert_time(end_time)
        dateString = date
        dateOfSearch = datetime.datetime.strptime(dateString, "%Y%m%d").date()
    except:
        return Response({"error": "Invalid time/date given"})

    # date validitiy checking
    days_ahead = (dateOfSearch - datetime.datetime.now().date()).days
    if is_society_booking:
        if days_ahead > 21:
            return Response(
                {"error": "Societies are not allowed to book rooms more than 3 weeks in advance"})
    else:
        if current_user.user.groups.filter(name="Group_1").exists():
            if days_ahead > 90:
                return Response(
                    {"error": "not allowed to book more than 60 days in advance"})
        else:
            if days_ahead > 7:
                return Response(
                    {"error": "Not allowed to book more than 7 days in advance"})

    if is_time_valid(dateOfSearch, start_time, end_time)["success"]:
        if checkAvailability(room, dateOfSearch, start_time, end_time)["success"]:
            return _book_room(current_user, room, dateOfSearch,
                              start_time, end_time, is_society_booking, meta_data)
        else:
            return Response({"error": "this slot is already booked"})
    else:
        return Response(is_time_valid(
            dateOfSearch, start_time, end_time)["error"])


# implement quota reduction in this function and  appropriate restrictions
# and return messages
def _book_room(current_user, room, dateOfSearch, start_time,
               end_time, is_society_booking, meta_data):
    # quota checking and reductions
    if not current_user.user.groups.filter(
            name='Group_1').exists() and not is_society_booking:
        minutes = (datetime.datetime.combine(datetime.date.today(), end_time)
                  - datetime.datetime.combine(datetime.date.today(), start_time))
        if (minutes.seconds // 60) > current_user.quota_left:
            return Response({"error": "you don't have enough quota left"})
        else:
            current_user.quota_left -= (minutes.seconds // 60)
            current_user.save()

    if is_society_booking:
        instance = BookingSociety(
            user=current_user,
            room=room,
            date=dateOfSearch,
            start=start_time,
            end=end_time,
            society=meta_data["society"],
            remarks=meta_data["event_name"]
        )
        instance.save()
        return Response({"success": True})
    else:
        instance = Booking(
            user=current_user,
            room=room,
            date=dateOfSearch,
            start=start_time,
            end=end_time,
            remarks=meta_data["notes"]
        )
        instance.save()
        return Response({"success": True})


def weekOrWeekend(date):
    return "weekend" if date.weekday() in [5, 6] else "week"


def is_time_valid(date, start_time, end_time):
    if end_time <= start_time:
        return {"success": False, "error": {"error": "Invalid times given"}}

    dayMode = weekOrWeekend(date)

    if end_time > closing_time[dayMode]:
        return {"success": False, "error": {
            "error": "Choose an end time before closing time"}}

    if start_time < opening_time[dayMode]:
        return {"success": False, "error": {
            "error": "Choose a starting time after opening time"}}

    return {"success": True}


def checkAvailability(room, date, start_time, end_time):

    soc_bookings = BookingSociety.objects.filter(room=room, date=date)
    normal_bookings = Booking.objects.filter(room=room, date=date)

    booking_times = list(map(lambda k: (k.start, k.end),
                             (list(soc_bookings) + list(normal_bookings))))

    for booking in booking_times:
        if (booking[0] <= start_time <= booking[1]) or (
                booking[0] <= end_time <= booking[1]):
            return {"success": False, "error": {"error": "this slot is already booked"}}

    return {"success": True}


# parameters are => date: YYYYMMDD
@api_view(['GET'])
@authentication_classes((BasicAuthentication, SessionAuthentication, ValidatingTokenAuthentication))
@permission_classes((permissions.IsAuthenticated,))
def get_users_booking(request):
    try:
        date = request.GET.get("date")
    except:
        return Response({"error": "No parameters found"})

    try:
        date = datetime.datetime.strptime(date, "%Y%m%d").date()
    except:
        return Response({"error": "invalid dates given"})

    current_user = request.user.user_profile

    bookings = list(Booking.objects.filter(date=date, user=current_user))

    # ---IMPORTANT -- change this to access permissions once the persmission groups are created
    # add booking id to the field
    if current_user.society_access:
        bookings.extend(
            list(BookingSociety.objects.filter(date=date, user=current_user)))
    # serialize the data and send it back
    retDict = {}
    for index, booking in enumerate(bookings):
        retDict[index] = {
            "username": booking.user.user.first_name + " " + booking.user.user.last_name,
            "start": booking.start,
            "end": booking.end,
            "booking_id": booking.booking_id,
            "notes": booking.remarks if isinstance(booking, Booking) else booking.remarks + " -" + booking.society.user.first_name
        }

    return Response(retDict)


@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication, ValidatingTokenAuthentication))
@permission_classes((permissions.IsAuthenticated,))
def delete_booking(request):
    print(request.GET)
    try:
        id = request.GET.get("booking_id")
    except:
        return Response({"error": "no \"booking_id\" found"})

    try:
        booking = Booking.objects.get(booking_id=id)
    except:
        try:
            booking = BookingSociety.objects.get(booking_id=id)
        except:
            return Response({"error": "booking not found"})

    if request.user.user_profile != booking.user:
        return Response(
            {"error": "you are not the one who booked this room mate"})
    booking.delete()
    return Response({"success": True})


@api_view(['POST'])
@authentication_classes((SessionAuthentication, BasicAuthentication, ValidatingTokenAuthentication))
@permission_classes((permissions.IsAuthenticated,))
@permission_required('rooms.can_add_and_remove_people_to_group_3')
def add_user_to_group3(request):
    current_user = request.user.user_profile

    try:
        username = request.POST.get("username")
        soc_id = request.POST.get("society_id")
    except:
        return Response({"error": "parsing data failed"})

    try:
        society = User.objects.get(username = soc_id)
    except:
        return Response({"error":"society id doesnt exist"})


    try:
        user = User.objects.get(username=username)
    except:
        return Response({"error": "username doesn't exist"})

    if society.user_profile not in current_user.associated_society.all():
        return Response({"error" : "you dont belong to this society"})

    group_3 = Group.objects.get(name='Group_3')
    user.groups.add(group_3)
    user.user_profile.associated_society.add(society.user_profile)
    user.user_profile.society_access = True
    user.user_profile.save()
    user.save()
    return Response({"success": "Successfully added " +
                     username + " to society access groups!"})


@api_view(['POST'])
@authentication_classes((SessionAuthentication, BasicAuthentication, ValidatingTokenAuthentication))
@permission_classes((permissions.IsAuthenticated,))
@permission_required('rooms.can_add_and_remove_people_to_group_3')
def remove_user_from_group3(request):
    current_user = request.user
    try:
        username = request.POST.get("username")
        soc_id = request.POST.get("society_id")
    except:
        return Response({"error": "data parsing failed"})

    try:
        user = User.objects.get(username=username)
    except:
        return Response({"error": "username doesn't exist"})

    try:
        society = User.objects.get(username = soc_id)
    except:
        return Response({"error":"society id doesnt exist"})

    if society.user_profile not in current_user.associated_society.all():
        return Response({"error" : "you dont belong to this society"})

    user.user_profile.associated_society.remove(society.user_profile)
    # assuming president only belongs to one society
    user.user_profile.save()
    user.save()

    if len(user.user_profile.associated_society.all()) == 0:
        group_3 = Group.objects.get(name='Group_3')

        try:
            group_3.user_set.remove(user)
        except:
            return Response({"error": "user wasn't in Group 3"})

        user.user_profile.society_access = False
        user.user_profile.save()
        user.save()
    return Response({"success": True})
