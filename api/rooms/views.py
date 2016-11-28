from .authentication import ExpiringTokenAuthentication, \
    ValidatingTokenAuthentication
from .models import Booking, BookingSociety, UserProfile, Room, Verifier, \
    ShibLoginToken

import datetime
import pytz
import json

import requests

import urllib.parse
import urllib.request

from django.contrib.auth import authenticate, logout
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.models import Group, User
from django.shortcuts import render
from django.template.context_processors import csrf
from django.http import HttpResponse

from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, \
    authentication_classes
from rest_framework.response import Response

from constants import *

from . import utils


@api_view(['GET', 'POST'])
def no_access(request):
    return Response({"error": "You do not have appropiate permissions."})


@api_view(['GET'])
@authentication_classes(
    (SessionAuthentication, ValidatingTokenAuthentication)
)
@permission_classes((permissions.IsAuthenticated,))
def get_rooms_list(request):
    rooms = Room.objects.all()
    room_dict = []
    for room in rooms:
        room_dict.append({
            "capacity": room.capacity,
            "coffee": room.coffee,
            "water_fountain": room.water_fountain,
            "room_name": room.name,
            "individual_access": room.indiv_bookable,
            "printers": room.printers,
            "room_id": room.room_id
        })

    return Response(room_dict)


@api_view(['GET'])
@authentication_classes(
    (SessionAuthentication, ValidatingTokenAuthentication)
)
@permission_classes((permissions.IsAuthenticated,))
@permission_required('rooms.can_generate_tokens', raise_exception=True)
def obtain_expiring_auth_token(request):
    local_tz = pytz.timezone('Europe/Moscow')

    try:
        soc_id = request.GET.get("society_id")
    except:
        return Response({"error": "Society ID could not be found."})

    try:
        society = User.objects.get(username=soc_id)
    except:
        return Response({"error": "Society ID does not exist."})

    if (
        society.user_profile not in
        request.user.user_profile.associated_society.all()
    ):
        return Response({"error": "User does not belong to the society."})

    token, created = Token.objects.get_or_create(user=society)

    utc_now = datetime.datetime.utcnow() - datetime.timedelta(days=100)
    utc_now = pytz.utc.localize(utc_now, is_dst=None).astimezone(local_tz)

    if not created and token.created < utc_now:
        token.delete()
        token = Token.objects.create(user=society)
        token.created = datetime.datetime.utcnow()
        token.save()

    return Response({'token': token.key})


@api_view(['GET'])
@authentication_classes(
    (SessionAuthentication, ValidatingTokenAuthentication)
)
@permission_classes((permissions.IsAuthenticated,))
def get_room_bookings(request):
    try:
        room_id = request.GET.get("room_id")
        date = request.GET.get("date")
    except:
        return Response({"error": "Room ID or Date has not been found."})

    try:
        room = Room.objects.get(room_id=room_id)
    except:
        return Response({"error": "Room ID does not exist."})
    finally:
        pass

    try:
        dateString = date
        dateOfSearch = datetime.datetime.strptime(dateString, "%Y%m%d").date()
    except:
        return Response({"error": "Invalid Date has been entered."})

    bookings = list(Booking.objects.filter(date=dateOfSearch, room=room))
    bookings.extend(
        list(BookingSociety.objects.filter(date=dateOfSearch, room=room)))

    booking_dict = []

    for booking in (bookings):
        booking_dict.append({
            "username": (booking.user.user.username),
            "start": booking.start,
            "end": booking.end,
            "notes": booking.remarks if isinstance(booking, Booking) else
            booking.remarks + " -" + booking.society.user.first_name
        })

    return Response(booking_dict)


@api_view(['GET'])
@authentication_classes(
    (SessionAuthentication, ValidatingTokenAuthentication)
)
@permission_classes((permissions.IsAuthenticated,))
def get_user_meta_data(request):
    user = request.user
    return Response({
        "email": user.email,
        "quota_left": user.user_profile.quota_left,
        "societies": [
            [k.user.first_name, k.user.username] for k in
            user.user_profile.associated_society.all()
        ],
        "groups": [k.name for k in user.groups.all()]
    })


