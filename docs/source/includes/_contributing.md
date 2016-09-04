# Contributing

<aside class="notice">So testing time!</aside>

Make sure you have pip installed, and python3.

Clone the repo from [https://github.com/techsoc/roomie_mcroomface](https://github.com/techsoc/roomie_mcroomface)  
* install virtualenv by typing `pip install virtualenv`  
* create a env by typing `virtualenv -p python3 env`  
* activate the source by typing `source env/bin/activate`  

cd to roomie_mcroom/roomie_mcroom

create a file aws_settings.py and add these Data base settings to these variables  
HOST =  
PORT =  
USERNAME =  
DB_NAME =  
PASSWORD =  
dw people, we will change password once its deployed :/  

cd to the main directory and type `pip install -r requirements.txt` to install all the dependencies.

## Log a user in:

url : localhost:8000/login  
restrictions: Anyone make a POST request  
parameters : username;String, password;String  
allowed request type : POST  

```shell
curl --data "username=wil&password=wilpassword" http://127.0.0.1:8000/login
```
> Returns JSON indicating appropriate message.

## Get list of rooms and assoiated meta data

url : localhost:8000/get_list_of_rooms  
restrictions : Only authenticated users can make a request  
parameters: nill  
allowed request types: GET  

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

## Get room bookings on a specific room on a specific date

url: localhost:8000/get_room_bookings  
restrictions : Only authenticated users can make a request  
parameters: room_id:String, date:String #YYYYMMDD format  
allowed request type : GET  

```shell
curl "http://127.0.0.1:8000/get_room_bookings?room_id=RO-PIZZA&date=20160808"
    -u wil:wilpassword
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

## Book normal rooms

url : localhost:8000/book_room_normal  
restrictions : Any authenticated user can make room bookings, except for token based authentications  
parameters : room_id;String, date;YYYYMMDD, start_time, end_time;HH:MM, notes:String  
allowed request type : POST  

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

## Book society rooms

url : localhost:8000/book_room_society  
restrictions : Only users in group3 can use this endpoint and token authenticated requests  
parameters : room_id;String, date;YYYYMMDD, start_time, end_time;HH:MM, society;String, event_name;String  
allowed request type : POST  

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

## Get all bookings from a user

url : localhost:8000/get_users_booking  
restrictions : Only authenticated users are allowed  
parameters : date;YYYYMMDD  
allowed request type : GET  

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

## Get token

url : localhost:8000/token  
restrictions : Only Group4 Users can access this (Society Predidents)  
parameters : nil  
allowed request type : GET  

```shell
curl http://127.0.0.1:8000/token/ -u wil:wilpassword
```

> Response

```json
{
    "token":"token"
}
```

## Delete a booking

url : localhost:8000/delete_booking  
restrictions : Only object owner can delete the booking and user has to be authenticated  
allowed request type = GET  
parameters : booking_id;String  

```shell
curl http:127.0.0.1:8000/delete_booking?booking_id=21cf0a17-4b64-4a5f-9a0e-9381d4195af1
    -u rema:remapassword
```

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

## Give normal users society access
url : localhost:8000/add_user_to_group3  
restriction : Only Group4 users have access to this  
allowed request type : POST  
parameters : username;String -> email of the student (?)  

```shell
curl --data "username=rema" http://127.0.0.1:8000/add_user_to_group3 -u wil:wilpassword
```

> Response

```json
{
    "success": "Successfully added rema boo to society access groups!"
}
```

## Remove normal user's society access
url : localhost:8000/delete_user_from_group3  
restriction : Only Group4 users have access to this  
allowed request type : POST  
parameters : username;String -> email of the student (?)  

```shell
curl --data "username=rema" http://127.0.0.1:8000/delete_user_from_group3 -u wil:wilpassword
```

> Response

```json
{
    "success": true
}
```

## Logout a user
url : localhost:8000/logout  
allowed request types : GET  
restrictions : Only authenticated users are allowed  

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
