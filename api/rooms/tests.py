import datetime

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase

from rooms.models import UserProfile
from rooms.utils import convertTime, weekOrWeekend
from rooms.views import is_time_valid


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


class UtilsTestCase(TestCase):
    def test_convert_time(self):
        for hours in range(0, 24):
            for minutes in range(0, 60):
                time_string = "{}:{}".format(hours, minutes)
                time_object = convertTime(time_string)

                self.assertEqual(time_object.hour, hours)
                self.assertEqual(time_object.minute, minutes)

    def test_week_or_weekend(self):
        weekdays = ["26-02-2016", "07-06-2017", "09-10-2018"]
        weekends = ["04-06-2016", "04-06-2017", "01-04-2018"]

        for weekday in weekdays:
            dt = datetime.datetime.strptime(weekday, "%d-%m-%Y")
            self.assertEqual(weekOrWeekend(dt), "week")

        for weekend in weekends:
            dt = datetime.datetime.strptime(weekend, "%d-%m-%Y")
            self.assertEqual(weekOrWeekend(dt), "weekend")


class IsTimeValidTestCase(TestCase):
    def setUp(self):
        self.date = datetime.date(2017, 6, 7)
        self.start_time = datetime.time(10, 0)
        self.end_time = datetime.time(15, 0)

    def test_is_time_valid_end_before_start(self):
        self.end_time = datetime.time(9, 0)

        result = is_time_valid(self.date, self.start_time, self.end_time)
        self.assertFalse(result["success"])
        self.assertEqual(result["error"]["error"], "Invalid times given.")

    def test_is_time_valid_end_after_closing(self):
        self.end_time = datetime.time(23, 0)

        result = is_time_valid(self.date, self.start_time, self.end_time)
        self.assertFalse(result["success"])
        self.assertEqual(
            result["error"]["error"],
            "Choose an end time before closing time."
        )

    def test_is_time_valid_start_before_opening(self):
        self.start_time = datetime.time(5, 0)

        result = is_time_valid(self.date, self.start_time, self.end_time)
        self.assertFalse(result["success"])
        self.assertEqual(
            result["error"]["error"],
            "Choose a starting time after opening time."
        )

    def test_is_time_valid_everything_is_fine(self):
        result = is_time_valid(self.date, self.start_time, self.end_time)
        self.assertTrue(result["success"])
        self.assertIsNone(result.get("error"))
