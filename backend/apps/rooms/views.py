from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Room
from .serializers import RoomSerializer


class RoomListView(APIView):

    def get(self, request):

        rooms = Room.objects.all()

        serializer = RoomSerializer(
            rooms,
            many=True
        )

        return Response(serializer.data)