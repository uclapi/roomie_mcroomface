import datetime
from django.utils.timezone import utc
from rest_framework.authentication import TokenAuthentication
from rest_framework import exceptions
from rest_framework.authtoken.models import Token

class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        model = self.get_model()
        print("key:", key)
        try:
            token = model.objects.select_related('user').get(key=key)
        except:
            raise exceptions.AuthenticationFailed('Invalid token')

        # if not token.user.is_active:
        #     raise exceptions.AuthenticationFailed('User inactive or deleted')
        #
        # utc_now = datetime.datetime.utcnow()
        #
        # if token.created < utc_now - datetime.timedelta(hours=24):
        #     raise exceptions.AuthenticationFailed('Token has expired')

        return (token.user, token)