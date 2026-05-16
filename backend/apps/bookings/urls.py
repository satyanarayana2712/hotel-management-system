from django.urls import path

from .views import (
    BookingCreateView,
    UserBookingListView,
    BookingCancelView,
)


urlpatterns = [

    path(
        'create/',
        BookingCreateView.as_view(),
        name='booking-create'
    ),

    path(
        'my-bookings/',
        UserBookingListView.as_view(),
        name='my-bookings'
    ),
    path(
    'cancel/<int:booking_id>/',
    BookingCancelView.as_view(),
    name='booking-cancel'
),
]