from . import views

from django.conf.urls import url

urlpatterns = [
    url(r'^v1/user.login.getToken', views.login_get_token),
    url(r'^v1/user.login.callback', views.login_callback),
    url(r'^v1/user.login.status', views.login_status),
    url(r'^v1/user.logout/$', views.logout_view),
    url(r'^v1/user.bookings/$', views.get_users_booking),
    url(r'^v1/user.info/$', views.get_user_meta_data),

    url(r'^v1/rooms.list/$', views.get_rooms_list),
    url(r'^v1/rooms.bookings/$', views.get_room_bookings),
    url(r'^v1/rooms.book/$', views.book_room),
    url(r'^v1/rooms.deleteBooking/$', views.delete_booking),

    url(r'^v1/society.token/$', views.obtain_expiring_auth_token),
    url(r'^v1/society.addUser/$', views.add_user_to_group3),
    url(r'^v1/society.removeUser/$', views.remove_user_from_group3),

    url(r'^v1/accounts/login/$', views.no_access, name='no permission'),
]
