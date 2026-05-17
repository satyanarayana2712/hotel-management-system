import { useState } from 'react'

import {
  useNavigate,
  useLocation
} from 'react-router-dom'

import Navbar from '../components/Navbar'

import api from '../services/api'

import { removeUserStorage } from '../services/storageUtils'


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


  const amount =
    isFoodOnly
      ? totalPrice
      : finalGrandTotal


  const handlePayment = async () => {

    try {

      setLoading(true)


      // CREATE RAZORPAY ORDER

      const orderResponse = await api.post(

        'payment/create-order/',

        {
          amount: Math.round(amount)
        }
      )


      const order =
        orderResponse.data


      // RAZORPAY OPTIONS

      const options = {

        key: 'rzp_test_Sprykn8591y2fu',

        amount: order.amount,

        currency: order.currency,

        name: 'Royal Stay',

        description:

          isFoodOnly

            ? 'Food Order Payment'

            : 'Room Booking Payment',

        order_id: order.id,


        handler: async function (response) {

          try {

            let bookingResponse =
              null


            // CREATE ROOM BOOKING

            if (!isFoodOnly) {

              bookingResponse =
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


            // CREATE FOOD ORDER

            if (cartFoods.length > 0) {

              const items =
                cartFoods.map(item => ({

                  food_item_id:
                    item.id,

                  quantity:
                    item.quantity,

                  notes: ''
                }))


              await api.post(

                'food/orders/',

                {
                  items,
                  special_instructions: ''
                }
              )
            }


            // CLEAR CART

            localStorage.removeItem(
              'food_cart'
            )


            // CHECK ORDER TYPES

            const hasRoomBooking =
              !isFoodOnly

            const hasFoodOrder =
              cartFoods.length > 0


            // FOOD ONLY

            if (
              hasFoodOrder &&
              !hasRoomBooking
            ) {

              navigate(

                '/confirmation',

                {

                  state: {

                    bookingId:
                      'FOOD-' + Date.now(),

                    roomId:
                      'Dining Order',

                    totalAmount:
                      amount,

                    paymentId:
                      response.razorpay_payment_id,

                    foodItems:
                      cartFoods,

                    isFoodOnly: true,

                    hasRoomBooking: false,

                    hasFoodOrder: true
                  }
                }
              )

              return
            }


            // ROOM ONLY

            if (
              hasRoomBooking &&
              !hasFoodOrder
            ) {

              navigate(

                '/confirmation',

                {

                  state: {

                    bookingId:
                      bookingResponse?.data?.id,

                    roomId,

                    totalAmount:
                      amount,

                    paymentId:
                      response.razorpay_payment_id,

                    foodItems: [],

                    isFoodOnly: false,

                    hasRoomBooking: true,

                    hasFoodOrder: false
                  }
                }
              )

              return
            }


            // ROOM + FOOD

            navigate(

              '/confirmation',

              {

                state: {

                  bookingId:
                    bookingResponse?.data?.id,

                  roomId,

                  totalAmount:
                    amount,

                  paymentId:
                    response.razorpay_payment_id,

                  foodItems:
                    cartFoods,

                  isFoodOnly: false,

                  hasRoomBooking: true,

                  hasFoodOrder: true
                }
              }
            )

          } catch (error) {

            console.log(error)
          }
        },


        theme: {

          color: '#0F172A'
        }
      }


      const razorpay =
        new window.Razorpay(options)

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


      {/* HERO */}

      <div className="bg-[#0F172A] text-white py-20">

        <div className="max-w-5xl mx-auto px-4">

          <h1 className="text-6xl font-bold mb-6">

            Secure Checkout

          </h1>


          <p className="text-xl text-[#CBD5E1]">

            Complete your payment securely using Razorpay.

          </p>

        </div>

      </div>


      {/* MAIN */}

      <div className="max-w-6xl mx-auto px-4 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">


          {/* LEFT */}

          <div className="lg:col-span-2 space-y-8">


            {/* BOOKING */}

            {
              !isFoodOnly && (

                <div className="bg-white border border-[#E2E8F0] p-10">

                  <h2 className="text-3xl font-bold mb-10">

                    Booking Summary

                  </h2>


                  <div className="space-y-6">

                    <div className="flex justify-between">

                      <p className="text-[#64748B]">

                        Room Number

                      </p>


                      <h3 className="font-bold text-xl">

                        #{roomId}

                      </h3>

                    </div>


                    <div className="flex justify-between">

                      <p className="text-[#64748B]">

                        Check-In

                      </p>


                      <h3 className="font-bold text-xl">

                        {
                          new Date(
                            formData.check_in_date
                          ).toLocaleDateString()
                        }

                      </h3>

                    </div>


                    <div className="flex justify-between">

                      <p className="text-[#64748B]">

                        Check-Out

                      </p>


                      <h3 className="font-bold text-xl">

                        {
                          new Date(
                            formData.check_out_date
                          ).toLocaleDateString()
                        }

                      </h3>

                    </div>

                  </div>

                </div>
              )
            }


            {/* FOOD ITEMS */}

            {
              cartFoods.length > 0 && (

                <div className="bg-white border border-[#E2E8F0] p-10">

                  <h2 className="text-3xl font-bold mb-10">

                    Dining Services

                  </h2>


                  <div className="space-y-5">

                    {
                      cartFoods.map(item => (

                        <div
                          key={item.id}
                          className="flex justify-between items-center border border-[#E2E8F0] p-5"
                        >

                          <div className="flex items-center gap-5">

                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-24 h-24 object-cover"
                            />


                            <div>

                              <h3 className="text-xl font-bold mb-2">

                                {item.name}

                              </h3>


                              <p className="text-[#64748B]">

                                Quantity:
                                {' '}
                                {item.quantity}

                              </p>

                            </div>

                          </div>


                          <h3 className="text-2xl font-bold">

                            ₹
                            {
                              item.price *
                              item.quantity
                            }

                          </h3>

                        </div>
                      ))
                    }

                  </div>

                </div>
              )
            }

          </div>


          {/* RIGHT */}

          <div>

            <div className="bg-white border border-[#E2E8F0] sticky top-28">


              {/* HEADER */}

              <div className="bg-[#0F172A] text-white px-8 py-6">

                <h2 className="text-3xl font-bold">

                  Payment Summary

                </h2>

              </div>


              {/* CONTENT */}

              <div className="p-8">


                <div className="space-y-5 mb-8">

                  {
                    !isFoodOnly && (

                      <div className="flex justify-between">

                        <p className="text-[#64748B]">

                          Room Charges

                        </p>


                        <h3 className="font-bold">

                          ₹5000

                        </h3>

                      </div>
                    )
                  }


                  <div className="flex justify-between">

                    <p className="text-[#64748B]">

                      Dining Services

                    </p>


                    <h3 className="font-bold">

                      ₹
                      {
                        cartFoods.reduce(

                          (total, item) =>

                            total + (
                              item.price *
                              item.quantity
                            ),

                          0
                        )
                      }

                    </h3>

                  </div>


                  <div className="flex justify-between">

                    <p className="text-[#64748B]">

                      Taxes & Fees

                    </p>


                    <h3 className="font-bold">

                      Included

                    </h3>

                  </div>

                </div>


                {/* GRAND TOTAL */}

                <div className="border-t pt-6 mb-10">

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="text-sm text-[#64748B] mb-2">

                        Grand Total

                      </p>


                      <h2 className="text-5xl font-bold">

                        ₹{amount}

                      </h2>

                    </div>

                  </div>

                </div>


                {/* PAY BUTTON */}

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-5 text-lg font-semibold transition"
                >

                  {
                    loading

                      ? 'Processing...'

                      : 'Pay Securely'
                  }

                </button>


                <p className="text-center text-sm text-[#64748B] mt-5">

                  Secured by Razorpay Payment Gateway

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default PaymentPage