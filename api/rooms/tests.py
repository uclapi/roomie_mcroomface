from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase

from rooms.models import UserProfile


# Create your tests here.
class ResetQuotaTestCase(TestCase):
    def setUp(self):
        self.u1 = User.objects.create(username="aVeryLongRandomTestingString")
        self.up1 = UserProfile.objects.create(user=self.u1)

    def test_reset_quota(self):
        self.assertEqual(UserProfile.objects.all()[0].quota_left, 180)

        UserProfile.objects.all()[0].quota_left = 0
        call_command("reset_quota")

        self.assertEqual(UserProfile.objects.all()[0].quota_left, 180)

    def tearDown(self):
        self.u1.delete()
