from django.db import models
from apps.bookings.models import Booking
from apps.food.models import FoodOrder


class Payment(models.Model):
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('razorpay', 'Razorpay'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('upi', 'UPI'),
        ('wallet', 'Wallet'),
    ]

    # Payment can be for booking or food order or both
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='payments'
    )

    food_order = models.ForeignKey(
        FoodOrder,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='payments'
    )

    transaction_id = models.CharField(
        max_length=100,
        unique=True
    )

    razorpay_order_id = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    razorpay_payment_id = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='razorpay'
    )

    payment_date = models.DateTimeField(
        null=True,
        blank=True
    )

    refund_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    refund_date = models.DateTimeField(
        null=True,
        blank=True
    )

    notes = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f'Payment {self.transaction_id} - {self.amount} ({self.status})'
