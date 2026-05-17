from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    room_details = serializers.SerializerMethodField()

    class Meta:

        model = Booking

        fields = [
            'id',
            'user',
            'room',
            'room_details',
            'check_in_date',
            'check_out_date',
            'total_price',
            'status',
            'cancelled_at',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'user',
            'created_at',
            'updated_at',
            'cancelled_at',
            'room_details'
        ]

    def get_room_details(self, obj):
        """Return room details without circular reference"""
        return {
            'id': obj.room.id,
            'room_number': obj.room.room_number,
            'room_type': obj.room.room_type,
            'price_per_night': obj.room.price_per_night,
            'capacity': obj.room.capacity
        }