@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        try:
            username = request.POST['username']
            password = request.POST['password']
        except:
            return Response({"error": "Username or password not given."})

        user = authenticate(username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            token.save()
            return Response({
                "email": user.email,
                "quota_left": user.user_profile.quota_left,
                'token': token.key,
                "societies": [
                    [k.user.first_name, k.user.username] for k in
                    user.user_profile.associated_society.all()
                ],
                "groups": [k.name for k in user.groups.all()]
            })
        else:
            return Response({"success": "Wrong username or pair!"})

    return Response({"error": "This method accepts only POST requests."})


# FAIZ
@api_view(['GET'])
def login_get_token(request):
    sid = "shib" + utils.random_string(60)

    login_token = ShibLoginToken(sid=sid)
    login_token.save()

    callback_url = ROOT_URL + 'user.login.callback?sid=' + sid

    return Response({
        "loginUrl": SHIB_URL + "Login?target=" +
        urllib.parse.quote_plus(callback_url),
        "callbackUrl": callback_url,
        "sid": sid,
        "stream_sub_url": STREAM_SUBSCRIBE_URL + sid,
        "stream_sub_lp_url": STREAM_SUBSCRIBE_LP_URL + sid
    })


@api_view(['POST'])
def login_status(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        sid = data["sid"]
    except:
        return Response({"error": "No sid supplied"})

    try:
        sid_data = ShibLoginToken.objects.get(sid=sid)
    except:
        return Response({"error": "Invalid sid"})

    if sid_data.status == 0:
        return Response({"success": "OK", "status": "NOT_LOGGED_IN"})
    elif sid_data.status == 1:
        token, created = Token.objects.get_or_create(user=sid_data.user)
        user_data = {
            "email": sid_data.user.email,
            "quota_left": sid_data.user.user_profile.quota_left,
            'token': token.key,
            "societies": [
                [k.user.first_name, k.user.username] for k in
                sid_data.user.user_profile.associated_society.all()
                ],
            "groups": [k.name for k in sid_data.user.groups.all()]
        }
        return Response(
            {
                "success": "OK",
                "status": "LOGGED_IN",
                "user_data": user_data
            })
    else:
        return Response({"success": "OK", "status": "LOGIN_ERROR"})


def login_callback(request):
    try:
        sid = request.GET['sid']
    except:
        return HttpResponse('No sid supplied, so login cannot continue.')

    try:
        sid_data = ShibLoginToken.objects.get(sid=sid)
    except ShibLoginToken.DoesNotExist:
        return HttpResponse('Invalid sid. Please try logging in again.')

    try:
        eppn = request.META['HTTP_EPPN']
        groups = request.META['HTTP_UCLINTRANETGROUPS']
        cn = request.META['HTTP_CN']
        department = request.META['HTTP_DEPARTMENT']
        given_name = request.META['HTTP_GIVENNAME']
        surname = request.META['HTTP_SN']
    except:
        return HttpResponse(
            'No Shibboleth data. This page should not be accessed directly!')

    if "engscifac-ug" not in groups.split(';'):
        login_response = {
            "result": "failure",
            "message": ("This system is available only"
                        " to members of the engineering faculty.")
            }
    else:
        if User.objects.filter(email=eppn).exists():
            user = User.objects.get(email=eppn)
        else:
            User.objects.create_user(
                username=cn,
                email=eppn,
                password=utils.random_string(128),
                first_name=given_name,
                last_name=surname
            )
            user = User.objects.get(email=eppn)
            up = UserProfile(user=user)
            up.department = department
            up.save()

        token, created = Token.objects.get_or_create(user=user)
        token.save()

        login_response = {
            "result": "success",
            "message": "Login successful",
            "email": user.email,
            "quota_left": user.user_profile.quota_left,
            'token': token.key,
            "societies": [
                [k.user.first_name, k.user.username] for k in
                user.user_profile.associated_society.all()
            ],
            "groups": [k.name for k in user.groups.all()]
        }

        try:
            t = ShibLoginToken.objects.get(user=user)
            if t.sid != sid:
                t.delete()
        except ShibLoginToken.DoesNotExist:
            print("User has never tried logging in before, so there was nothing to delete. Continuing...")

        try:
            token = ShibLoginToken.objects.get(sid=sid)
            token.status = 1
            token.user = user
            token.save()
        except Exception as e:
            print("Error updating token in database")
            print(e)

        url = STREAM_PUBLISH_URL + "/?id=" + sid
        try:
            r = requests.post(url, json=login_response)
            print(r.text)
        except:
            print("Error sending the data to stream backend")

    response = HttpResponse(content_type="text/html")
    response.write(login_response)
    return response


@api_view(['GET'])
def login_get_token(request):
    sid = "shib" + utils.random_string(60)

    login_token = ShibLoginToken(sid=sid)
    login_token.save()

    callback_url = ROOT_URL + 'user.login.callback?sid=' + sid

    return Response({
        "loginUrl": SHIB_URL + "Login?target=" +
        urllib.parse.quote_plus(callback_url),
        "callbackUrl": callback_url,
        "sid": sid,
        "stream_sub_url": STREAM_SUBSCRIBE_URL + sid,
        "stream_sub_lp_url": STREAM_SUBSCRIBE_LP_URL + sid
    })


@api_view(['POST'])
def login_status(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        sid = data["sid"]
    except:
        return Response({"error": "No sid supplied"})

    try:
        sid_data = ShibLoginToken.objects.get(sid=sid)
    except:
        return Response({"error": "Invalid sid"})

    if sid_data.status == 0:
        return Response({"success": "OK", "status": "NOT_LOGGED_IN"})
    elif sid_data.status == 1:
        token, created = Token.objects.get_or_create(user=sid_data.user)
        user_data = {
            "email": sid_data.user.email,
            "quota_left": sid_data.user.user_profile.quota_left,
            'token': token.key,
            "societies": [
                [k.user.first_name, k.user.username] for k in
                sid_data.user.user_profile.associated_society.all()
                ],
            "groups": [k.name for k in sid_data.user.groups.all()]
        }
        return Response(
            {
                "success": "OK",
                "status": "LOGGED_IN",
                "user_data": user_data
            })
    else:
        return Response({"success": "OK", "status": "LOGIN_ERROR"})


def login_callback(request):
    try:
        sid = request.GET['sid']
    except:
        return HttpResponse('No sid supplied, so login cannot continue.')

    try:
        sid_data = ShibLoginToken.objects.get(sid=sid)
    except ShibLoginToken.DoesNotExist:
        return HttpResponse('Invalid sid. Please try logging in again.')

    try:
        eppn = request.META['HTTP_EPPN']
        groups = request.META['HTTP_UCLINTRANETGROUPS']
        cn = request.META['HTTP_CN']
        department = request.META['HTTP_DEPARTMENT']
        given_name = request.META['HTTP_GIVENNAME']
        surname = request.META['HTTP_SN']
    except:
        return HttpResponse(
            'No Shibboleth data. This page should not be accessed directly!')

    if "engscifac-ug" not in groups.split(';'):
        login_response = {
            "result": "failure",
            "message": ("This system is available only"
                        " to members of the engineering faculty.")
            }
    else:
        if User.objects.filter(email=eppn).exists():
            user = User.objects.get(email=eppn)
        else:
            User.objects.create_user(
                username=cn,
                email=eppn,
                password=utils.random_string(128),
                first_name=given_name,
                last_name=surname
            )
            user = User.objects.get(email=eppn)
            up = UserProfile(user=user)
            up.department = department
            up.save()

        token, created = Token.objects.get_or_create(user=user)
        token.save()

        login_response = {
            "result": "success",
            "message": "Login successful",
            "email": user.email,
            "quota_left": user.user_profile.quota_left,
            'token': token.key,
            "societies": [
                [k.user.first_name, k.user.username] for k in
                user.user_profile.associated_society.all()
            ],
            "groups": [k.name for k in user.groups.all()]
        }

        try:
            t = ShibLoginToken.objects.get(user=user)
            if t.sid != sid:
                t.delete()
        except ShibLoginToken.DoesNotExist:
            print("User has never tried logging in before, so there was nothing to delete. Continuing...")

        try:
            token = ShibLoginToken.objects.get(sid=sid)
            token.status = 1
            token.user = user
            token.save()
        except Exception as e:
            print("Error updating token in database")
            print(e)

        url = STREAM_PUBLISH_URL + "/?id=" + sid
        try:
            r = requests.post(url, json=login_response)
            print(r.text)
        except:
            print("Error sending the data to stream backend")

    response = HttpResponse(content_type="text/html")
    response.write(login_response)
    return response


@api_view(['GET'])
def password_changed_successfully(request):
    return Response({"success": "thanks bud"})


# this method is called logout_view so that it does not clash with built-in's
# logout() method from django.contrib.auth
@api_view(['GET'])
@authentication_classes(
    (SessionAuthentication, ValidatingTokenAuthentication)
)
@permission_classes((permissions.IsAuthenticated,))
def logout_view(request):
    if request.method == 'GET':
        token, created = Token.objects.get_or_create(user=request.user)
        token.delete()
        logout(request)
        return Response({"success": "You have been logged out."})
    return Response({"success": False})


@api_view(['POST'])
@authentication_classes(
    (SessionAuthentication, ValidatingTokenAuthentication,
     ExpiringTokenAuthentication)
)
@permission_classes((permissions.IsAuthenticated,))
def book_room(request):
    if (request.POST.get("society_booking") == "True" and
            request.user.groups.filter(name='Group_3').exists()):
        try:
            room_id = request.POST["room_id"]
            date = request.POST["date"]
            start_time = request.POST["start_time"]
            end_time = request.POST["end_time"]
            # TODO: change to society ID
            society = request.POST["society"]
            event_name = request.POST["event_name"]
        except:
            return Response({"error": "Could not parse the POST request data."})

        try:
            soc = User.objects.get(username=society)
        except:
            return Response({"error": "Bad society ID."})

        if (
            soc.user_profile not in
            request.user.user_profile.associated_society.all()
        ):
            return Response({
                "error": "Permission denied with this society access."
            })

        try:
            room = Room.objects.get(room_id=room_id)
        except:
            return Response({"error": "Room ID does not exist."})

        return book_a_room(
            request,
            room,
            date,
            start_time,
            end_time,
            is_society_booking=True,
            meta_data={
                "event_name": event_name,
                "society": soc.user_profile
            })
    elif request.POST.get("society_booking") == "False":
        try:
            room_id = request.POST["room_id"]
            date = request.POST["date"]
            start_time = request.POST["start_time"]
            end_time = request.POST["end_time"]
            notes = request.POST["notes"]
        except:
            return Response({"error": "Could not parse the POST request data."})

        try:
            room = Room.objects.filter(room_id=room_id, indiv_bookable=True)[0]
        except:
            return Response({
                "error": ("No permissions to access this room"
                            "or room does not exist.")
                            })

        return book_a_room(request, room, date, start_time, end_time,
                           is_society_booking=False, meta_data={"notes": notes}
                           )
    else:
        return Response(
            {"error": "You don't have permission to book this room"})


def book_a_room(request, room, date, start_time,
                end_time, is_society_booking, meta_data):
    # Only allow block bookings, start time should be HH:01 and end should be
    # HH:00
    if not (start_time[3:] == "01" and end_time[3:] == "00"):
        return Response({
            "error": "Time block should be in the format HH:01 and HH:00."
        })

    current_user = request.user.user_profile

    try:
        start_time = convertTime(start_time)
        end_time = convertTime(end_time)
        dateString = date
        dateOfSearch = datetime.datetime.strptime(dateString, "%Y%m%d").date()
    except:
        return Response({"error": "Invalid date or time given."})

    # date validitiy checking
    days_ahead = (dateOfSearch - datetime.datetime.now().date()).days
    if is_society_booking:
        if days_ahead > 21:
            return Response({
                    "error": ("Societies are not allowed to book rooms"
                            " more than 3 weeks in advance")
                })
    else:
        if current_user.user.groups.filter(name="Group_1").exists():
            if days_ahead > 90:
                return Response(
                    {
                        "error": ("You are not allowed to book"
                                  " more than 60 days in advance.")
                    })
        else:
            if days_ahead > 7:
                return Response({
                    "error": ("You are not allowed to book"
                                " more than 7 days in advance.")
                })

    if is_time_valid(dateOfSearch, start_time, end_time)["success"]:
        if checkAvailability(
                room, dateOfSearch, start_time, end_time)["success"]:
            return _book_room(current_user, room, dateOfSearch,
                              start_time, end_time, is_society_booking,
                              meta_data)
        else:
            return Response({"error": "This slot has already been booked."})
    else:
        return Response(is_time_valid(
            dateOfSearch, start_time, end_time)["error"])


def _book_room(current_user, room, dateOfSearch, start_time,
               end_time, is_society_booking, meta_data):
    # quota checking and reductions
    if not current_user.user.groups.filter(
            name='Group_1').exists() and not is_society_booking:
        minutes = (
            datetime.datetime.combine(datetime.date.today(), end_time) -
            datetime.datetime.combine(datetime.date.today(), start_time))
        if (minutes.seconds // 60) > current_user.quota_left:
            return Response({"error": "You do not have enough quota left."})
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


def is_time_valid(date, start_time, end_time):
    if end_time <= start_time:
        return {"success": False, "error": {"error": "Invalid times given."}}

    dayMode = weekOrWeekend(date)

    if end_time > CLOSING_TIME[dayMode]:
        return {"success": False, "error": {
            "error": "Choose an end time before closing time."}}

    if start_time < OPENING_TIME[dayMode]:
        return {"success": False, "error": {
            "error": "Choose a starting time after opening time."}}

    return {"success": True}


def checkAvailability(room, date, start_time, end_time):

    soc_bookings = BookingSociety.objects.filter(room=room, date=date)
    normal_bookings = Booking.objects.filter(room=room, date=date)

    booking_times = list(map(lambda k: (k.start, k.end),
                             (list(soc_bookings) + list(normal_bookings))))

    for booking in booking_times:
        if (booking[0] <= start_time <= booking[1]) or (
                booking[0] <= end_time <= booking[1]):
            return {
                "success": False,
                "error": {"error": "This slot has already been booked."}
            }

    return {"success": True}


@api_view(['GET'])
@authentication_classes(
    (SessionAuthentication, ValidatingTokenAuthentication)
)
@permission_classes((permissions.IsAuthenticated,))
def get_users_booking(request):

    current_user = request.user.user_profile
    bookings = list(Booking.objects.filter(user=current_user))

    if len(current_user.associated_society.all()):
        bookings.extend(
            list(BookingSociety.objects.filter(user=current_user)))

    # serialize the data and send it back
    retDict = []
    for booking in bookings:
        retDict.append({
            "username": booking.user.user.username,
            "start": booking.start,
            "end": booking.end,
            "booking_id": booking.booking_id,
            "date": booking.date,
            "notes": booking.remarks if isinstance(booking, Booking) else
            booking.remarks + " -" + booking.society.user.first_name
        })

    return Response(retDict)


@api_view(['GET'])
@authentication_classes(
    (SessionAuthentication, ValidatingTokenAuthentication)
)
@permission_classes((permissions.IsAuthenticated,))
def delete_booking(request):
    try:
        id = request.GET.get("booking_id")
    except:
        return Response({"error": "No booking_id has been found."})

    try:
        booking = Booking.objects.get(booking_id=id)
    except:
        try:
            booking = BookingSociety.objects.get(booking_id=id)
        except:
            return Response({"error": "No booking has been found"})

    if request.user.user_profile != booking.user:
        return Response(
            {"error": "The booking does not belong to you."})
    booking.delete()
    return Response({"success": True})


@api_view(['POST'])
@authentication_classes(
    (SessionAuthentication, ValidatingTokenAuthentication)
)
@permission_classes((permissions.IsAuthenticated,))
@permission_required('rooms.can_add_and_remove_people_to_group_3')
def add_user_to_group3(request):
    current_user = request.user

    try:
        username = request.POST.get("username")
        soc_id = request.POST.get("society_id")
    except:
        return Response({"error": "Parsing has failed."})

    try:
        society = User.objects.get(username=soc_id)
    except:
        return Response({"error": "Society ID does not exist."})

    try:
        user = User.objects.get(username=username)
    except:
        return Response({"error": "Username does not exist."})

    if (society.user_profile not in
            current_user.user_profile.associated_society.all()):
        return Response({"error": "You do not belong to this society."})

    group_3 = Group.objects.get(name='Group_3')
    user.groups.add(group_3)
    user.user_profile.associated_society.add(society.user_profile)
    user.user_profile.society_access = True
    user.user_profile.save()
    user.save()
    return Response({"success": "Successfully added " +
                     username + " to society access groups!"})


@api_view(['POST'])
@authentication_classes(
    (SessionAuthentication, ValidatingTokenAuthentication)
)
@permission_classes((permissions.IsAuthenticated,))
@permission_required('rooms.can_add_and_remove_people_to_group_3')
def remove_user_from_group3(request):
    current_user = request.user
    try:
        username = request.POST.get("username")
        soc_id = request.POST.get("society_id")
    except:
        return Response({"error": "Parsing has failed."})

    try:
        user = User.objects.get(username=username)
    except:
        return Response({"error": "Username does not exist."})

    try:
        society = User.objects.get(username=soc_id)
    except:
        return Response({"error": "Society ID does not exist."})

    if (society.user_profile not in
            current_user.user_profile.associated_society.all()):
        return Response({"error": "You do not belong to this society."})

    user.user_profile.associated_society.remove(society.user_profile)
    user.user_profile.save()
    user.save()

    if len(user.user_profile.associated_society.all()) == 0:
        group_3 = Group.objects.get(name='Group_3')

        try:
            group_3.user_set.remove(user)
        except:
            return Response({"error": "User was not in Group3."})

        user.user_profile.society_access = False
        user.user_profile.save()
        user.save()
    return Response({"success": True})
