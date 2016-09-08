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

### To login in a user, use the endpoint `url : localhost:8000/login`

### Parameters  

In the post request, you _must_ include these parameters. 

**Restrictions:** `nill`

**Parameters:** _username_; `String`, _password_; `String`

**Allowed request type:** `POST`


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

# Get room bookings on a specific room on a specific date

url: localhost:8000/get_room_bookings  
restrictions : Only authenticated users can make a request  
parameters: room_id:String, date:String #YYYYMMDD format  
allowed request type : GET  

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



## Get a Specific Kitten

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.get(2)
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.get(2)
```

```shell
curl "http://example.com/api/kittens/2"
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require('kittn');

let api = kittn.authorize('meowmeowmeow');
let max = api.kittens.get(2);
```

> The above command returns JSON structured like this:

```json
{
  "id": 2,
  "name": "Max",
  "breed": "unknown",
  "fluffiness": 5,
  "cuteness": 10
}
```

This endpoint retrieves a specific kitten.

<aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside>

### HTTP Request

`GET http://example.com/kittens/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the kitten to retrieve
