from django.shortcuts import render

# Create your views here.
import razorpay

from django.conf import settings

from rest_framework.decorators import api_view

from rest_framework.response import Response


client = razorpay.Client(

    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)


@api_view(['POST'])
def create_payment(request):

    amount = request.data.get('amount')


    payment_order = client.order.create({

        "amount": int(amount) * 100,

        "currency": "INR",

        "payment_capture": "1"
    })


    return Response(payment_order)