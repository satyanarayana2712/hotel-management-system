from django.db import models
from django.utils import timezone

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
        decimal_places=2,
        default=0
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    cancelled_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f'{self.user.username} - {self.room.room_number} ({self.status})'

    def calculate_total_price(self):
        """Calculate total price based on room price and stay duration"""
        nights = (self.check_out_date - self.check_in_date).days
        if nights <= 0:
            return 0
        return nights * self.room.price_per_night

    def save(self, *args, **kwargs):
        # Auto-calculate total price if not set
        if self.total_price == 0:
            self.total_price = self.calculate_total_price()
        super().save(*args, **kwargs)