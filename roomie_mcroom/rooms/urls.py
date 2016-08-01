from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^get_list_of_rooms$', views.get_rooms_list)
]