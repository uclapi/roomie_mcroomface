---
title: Roomie McRoomFace API Reference

language_tabs:
  - shell
  - python
  - javascript

toc_footers:
  - <a href='#'>Sign Up for a Developer Key</a>
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>

includes:
  - errors
  - contributing

---

# Log in a user
### `/login`

This endpoint allows a user to login to the API. You *must* login to access all other endpoints.

## Query Parameters 


```shell
curl --data "username=wil&password=wilpassword" http://127.0.0.1:8000/login
```

```python
import requests

data = {"username":"wil", "password":"wilpassword"}

requests.post("http://127.0.0.1:8000/login", data=data)
```

```javascript
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://127.0.0.1:8000/login', true);
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send('username=wil&password=wilpassword');

// response from the server
xhr.responseText;
```

**Restrictions:** `nill`

**Allowed request type:** `POST`


Parameter | Type | Description
--------- | ---------- | -----------
user | `string` | This will be the user's email address.
password | `String`| The user's password.

## Response

> Response

```json
{
    "groups": [
        "Group_3",
        "Group_2",
        "Group_4"
    ],
    "email": "wil@wil.com",
    "token": "57087bd9cc3cde97515a66bc0b58d29696063fd5",
    "societies": [
        [
            "UCLU Technology Society",
            "SOTECHSOC"
        ]
    ],
    "quota_left": 120
}
```

Field | Type | Description
--------- | ---------- | -----------
groups | `List` | This list contains all the groups the user is a part of.
email | `String` | The user's email.
token | `String` | This token is valid until the user logs out. If the user doesn't log out, the token remains valid.
societies | `List` | Each item in the list contains the society's name along with the identifer code for the society.

Upon successful login, you'll recieve a token in the response which expires if you log out. (If you don't log out, it won't expire).

This will allow you to use all other endpoints provided by this API.

You'll also be able to see all the groups that you (the user) belong to as well as any societies.

Finally, your remaining quota is provided in the response (`quota_left`) too. Every user has 180 minutes per week which is reset at 3am every Monday. The minutes **do not** carry over.

# Get list of rooms 

### `/get_list_of_rooms` 

This endpoint returns a list of all the rooms available in the Engineering hub.

## Query Parameters 

```shell
curl http://127.0.0.1:8000/get_list_of_rooms -u wil:wilpassword

#authenticate with token
curl http://127.0.0.1:8000/get_list_of_rooms -H 'Authorization: Token <auth_token_here>'
```

```python
import requests
#with username and password
r = requests.get("http://127.0.0.1:8000/get_list_of_rooms", auth=requests.auth.HTTPBasicAuth('wil', 'wilpassword'))

#with token
r = requests.get("http://127.0.0.1:8000/get_list_of_rooms", headers = {"Authorization":"Token 57087bd9cc3cde97515a
66bc0b58d29696063fd5"})
```

```javascript
// username & password


// token
var xhr = new XMLHttpRequest();
xhr.open('GET', "http://127.0.0.1:8000/get_list_of_rooms", true);
xhr.setRequestHeader('Authorization', 'Token <auth_token_here>');
xhr.send();

// response from the server
xhr.responseText;
```

**Restrictions:** `nill`

**Allowed request type:** `GET`


No parameters are required as long.

## Response

> Response

```json
[
    {
        "room_id": "RO-PIZZA",
        "printers": true,
        "capacity": 10,
        "room_name": "G01",
        "individual_access": false,
        "water_fountain": false,
        "coffee": false
    }
]
```

Field | Type | Description
--------- | ---------- | -----------
room_id | `String` | The identifer for the room. This should be used when booking a room. 
printers | Boolean | Does the room have a printer or not?
capacity | 10 | The number of people that can fit in the room.
room_name | `String` | The actual name of the room.
individual_access | Boolean | If this is false, this room can only be booked by with society access (group3 / group4).
water_fountain | Boolean | If you this is true, congratulations, you've found a very rare room in UCL that has a water fountain.
Coffee | Boolean | Whether or not this room has a coffee machine.


# Get timetable for room 
### `/get_room_bookings`
This endpoint returns the timetable for the room on a given day.

## Parameters

```shell
curl "http://127.0.0.1:8000/get_room_bookings?room_id=RO-PIZZA&date=20160808" -u wil:wilpassword

curl "http://127.0.0.1:8000/get_room_bookings?room_id=RO-PIZZA&date=20160808" -H 'Authorization: Token <auth_token_here>'
```
```python
import requests

params = {"room_id":"RO-PIZZA", "date":"20160808"}

# You can use both methods for authentication here
r = requests.get("http://127.0.0.1:8000/get_room_bookings", params=params, headers=headers)

```

