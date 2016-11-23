import datetime


def convertTime(timestring):
    """Converts a string into a datetime.time object."""
    return datetime.datetime.strptime(timestring, '%H:%M').time()


def weekOrWeekend(date):
    """Returns a string if a given datetime `date` is a weekday or weekend."""
    return "weekend" if date.weekday() in [5, 6] else "week"
