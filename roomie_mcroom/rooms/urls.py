from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^login', views.login),
    url(r'^get_list_of_rooms$', views.get_rooms_list),
    url(r'^(?P<room_id>[0-9]{4}[a-zA-Z]+)/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})', views.get_room_bookings),
    url(r'^book_room/(?P<room_id>[0-9]{4}[a-zA-Z]+)/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/(?P<start_hour>[0-9]{2})/(?P<start_minute>[0-9]{2})/(?P<end_hour>[0-9]{2})/(?P<end_minute>[0-9]{2})', views.book_a_room),
]