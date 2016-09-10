from mailgun_keys import key, sandbox
import sys
sys.path.append('./../')
import requests
from django.contrib.auth.models import User
from rooms.models import *

emails = {'anirudhx5@gmail.com'}

request_url = 'https://api.mailgun.net/v3/{}/messages'.format(sandbox)

def sendEmail(email, password_setting_link):
    print('reached here')
    request = requests.post(request_url, auth=('api', key), data={
        'from': 'hello@example.com',
        'to': email,
        'subject': 'Hello',
        'text': 'Click on {} to set your password'.format(password_setting_link)
    })
    print('Status: {}'.format(request.status_code))
    print('Body:   {}'.format(request.text))

for email in emails:

    # creating the user
    us = User.objects.create_user(username=email, password=email, email=email)
    up = UserProfile(user=us)
    up.save()

    # creating the verifier object to hold user's id
    verifier = Verifier()
    verifier.user_id = up.id
    verifier.save()

    # sending the uuid from verifier object as a param
    sendEmail(email, "http://127.0.0.1:8000/set_password?uid={}".format(verifier.param))