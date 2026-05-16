from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import FoodItem, FoodOrder, OrderItem
from .serializers import FoodItemSerializer, FoodOrderSerializer, OrderItemSerializer


class FoodItemListView(APIView):
    """List all available food items"""
    
    permission_classes = [AllowAny]  # Anyone can browse menu
    
    def get(self, request):
        """Get all food items, optionally filter by category"""
        
        category = request.query_params.get('category')
        
        if category:
            items = FoodItem.objects.filter(category=category, available=True)
        else:
            items = FoodItem.objects.filter(available=True)
        
        serializer = FoodItemSerializer(items, many=True)
        return Response(serializer.data)


class FoodItemDetailView(APIView):
    """Get details of a specific food item"""
    
    permission_classes = [AllowAny]
    
    def get(self, request, food_id):
        """Get single food item"""
        
        food_item = get_object_or_404(FoodItem, id=food_id)
        serializer = FoodItemSerializer(food_item)
        return Response(serializer.data)


class FoodOrderCreateView(APIView):
    """Create a new food order"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Create food order with items"""
        
        try:
            # Get items from request
            items_data = request.data.get('items', [])
            special_instructions = request.data.get('special_instructions', '')
            
            if not items_data:
                return Response(
                    {'error': 'Order must contain at least one item'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate total price
            total_price = 0
            order_items = []
            
            for item_data in items_data:
                food_id = item_data.get('food_item_id')
                quantity = item_data.get('quantity', 1)
                notes = item_data.get('notes', '')
                
                # Get food item
                try:
                    food_item = FoodItem.objects.get(id=food_id)
                except FoodItem.DoesNotExist:
                    return Response(
                        {'error': f'Food item with id {food_id} not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                # Calculate item price
                item_total = food_item.price * quantity
                total_price += item_total
                
                order_items.append({
                    'food_item': food_item,
                    'quantity': quantity,
                    'price_at_order': food_item.price,
                    'notes': notes
                })
            
            # Create order
            food_order = FoodOrder.objects.create(
                user=request.user,
                total_price=total_price,
                special_instructions=special_instructions,
                status='order_confirmed'
            )
            
            # Create order items
            for item in order_items:
                OrderItem.objects.create(
                    food_order=food_order,
                    food_item=item['food_item'],
                    quantity=item['quantity'],
                    price_at_order=item['price_at_order'],
                    notes=item['notes']
                )
            
            serializer = FoodOrderSerializer(food_order)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class FoodOrderListView(APIView):
    """Get user's food orders"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get all orders for authenticated user"""
        
        orders = FoodOrder.objects.filter(user=request.user)
        serializer = FoodOrderSerializer(orders, many=True)
        return Response(serializer.data)


class FoodOrderDetailView(APIView):
    """Get details of a specific order"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, order_id):
        """Get single order (only user's own orders)"""
        
        order = get_object_or_404(FoodOrder, id=order_id, user=request.user)
        serializer = FoodOrderSerializer(order)
        return Response(serializer.data)


class FoodOrderCancelView(APIView):
    """Cancel a food order"""
    
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, order_id):
        """Cancel order (only if not preparing/ready/completed)"""
        
        order = get_object_or_404(FoodOrder, id=order_id, user=request.user)
        
        # Can't cancel if already preparing/ready/completed
        if order.status in ['preparing', 'ready', 'delivered', 'completed']:
            return Response(
                {'error': f'Cannot cancel order with status: {order.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        
        serializer = FoodOrderSerializer(order)
        return Response(
            {'message': 'Order cancelled successfully', 'order': serializer.data},
            status=status.HTTP_200_OK
        )


class FoodOrderStatusUpdateView(APIView):
    """Update order status (admin only)"""
    
    permission_classes = [IsAuthenticated]
    
    def put(self, request, order_id):
        """Update order status"""
        
        # Check if user is admin
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admin can update order status'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order = get_object_or_404(FoodOrder, id=order_id)
        new_status = request.data.get('status')
        
        if new_status not in dict(FoodOrder.STATUS_CHOICES):
            return Response(
                {'error': f'Invalid status: {new_status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        serializer = FoodOrderSerializer(order)
        return Response(serializer.data)