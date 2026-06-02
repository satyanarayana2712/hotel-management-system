from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path

from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def home(request):
    return JsonResponse({
        'message': 'Hotel Management Backend Running Successfully'
    })


api_v1_urlpatterns = [
    path('users/', include('apps.users.urls')),
    path('rooms/', include('apps.rooms.urls')),
    path('bookings/', include('apps.bookings.urls')),
    path('food/', include('apps.food.urls')),
    path('payment/', include('apps.payments.urls')),
    path('ai/', include('apps.ai_assistant.urls')),
]


urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1_urlpatterns)),
    path('api/', include(api_v1_urlpatterns)),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
