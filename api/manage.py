#!/usr/bin/env python
import dotenv
import os
import sys


if __name__ == "__main__":
    dotenv.read_dotenv()

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "roomie_mcroom.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
