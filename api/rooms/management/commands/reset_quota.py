from rooms.models import UserProfile
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    help = 'Reset the quota to 180 every monday'

    def handle(self, *args, **options):
        for up in UserProfile.objects.all():
            up.quota_left = 180
            up.save()
        self.stdout.write("Reset Quota for everyone")
