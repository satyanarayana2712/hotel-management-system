from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

from .models import Room
from .serializers import RoomSerializer

from apps.users.permissions import IsAdmin


class RoomListView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        rooms = Room.objects.all()

        serializer = RoomSerializer(
            rooms,
            many=True
        )

        return Response(serializer.data)


class RoomCreateView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def post(self, request):

        serializer = RoomSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class RoomUpdateView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def put(self, request, room_id):

        try:

            room = Room.objects.get(
                id=room_id
            )

        except Room.DoesNotExist:

            return Response(
                {
                    "error":
                    "Room not found"
                },
                status=404
            )

        serializer = RoomSerializer(
            room,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors,
            status=400
        )


class RoomDeleteView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def delete(self, request, room_id):

        try:

            room = Room.objects.get(
                id=room_id
            )

        except Room.DoesNotExist:

            return Response(
                {
                    "error":
                    "Room not found"
                },
                status=404
            )

        room.delete()

        return Response(
            {
                "message":
                "Room deleted successfully"
            }
        )