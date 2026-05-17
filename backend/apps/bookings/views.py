from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q

from .models import Booking
from .serializers import BookingSerializer


class BookingCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = BookingSerializer(
            data=request.data
        )

        if serializer.is_valid():

            room = serializer.validated_data[
                'room'
            ]

            check_in_date = serializer.validated_data[
                'check_in_date'
            ]

            check_out_date = serializer.validated_data[
                'check_out_date'
            ]

            today = timezone.now().date()

            # DATE VALIDATION - Check-out > Check-in
            if check_out_date <= check_in_date:
                return Response(
                    {
                        'error':
                        'Check-out date must be after check-in date'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # DATE VALIDATION - No past dates
            if check_in_date < today:
                return Response(
                    {
                        'error':
                        'Check-in date cannot be in the past'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # DATE VALIDATION - Reasonable stay duration
            days = (check_out_date - check_in_date).days
            if days > 365:
                return Response(
                    {
                        'error':
                        'Stay duration cannot exceed 365 days'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # CHECK ROOM AVAILABILITY - Only check confirmed/pending bookings
            existing_booking = Booking.objects.filter(
                room=room,
                status__in=['confirmed', 'pending']
            ).filter(
                Q(
                    check_in_date__lt=check_out_date,
                    check_out_date__gt=check_in_date
                )
            ).exists()

            if existing_booking:
                return Response(
                    {
                        'error':
                        'Room is already booked for selected dates'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # CREATE BOOKING
            booking = serializer.save(
                user=request.user,
                status='pending'
            )

            return Response(
                BookingSerializer(booking).data,
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

        ).exclude(

            status='cancelled'
        )

        serializer = BookingSerializer(

            bookings,

            many=True
        )

        return Response(
            serializer.data
        )


class BookingCancelView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, booking_id):

        booking = get_object_or_404(

            Booking,

            id=booking_id,

            user=request.user
        )


        # ALREADY CANCELLED

        if booking.status == 'cancelled':

            return Response(

                {
                    'error':

                    'Booking is already cancelled'
                },

                status=status.HTTP_400_BAD_REQUEST
            )


        # CANCEL BOOKING

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