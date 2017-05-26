from .models import PrivateKey

import datetime
import pytz
import uuid

from rest_framework import exceptions
from rest_framework.authentication import TokenAuthentication


class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        print("\n\n EpiringToken called \n\n")
        model = self.get_model()
        try:
            token = model.objects.select_related('user').get(key=key)
        except:
            raise exceptions.AuthenticationFailed('Invalid token')

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted')

        local_tz = pytz.timezone('Europe/Moscow')
        utc_now = datetime.datetime.utcnow() - datetime.timedelta(days=1)
        utc_now = pytz.utc.localize(utc_now, is_dst=None).astimezone(local_tz)

        if token.created < utc_now - datetime.timedelta(hours=24):
            raise exceptions.AuthenticationFailed('Token has expired')

        return (token.user, token)


class ValidatingTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        model = self.get_model()

        try:
            print(key)
            token = model.objects.select_related('user').get(key=key)
        except:
            # Session token is not valid
            # Checking if it is the user's private key
            try:
                uid = uuid.UUID(key)
                private_key = PrivateKey.objects.get(token=uid)
                return (private_key.user_id, private_key.token.hex)
            except:
                raise exceptions.AuthenticationFailed('Invalid token')

        return (token.user, token)
