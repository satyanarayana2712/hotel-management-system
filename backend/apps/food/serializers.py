from rest_framework import serializers
from .models import FoodItem, FoodOrder, OrderItem


class FoodItemSerializer(serializers.ModelSerializer):
    """Serializer for Food Items (menu items)"""
    
    class Meta:
        model = FoodItem
        fields = [
            'id',
            'name',
            'description',
            'category',
            'price',
            'image_url',
            'available',
            'preparation_time',
            'is_vegetarian',
            'is_vegan',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for Order Items (items within an order)"""
    
    # Include the full food item details (nested)
    food_item = FoodItemSerializer(read_only=True)
    food_item_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'food_item',
            'food_item_id',
            'quantity',
            'price_at_order',
            'notes',
            'created_at',
        ]
        read_only_fields = ['created_at', 'price_at_order']


class FoodOrderSerializer(serializers.ModelSerializer):
    """Serializer for Food Orders"""
    
    # Nested order items
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = FoodOrder
        fields = [
            'id',
            'user',
            'user_name',
            'status',
            'total_price',
            'special_instructions',
            'items',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']