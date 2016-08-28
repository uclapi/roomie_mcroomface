from mailgun_keys import key, sandbox
import sys
sys.path.append('./../')
import requests
from django.contrib.auth.models import User
from rooms.models import *

emails = {'anirudhx5@gmail.com'}

request_url = 'https://api.mailgun.net/v3/{0}/messages'.format(sandbox)

def sendEmail(email, password_setting_link):
    print('reached here')
    request = requests.post(request_url, auth=('api', key), data={
        'from': 'hello@example.com',
        'to': email,
        'subject': 'Hello',
        'text': 'Click on {} to set your password'.format(password_setting_link)
    })
    print('Status: {0}' % request.status_code)
    print('Body:   {0}' % request.text)

for email in emails:
    us = User.objects.create_user(username=email, password=email, email=email)
    up = UserProfile(user=us)
    up.save()
    sendEmail(email, "http://127.0.0.1:8000/set_password?user_id={0}".format(up.id))