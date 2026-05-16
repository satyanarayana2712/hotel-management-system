from django.db import models


class Room(models.Model):

    ROOM_TYPES = (
        ('single', 'Single'),
        ('double', 'Double'),
        ('suite', 'Suite'),
    )

    room_number = models.CharField(
        max_length=10,
        unique=True
    )

    room_type = models.CharField(
        max_length=20,
        choices=ROOM_TYPES
    )

    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    capacity = models.IntegerField()

    description = models.TextField()

    is_available = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.room_number