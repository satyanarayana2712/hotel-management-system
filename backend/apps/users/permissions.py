from rest_framework.permissions import BasePermission


def is_admin_user(user):
    return (
        user.is_authenticated
        and (
            user.role == 'admin'
            or user.is_staff
            or user.is_superuser
        )
    )


class IsAdmin(BasePermission):

    def has_permission(self, request, view):

        return is_admin_user(request.user)


class IsStaffOrAdmin(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and (
                request.user.role in [
                'admin',
                'staff'
                ]
                or request.user.is_staff
                or request.user.is_superuser
            )
        )