```javascript

// headers
var xhr = new XMLHttpRequest();
xhr.open('GET', "http://127.0.0.1:8000/get_room_bookings?room_id=RO-PIZZA&date=20160808", true);
xhr.setRequestHeader('Authorization', 'Token <auth_token_here>');
xhr.send();

// response from the server
xhr.responseText;
```

**Restrictions:** Only authenticated users can make a request  

**Allowed request types:** `GET`

Parameter | Type | Description
--------- | ---------- | -----------
`room_id` | `String` | The room id (not to be confused with the room name)
`date` | `String`| The date must be entered in _YYYYMMDD_ format.

##Response 

> Response

```json
[
    {
        "username": "emily emily emellee",
        "notes": "yoyoy -UCLU Technology Society",
        "end": "13:00:00",
        "start": "11:00:00"
    }
]
```

Field | Type | Description
--------- | ---------- | -----------
username | `String` | The username of the person who booked this.
notes | `String`| Any notes given regarding the booking.
start | `String` | Start of booking in HH:MM:SS format
end | `String` | End of booking in HH:MM:SS format

# Book normal rooms

### `/book_room_normal`
This end point allows the user to book rooms available to everybody. 
## Parameters

**Restrictions** : Any authenticated user can make room bookings, except for token based authentications, see [REF]

**Allowed request type:** `POST` 

```shell
curl http://127.0.0.1:8000/book_room_normal
    --data "room_id=RO-POO&date=20160808&start_time=15:00&end_time=17:00&notes=this is an event"
    -u rema:remapassword


curl http://127.0.0.1:8000/book_room_normal
    --data "room_id=RO-POO&date=20160808&start_time=15:00&end_time=17:00&notes=this is an event"
    -H 'Authorization: Token <auth_token_here>'   
```

```python
import requests

data = {
    "room_id" : "RO-POO",
    "data" : "20160808",
    "start_time" : "15:00",
    "end_time" : "17:00",
    "notes" : "This is an event" 
}

#You can use both methods for authentication here

r = requests.post(url, data=data, headers=headers)
```

```javascript
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://127.0.0.1:8000/book_room_normal', true);
xhr.setRequestHeader('Authorization', 'Token <auth_token_here>');
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send("room_id=RO-POO&date=20160808&start_time=15:00&end_time=17:00&notes=this is an event");

// response from the server
xhr.responseText

```

Parameter | Type | Description
--------- | ---------- | -----------
`room_id` | `String` | The room id (not to be confused with the room name)
`date` | `String`| The date must be entered in _YYYYMMDD_ format.
`start_time` | `String` | The time booking starts. The format must be HH:MM 
`end_time` | `String` | The time booking ends. The format must be HH:MM 

## Response 

> Response

```json
{
    "success": true
}
```

> or appropriate error message

```json
{
    "error": "error message"
}
```
There are two possible responses: 

`success` -> Booking has been made.

or

`error` -> A message providing a reason will be given.

After the request is confirmed, mintues will be taken away from your quota and you will recieve a booking id in the response. 

# Book a society room
### `/book_room_society`
This endpoint allows society presidents or authorised members to book special society rooms. 

## Request Parameters

**Restrictions:** Only users in group3 can use this endpoint and token authenticated requests 

**Allowed request type:** `POST`  

```shell
curl http://127.0.0.1:8000/book_room_society
    --data "room_id=RO-POO&date=20160808&start_time=15:00&end_time=17:00&event_name=techandtell&society=SOTECHSOC"
    -u rema:remapassword

curl http://127.0.0.1:8000/book_room_society
    --data "room_id=RO-POO&date=20160808&start_time=15:00&end_time=17:00&event_name=techandtell&society=SOTECHSOC"
    -H 'Authorization: Token <auth_token_here>' 
```
```python
import requests

data = {
    "room_id" : "RO-POO",
    "data" : "20160808",
    "start_time" : "15:00",
    "end_time" : "17:00",
    "event_name" : "Weekly meeting",
    "society" : "SOTECHSOC"
}

#You can use both methods for authentication here

r = requests.post(url, data=data, headers=headers)
```

