import { useState } from 'react'

import {
  useNavigate,
  useLocation
} from 'react-router-dom'

import Navbar from '../components/Navbar'

import api from '../services/api'


function PaymentPage() {

  const navigate = useNavigate()

  const location = useLocation()

  const {
    roomId,
    formData,
    cartFoods = [],
    finalGrandTotal,
    totalPrice,
    isFoodOnly = false
  } = location.state || {}


  const [loading, setLoading] =
    useState(false)

  const amount = isFoodOnly ? totalPrice : finalGrandTotal


  const handlePayment = async () => {

    try {

      setLoading(true)

      // Razorpay logic here
      const response = await api.post(

        'payment/create-order/',
      
        {
          amount: Math.round(amount)
        }
      )
      
      const order = response.data
      
      
      const options = {
      
        key: 'rzp_test_Sprykn8591y2fu',
      
        amount: order.amount,
      
        currency: order.currency,
      
        name: 'Luxury Hotel',
      
        description: isFoodOnly ? 'Food Order Payment' : 'Room Booking Payment',
      
        order_id: order.id,
      
      
        handler: async function (response) {
      
          try {

            // Create booking only if not food-only order
            if (!isFoodOnly) {

              await api.post(
      
                'bookings/create/',
      
                {
                  room: roomId,
      
                  check_in_date:
                    formData.check_in_date,
      
                  check_out_date:
                    formData.check_out_date,
      
                  total_price:
                    finalGrandTotal.toString(),
      
                  is_confirmed: true,
                }
              )
            }
      
      
            if (cartFoods.length > 0) {
      
              const items = cartFoods.map(
                item => ({
      
                  food_item_id: item.id,
      
                  quantity: item.quantity,
      
                  notes: ''
                })
              )
      
      
              await api.post(
      
                'food/orders/',
      
                {
                  items,
                  special_instructions: ''
                }
              )
            }
      
      
            localStorage.removeItem(
              'food_cart'
            )
      
            alert('Payment Successful')
      
            navigate(isFoodOnly ? '/my-food-orders' : '/my-bookings')
      
          } catch (error) {
      
            console.log(error)
          }
        }
      }
      
      
      const razorpay = new window.Razorpay(options)
      
      razorpay.open()

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }


  return (

    <div className="min-h-screen bg-[#F1F5F9]">

      <Navbar />

      <div className="bg-[#0F172A] text-white py-20">

        <div className="max-w-4xl mx-auto px-4">

          <h1 className="text-6xl font-bold mb-4">

            Secure Payment

          </h1>

          <p className="text-xl text-gray-300">

            {isFoodOnly ? 'Complete your food order' : 'Complete your room booking'}

          </p>

        </div>

      </div>

      <div className="max-w-4xl mx-auto py-20 px-4">

        <div className="bg-white p-10 border">

          <div className="mb-10">

            {isFoodOnly ? (

              <div>

                <h2 className="text-2xl font-bold mb-8">

                  Order Summary

                </h2>

                <div className="space-y-4 mb-8 max-h-48 overflow-y-auto">

                  {
                    cartFoods.map(item => (

                      <div key={item.id} className="flex justify-between border-b pb-3">

                        <span>{item.name} x {item.quantity}</span>

                        <span>₹{item.price * item.quantity}</span>

                      </div>
                    ))
                  }

                </div>

              </div>

            ) : (

              <div className="mb-6">

                <h2 className="text-2xl font-bold mb-4">

                  Booking Summary

                </h2>

                <p className="text-[#64748B] mb-2">

                  Check-in: {new Date(formData.check_in_date).toLocaleDateString()}

                </p>

                <p className="text-[#64748B] mb-6">

                  Check-out: {new Date(formData.check_out_date).toLocaleDateString()}

                </p>

              </div>
            )}

            <div className="border-t pt-6">

              <p className="text-xl text-[#64748B] mb-3">

                Total Amount

              </p>

              <h2 className="text-5xl font-bold">

                ₹{amount}

              </h2>

            </div>

          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[#0F172A] text-white py-5 text-xl font-bold hover:bg-[#1E293B] disabled:opacity-50"
          >

            {
              loading

                ? 'Processing...'

                : 'Pay Now'
            }

          </button>

        </div>

      </div>

    </div>
  )
}

export default PaymentPage