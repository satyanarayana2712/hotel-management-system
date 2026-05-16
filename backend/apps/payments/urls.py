from django.urls import path

from .views import create_payment


urlpatterns = [

    path(
        'create-order/',
        create_payment
    ),
]