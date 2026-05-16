from django.db import models
from apps.users.models import User


class FoodItem(models.Model):
    """Menu items available for ordering"""
    
    CATEGORY_CHOICES = [
    ('starter', 'Starter'),
    ('veg_main', 'Vegetarian Main Course'),
    ('non_veg_main', 'Non-Vegetarian Main Course'),
    ('bread', 'Bread (Roti/Naan)'),
    ('rice', 'Rice Dishes (Biryani/Pulao)'),
    ('dessert', 'Dessert/Sweets'),
    ('beverage', 'Beverage'),
    ('salad', 'Salad'),
    ('soup', 'Soup'),
]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True)
    available = models.BooleanField(default=True)
    preparation_time = models.IntegerField(default=15)  # minutes
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class FoodOrder(models.Model):
    """Customer food orders"""
    
    STATUS_CHOICES = [
    ('order_confirmed', 'Order Confirmed'),
    ('preparing', 'Preparing in Kitchen'),
    ('ready', 'Ready for Delivery'),
    ('delivered', 'Delivered to Room'),
    ('cancelled', 'Order Cancelled'),
]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='order_confirmed')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    special_instructions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

    class Meta:
        ordering = ['-created_at']


class OrderItem(models.Model):
    """Individual items within a food order"""
    
    food_order = models.ForeignKey(FoodOrder, on_delete=models.CASCADE, related_name='items')
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_at_order = models.DecimalField(max_digits=10, decimal_places=2)  # Historical price
    notes = models.TextField(blank=True)  # Allergies, customizations, etc.
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quantity}x {self.food_item.name} - Order #{self.food_order.id}"

    class Meta:
        ordering = ['created_at']
