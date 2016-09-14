from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^v1/login', views.login),
    url(r'^v1/logout', views.logout_view),
    url(r'^v1/get_list_of_rooms$', views.get_rooms_list),
    url(r'^v1/get_room_bookings$', views.get_room_bookings),
    url(r'^v1/book_room_normal$', views.book_a_room_normal),
    url(r'^v1/book_room_society$', views.book_a_room_society),
    url(r'^v1/get_users_booking$', views.get_users_booking),
    url(r'^v1/token/', views.obtain_expiring_auth_token),
    url(r'^v1/delete_booking$', views.delete_booking),
    url(r'^v1/accounts/login/$', views.no_access, name='no permission'),
    url(r'^v1/add_user_to_group3', views.add_user_to_group3),
    url(r'^v1/delete_user_from_group3$', views.remove_user_from_group3),
    url(r'^v1/set_password', views.set_password),
    url(r'^v1/forgot_password', views.forgot_password)
]