```javascript
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://127.0.0.1:8000/book_room_society', true);
xhr.setRequestHeader('Authorization', 'Token <auth_token_here>');
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send("room_id=RO-POO&date=20160808&start_time=15:00&end_time=17:00&event_name=techandtell&society=SOTECHSOC");

// response from the server
xhr.responseText
```

Parameter | Type | Description
--------- | ---------- | -----------
`room_id` | `String` | The room id (not to be confused with the room name)
`date` | `String`| The date must be entered in _YYYYMMDD_ format.
`start_time` | `String` | The time booking starts. The format must be HH:MM 
`end_time` | `String` | The time booking ends. The format must be HH:MM 

## Response
> Response

```json
{
    "success": true
}
```

> or appropriate error message

```json
{
    "error": "error message"
}
```
There are two possible responses: 

`success` -> Booking has been made.

or

`error` -> A message providing a reason will be given.

# Get all bookings from a user
###: `/get_users_booking`

This endpoint shows all the rooms the logged-in user has booked.
## Request Parameters: 

**Restrictions:** Only authenticated users are allowed  
**Allowed request type:** `GET` 


```shell
curl http://127.0.0.1:8000/get_users_booking?date=20160808 -u rema:remapassword

curl http://127.0.0.1:8000/get_users_booking?date=20160808 -H 'Authorization: Token <auth_token_here>' 

```

```python 
import requests

params = {"date" : "20160808"}

#You can use both methods for authentication here

r = requests.get(url, params=params)

```

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', "http://127.0.0.1:8000/get_users_booking?date=20160808", true);
xhr.setRequestHeader('Authorization', 'Token <auth_token_here>');
xhr.send();

// response from the server
xhr.responseText;
```

Parameter | Type | Description
--------- | ---------- | -----------
date | `String` | The date in _YYYYMMDD_ format

## Response 

> Response

```json
[
    {
        "end": "17:00:00",
        "username": "rema boo",
        "notes": "book",
        "booking_id": "21cf0a17-4b64-4a5f-9a0e-9381d4195af1",
        "start": "15:00:00"
    }
]
```
> or appropriate error message

```json
{
    "error": "error message"
}
```

Field | Type | Description
--------- | ---------- | -----------
username | `String` | The username of the person who booked this.
notes | `String`| Any notes given regarding the booking.
start | `String` | Start of booking in HH:MM:SS format
end | `String` | End of booking in HH:MM:SS format
booking_id | `String` | The id associated with the booking


All bookings on that date by user which is logged in. You cannot see other users data.

# Get token
### `/token`
This endpoint allows a society president to access a token which can be then used to allow other members of his/her society to book as part of a society.

## Request Parameters


```shell
curl http://127.0.0.1:8000/token/?society_id=SOTECHSOC -u wil:wilpassword

curl http://127.0.0.1:8000/token/?society_id=SOTECHSOC -H 'Authorization: Token <auth_token_here>' 
```

```python
import requests

r = requests.get(url, params={"society_id":"SOTECHSOC"}, headers=headers)

```

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', "http://127.0.0.1:8000/token?society_id=SOTECHSOC", true);
xhr.setRequestHeader('Authorization', 'Token <auth_token_here>');
xhr.send();

// response from the server
xhr.responseText;
```

Parameter | Type | Description
--------- | ---------- | -----------
society_id | `String` | Society-ID eg.`SO-XXXXXX`

**Allowed request type:** GET  

**Restrictions:** Only Group4 Users can access this (Society Predidents) 


## Response Parameters

> Response

```json
{
    "token":"token"
}
```
Field| Type | Description
--------- | ---------- | -----------
token| `String` | Token to authorise others to book rooms as a society.


This endpoint creates a token on behalf of the society, valid for 100 days. The society leader can regenerates this token at any point causing the previous token to expire. Only 1 token is valid at any time.

This code can be given to anybody and can be used to book society rooms.

GET FAIZ TO ADD HEADER FOR THE TOKEN LMAO

#Delete a booking
### `/delete_booking`
This allows users to delete a booking they have already booked.

## Request Parameters

**Restrictions:** Only object owner can delete the booking and user has to be authenticated  

**Allowed request type:** `GET`  

```shell
curl http:127.0.0.1:8000/delete_booking?booking_id=21cf0a17-4b64-4a5f-9a0e-9381d4195af1
    -u rema:remapassword

curl http:127.0.0.1:8000/delete_booking?booking_id=21cf0a17-4b64-4a5f-9a0e-9381d4195af1
-H 'Authorization: Token <auth_token_here>'     
```

