from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    class Meta:

        model = Booking

        fields = [
            'id',
            'user',
            'room',
            'check_in_date',
            'check_out_date',
            'total_price',
            'is_confirmed',
            'status',
            'cancelled_at',
            'created_at'
        ]

        read_only_fields = [
            'user',
            'created_at',
            'cancelled_at'
        ]