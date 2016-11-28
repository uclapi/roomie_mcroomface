"""Set of utils for Roomie McRoomface. Store here any random functions that
would be useful across the board."""
import random
import string
import datetime

def random_string(length=60):
    """ Generate a random string of length provided in the parameter"""
    return ''.join(random.SystemRandom().choice(string.ascii_lowercase) for _ in range(length))

def convertTime(timestring):
    """Converts a string into a datetime.time object."""
    return datetime.datetime.strptime(timestring, '%H:%M').time()


def weekOrWeekend(date):
    """Returns a string if a given datetime `date` is a weekday or weekend."""
    return "weekend" if date.weekday() in [5, 6] else "week"