```python
import requests

params = {"booking_id" : "XXXX-XXXX-XXXXX"}

r = requests.get(url, params=params, headers=headers)

```

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', "http://127.0.0.1:8000/delete_booking?booking_id=21cf0a17-4b64-4a5f-9a0e-9381d4195af1", true);
xhr.setRequestHeader('Authorization', 'Token <auth_token_here>');
xhr.send();

// response from the server
xhr.responseText;
```

Parameter | Type | Description
--------- | ---------- | -----------
booking_id| `String` | The booking id associated with the room booking

## Response 

> Response

```json
{
    "token":"token"
}
```

> or error message

```json
{
    "error" : "blah blah"
}
```

Once the booking is deleted, the length of the booking will be added back to the users quota.
 
# Give normal users society access
### `/add_user_to_group3`

This endpoint allows society presidents to give access to other students and allow them to be included in group 3.

## Request Parameters

**Restriction:** Only Group4 users have access to this 

**Allowed request type:** `POST`  

```shell
curl --data "username=rema" http://127.0.0.1:8000/add_user_to_group3?society_id=SOTECHSOC -u wil:wilpassword

curl --data "username=rema&society_id=SOTECHSOC" http://127.0.0.1:8000/add_user_to_group3 -H 'Authorization: Token <auth_token_here>' 
```

```python 
import requests

data = {
    "society_id" : "SOTECHSOC",
    "username" : "rema"
}

r = requests.post(url, data=data, headers=headers)
```

```javascript
var xhr = new XMLHttpRequest();
xhr.open('POST', "http://127.0.0.1:8000/add_user_to_group3", true);
xhr.setRequestHeader('Authorization', 'Token <auth_token_here>');
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send("username=rema&society_id=SOTECHSOC");

// response from the server
xhr.responseText;
```

Parameter | Type | Description
--------- | ---------- | -----------
username | `string` | This will be the user's email address.


## Response 

> Response

```json
{
    "success": "Successfully added rema boo to society access groups!"
}
```



# Remove normal user's society access
### `/delete_user_from_group3`
This endpoint removes user from group3 , denying them society room booking powers. 
## Request Parameters

**Restriction:** Only Group4 users have access to this 

**Allowed request type:** `POST`  


```shell
curl --data "username=rema&society_id=SOTECHSOC" http://127.0.0.1:8000/delete_user_from_group3?society_id=SOCTECHSOC -u wil:wilpassword

curl --data "username=rema&society_id=SOTECHSOC" http://127.0.0.1:8000/delete_user_from_group3 'Authorization: Token <auth_token_here>'
```

```python
import requests

data = {
    "society_id" : "SOTECHSOC",
    "username" : "rema"
}

r = requests.post(url, data=data, headers=headers)
```

```javascript
var xhr = new XMLHttpRequest();
xhr.open('POST', "http://127.0.0.1:8000/delete_user_from_group3", true);
xhr.setRequestHeader('Authorization', 'Token <auth_token_here>');
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send("username=rema&society_id=SOTECHSOC");

// response from the server
xhr.responseText;
```
Parameter | Type | Description
--------- | ---------- | -----------
username | `string` | This will be the user's email address.


# Response 

> Response

```json
{
    "success": true
}
```


# Logout a user
### `/logout`
This end point logs a user out of the API so they can no longer make requests. They must log back in.

## Request Parameters

**Restrictions: `nill`**

**Allowed request types:** `GET`  

```shell
curl http://127.0.0.1:8000/logout -u username:password

curl http://127.0.0.1:8000/logout 'Authorization: Token <auth_token_here>'
```

```python
import requests

r = requests.get(url, headers=headers)

```

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', "http://127.0.0.1:8000/logout", true);
xhr.setRequestHeader('Authorization', 'Token <auth_token_here>');
xhr.send();

// response from the server
xhr.responseText;
```

Parameter | Type | Description
--------- | ---------- | -----------
user | `string` | This will be the user's email address.
password | `String`| The user's password.

> Response

```json
{
    "success": true
}
```


Feel free to make users and test them from admin interface localhost:8000/admin  username: admin, password: adminpassword


Some test users I made:
    wil, wilpassword -> Group2, Group3, Group4
    moynappa, moynappapassword -> Group2, Group3, Group4
    rema, remapassword -> Group2 only I think
    emily, emilypassword -> Group2 only
    matt, mattpassword -> Group2
    vicky, vickypassword -> Group2


