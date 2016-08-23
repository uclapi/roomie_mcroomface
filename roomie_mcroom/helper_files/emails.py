import requests
from rooms.models import *
from django.contrib.auth.models import User

key = 'YOUR API KEY HERE'
sandbox = 'YOUR SANDBOX URL HERE'
recipient = 'YOUR EMAIL HERE'

emails = {'test@email.com'}

request_url = 'https://api.mailgun.net/v2/{0}/messages'.format(sandbox)

def sendEmail(email, password_setting_link):
    request = requests.post(request_url, auth=('api', key), data={
        'from': 'hello@example.com',
        'to': email,
        'subject': 'Hello',
        'text': 'Click on {} to set your password'.format(password_setting_link)
    })

for email in emails:
    us = User.objects.create_user(username="asdf", password="asdf", email="asdf")
    up = UserProfile(user=us)
    up.save()
    sendEmail(email, "some link here")


print('Status: {0}' % request.status_code)
print('Body:   {0}' % request.text)