from django.urls import path

from .views import (
	RoomListView,
	RoomCreateView,
	RoomUpdateView,
	RoomDeleteView,
)


urlpatterns = [
	path('', RoomListView.as_view(), name='room-list'),
	path('create/', RoomCreateView.as_view(), name='room-create'),
	path('update/<int:room_id>/', RoomUpdateView.as_view(), name='room-update'),
	path('delete/<int:room_id>/', RoomDeleteView.as_view(), name='room-delete'),
]