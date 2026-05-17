from rest_framework import serializers
from django.utils import timezone
from django.db.models import Q

from .models import Room
from apps.bookings.models import Booking


class RoomSerializer(serializers.ModelSerializer):
    
    availability_status = serializers.SerializerMethodField()
    booked_dates = serializers.SerializerMethodField()
    next_available_date = serializers.SerializerMethodField()

    class Meta:

        model = Room

        fields = [
            'id',
            'room_number',
            'room_type',
            'price_per_night',
            'capacity',
            'description',
            'is_available',
            'created_at',
            'availability_status',
            'booked_dates',
            'next_available_date'
        ]

    def get_availability_status(self, obj):
        """
        Returns availability status based on current bookings
        """
        today = timezone.now().date()
        
        # Get active bookings (confirmed, pending - not cancelled)
        active_bookings = Booking.objects.filter(
            room=obj,
            status__in=['confirmed', 'pending']
        )
        
        # Check if room is booked today or in future
        current_booking = active_bookings.filter(
            check_in_date__lte=today,
            check_out_date__gt=today
        ).first()
        
        if current_booking:
            if current_booking.status == 'pending':
                return 'processing'
            return 'booked'
        
        # Check if room is booked in near future
        future_booking = active_bookings.filter(
            check_in_date__gt=today
        ).order_by('check_in_date').first()
        
        if future_booking:
            return 'reserved'
        
        return 'available'

    def get_booked_dates(self, obj):
        """
        Returns list of booked date ranges
        """
        today = timezone.now().date()
        
        # Get active bookings from today onwards (confirmed, pending - not cancelled)
        active_bookings = Booking.objects.filter(
            room=obj,
            status__in=['confirmed', 'pending'],
            check_out_date__gt=today
        ).order_by('check_in_date')
        
        bookings_list = []
        for booking in active_bookings:
            bookings_list.append({
                'check_in_date': booking.check_in_date,
                'check_out_date': booking.check_out_date,
                'status': booking.status
            })
        
        return bookings_list

    def get_next_available_date(self, obj):
        """
        Returns when room will be available next
        """
        today = timezone.now().date()
        
        # Get the latest checkout date from active bookings
        latest_booking = Booking.objects.filter(
            room=obj,
            status__in=['confirmed', 'pending'],
            check_out_date__gte=today
        ).order_by('-check_out_date').first()
        
        if latest_booking:
            return latest_booking.check_out_date
        
        return today