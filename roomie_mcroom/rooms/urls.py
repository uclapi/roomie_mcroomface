from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^login', views.login),
    url(r'^logout', views.logout_view),
    url(r'^get_list_of_rooms$', views.get_rooms_list),
    url(r'^(?P<room_id>[0-9]{4}[a-zA-Z]+)/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})', views.get_room_bookings),
    url(r'^book_room_normal$', views.book_a_room_normal),
    url(r'^book_room_society$', views.book_a_room_society),
    url(r'^get_users_booking$', views.get_users_booking),
    url(r'^token/', views.obtain_expiring_auth_token),
    url(r'^delete_booking$', views.delete_booking),
    url(r'^no_permission', views.no_access, name= 'no permission'),
    url(r'^add_user_to_group3', views.add_user_to_group3),
    url(r'^delete_user_from_group3$', views.remove_user_from_group3)
]