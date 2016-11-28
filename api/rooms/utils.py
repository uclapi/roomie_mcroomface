"""Set of utils for Roomie McRoomface. Store here any random functions that
would be useful across the board."""
import random
import string

def random_string(length=60):
    """ Generate a random string of length provided in the parameter"""
    return ''.join(random.SystemRandom().choice(string.ascii_lowercase) for _ in range(length))
