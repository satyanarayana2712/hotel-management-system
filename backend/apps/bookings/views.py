
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Booking
from .serializers import BookingSerializer


class BookingCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        room = request.data.get('room')

        check_in_date = request.data.get(
            'check_in_date'
        )

        check_out_date = request.data.get(
            'check_out_date'
        )

        # Validate dates
        if check_out_date <= check_in_date:

            return Response(
                {
                    'error':
                    'Check-out date must be greater than check-in date'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check overlapping bookings
        existing_bookings = Booking.objects.filter(

            room=room,

            check_in_date__lt=check_out_date,

            check_out_date__gt=check_in_date,
        )

        if existing_bookings.exists():

            return Response(
                {
                    'error':
                    'Room already booked for selected dates'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = BookingSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(
                user=request.user
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class UserBookingListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        bookings = Booking.objects.filter(
            user=request.user
        )

        serializer = BookingSerializer(
            bookings,
            many=True
        )

        return Response(serializer.data)
    
class BookingCancelView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, booking_id):

        booking = get_object_or_404(

            Booking,

            id=booking_id,

            user=request.user
        )
        
        if booking.status == 'cancelled':
            return Response(
                {
                    'error': 'Booking is already cancelled'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'cancelled'
        booking.cancelled_at = timezone.now()
        booking.save()

        return Response(
            {
                'message':
                'Booking cancelled successfully'
            },
            status=status.HTTP_200_OK
        )

