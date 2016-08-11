from rest_framework import permissions
from functools import wraps
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.user_profile == obj.user