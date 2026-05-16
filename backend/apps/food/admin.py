from django.contrib import admin

from .models import (
    FoodItem,
    FoodOrder,
    OrderItem,
)


admin.site.register(FoodItem)

admin.site.register(FoodOrder)

admin.site.register(OrderItem)