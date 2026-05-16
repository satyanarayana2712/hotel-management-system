from django.db import models

# Create your models here.
from django.db import models

from apps.users.models import User
from apps.rooms.models import Room


class Booking(models.Model):
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE
    )

    check_in_date = models.DateField()

    check_out_date = models.DateField()

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    is_confirmed = models.BooleanField(
        default=True
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='confirmed'
    )
    
    cancelled_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f'{self.user.username} - {self.room.room_number}'