from django.urls import path
from .views import (
    FoodItemListView,
    FoodItemDetailView,
    FoodOrderCreateView,
    FoodOrderListView,
    FoodOrderDetailView,
    FoodOrderCancelView,
    FoodOrderStatusUpdateView,
)

urlpatterns = [
    # Food Items (Menu)
    path(
        'items/',
        FoodItemListView.as_view(),
        name='food-items-list'
    ),
    
    path(
        'items/<int:food_id>/',
        FoodItemDetailView.as_view(),
        name='food-items-detail'
    ),
    
    # Food Orders
    path(
        'orders/',
        FoodOrderCreateView.as_view(),
        name='food-orders-create'
    ),
    
    path(
        'orders/my-orders/',
        FoodOrderListView.as_view(),
        name='food-orders-list'
    ),
    
    path(
        'orders/<int:order_id>/',
        FoodOrderDetailView.as_view(),
        name='food-orders-detail'
    ),
    
    path(
        'orders/<int:order_id>/cancel/',
        FoodOrderCancelView.as_view(),
        name='food-orders-cancel'
    ),
    
    path(
        'orders/<int:order_id>/status/',
        FoodOrderStatusUpdateView.as_view(),
        name='food-orders-status'
    ),
]