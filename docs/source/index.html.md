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
## Parameters  

In the post request, you _must_ include these parameters. 

**Restrictions:** `nill`

**Parameters:** _username_; `String`, _password_; `String`

**Allowed request type:** `POST`

Upon successful login, you'll recieve a token in the response which expires if you log out. (If you don't log out, it won't expire).

This will allow you to use all other endpoints provided by this API.

You'll also be able to see all the groups that you (the user) belong to as well as any societies.

Finally, your remaining quota is provided in the response (`quota_left`) too. Every user has 180 minutes per week which is reset at 3am every Monday. The minutes **do not** carry over.



```shell
curl --data "username=wil&password=wilpassword" http://127.0.0.1:8000/login
```

```python
requests.post("http://127.0.0.1:8000/login", params={"username":"wil", "password":"wilpassword"})
```

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
# Get list of rooms 

### `/get_list_of_rooms` 
## Parameters

**Restrictions:** Only authenticated users can make a request  

**Parameters:** `nill`

**Allowed request types:** GET  

In the response, if `individual_access` is `false`, this room is only bookable by societies (group3). 

The response contains information such as  

```shell
curl http:127.0.0.1:8000/get_list_of_rooms
```

> Response

```json
{
    "0": {
        "room_id": "RO-PIZZA",
        "printers": true,
        "capacity": 10,
        "room_name": "G01",
        "individual_access": false,
        "water_fountain": false,
        "coffee": false
    }
}
```

# Get timetable for room 
### `/get_room_bookings`
## Parameters

**Restrictions:** Only authenticated users can make a request  

**Parameters:** room_id:`String`, date:`String` _#YYYYMMDD format_  

**Allowed request types:** `GET`


The room ID must be provided for the room in question. (TBC)


```shell
curl "http://127.0.0.1:8000/get_room_bookings?room_id=RO-PIZZA&date=20160808" -u wil:wilpassword

curl "http://127.0.0.1:8000/get_room_bookings?room_id=RO-PIZZA&date=20160808" -H 'Authorization: Token <auth_token_here>'
```


> Response

```json
{
    "0": {
        "username": "emily emily emellee",
        "notes": "yoyoy -UCLU Technology Society",
        "end": "13:00:00",
        "start": "11:00:00"
    }
}
```


# Book normal rooms

### `/book_room_normal`
## Parameters

**Restrictions** : Any authenticated user can make room bookings, except for token based authentications, see [REF]

**Parameters:** 
room_id;`String`, 

date:`YYYYMMDD`,

start_time:`HH:MM`, 

end_time:`HH:MM`, 

notes:`String`

**Allowed request type:** `POST` 

Everyone is able to book rooms, **all** fields must be provided in the **correct** format.

In the `notes`, provide a reason for why you want to book the room.

If something goes wrong, the response will contain an error message.

After the request is confirmed, mintues will be taken away from your quota and you will recieve a booking id in the response. 

```shell
curl http://127.0.0.1:8000/book_room_normal
    --data "room_id=RO-POO&date=20160808&start_time=15:00&end_time=17:00"
    -u rema:remapassword
```

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

# Book a society room
### `book_room_society`
## Parameters

**Restrictions:** Only users in group3 can use this endpoint and token authenticated requests 

**Parameters:**

room_id:`String`, 

date:`YYYYMMDD`, 

start_time: `HH:MM`, 

end_time: `HH:MM`, 

society: `String`, 

event_name: `String` 

**Allowed request type:** `POST`  

only group3 or group4 can book this (this is society presidents + committee)

all details must be given 


```shell
curl http://127.0.0.1:8000/book_room_normal
    --data "room_id=RO-POO&date=20160808&start_time=15:00&end_time=17:00&event_name=techandtell&society=SOTECHSOC"
    -u rema:remapassword
```

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

# Get all bookings from a user
###: `/get_users_booking`
## Parameters: 

**Restrictions:** Only authenticated users are allowed  
**Parameters:** date:`YYYYMMDD`  
**Allowed request type:** `GET` 

all bookings on that date by _current_ user. can only see yourself

```shell
curl http://127.0.0.1:8000/get_users_booking?date=20160808 -u rema:remapassword
```

> Response

```json
{
    "0": {
        "end": "17:00:00",
        "username": "rema boo",
        "notes": "book",
        "booking_id": "21cf0a17-4b64-4a5f-9a0e-9381d4195af1",
        "start": "15:00:00"
    }
}
```

> or appropriate error message

```json
{
    "error": "error message"
}
```

# Get token
### `/token`
## Parameters

**Restrictions:** Only Group4 Users can access this (Society Predidents) 

**Parameters**: `nill`

**Allowed request type:** GET  

Only presidents can use this endpoint.

This endpoint creates a token on behalf of the society, valid for 100 days. The society leader can regenerates this token at any point causing the previous token to expire. Only 1 token is valid at any time.

This code can be given to anybody and can be used to book society rooms.

GET FAIZ TO ADD HEADER FOR THE TOKEN LMAO

```shell
curl http://127.0.0.1:8000/token/ -u wil:wilpassword
```

> Response

```json
{
    "token":"token"
}
```

#Delete a booking
### `/delete_booking`
## Parameters

**Restrictions:** Only object owner can delete the booking and user has to be authenticated  

**Parameters:** booking_id:`String` 

**Allowed request type:** `GET`  

Once the booking is deleted, the length of the booking will be added back to the users quota.
 

```shell
curl http:127.0.0.1:8000/delete_booking?booking_id=21cf0a17-4b64-4a5f-9a0e-9381d4195af1
    -u rema:remapassword
```
yu have to be the person who booked it. obvs, can only delete ur own bookings 

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

# Give normal users society access
### `/add_user_to_group3`
## Parameters

**Restriction:** Only Group4 users have access to this  
**Parameters:** username:`String` 
**Allowed request type:** `POST`  


```shell
curl --data "username=rema" http://127.0.0.1:8000/add_user_to_group3 -u wil:wilpassword
```

> Response

```json
{
    "success": "Successfully added rema boo to society access groups!"
}
```

# Remove normal user's society access
### `/delete_user_from_group3`
## Parameters

**Restriction:** Only Group4 users have access to this 

**Parameters:** username:`String`  

**Allowed request type:** `POST`  

The username must be the email address of the person.

```shell
curl --data "username=rema" http://127.0.0.1:8000/delete_user_from_group3 -u wil:wilpassword
```

> Response

```json
{
    "success": true
}
```

# Logout a user
### `/logout`
## Parameters

**Restrictions: `nill`**

**Allowed request types:** `GET`  


```shell
curl http://127.0.0.1:8000/logout -u username:password
```

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


