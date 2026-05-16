import { useEffect, useMemo, useState } from 'react'

import {
  useNavigate,
  useLocation
} from 'react-router-dom'

import Navbar from '../components/Navbar'



function CheckoutPage() {

  const navigate = useNavigate()

  const location = useLocation()


  const {
    roomId,
    formData,
    selectedFoods,
    roomPrice,
    foodTotal
  } = location.state || {}


  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')


  useEffect(() => {

    if (!roomId || !formData) {

      navigate('/dashboard')
    }

  }, [roomId, formData, navigate])


  const cartFoods = selectedFoods || []


  const totalFoodCost = useMemo(() => {

    return cartFoods.reduce(

      (total, item) =>
        total + (
          item.price * item.quantity
        ),

      0
    )

  }, [cartFoods])


  const finalRoomPrice = roomPrice || 5000

  const finalGrandTotal =
    finalRoomPrice + totalFoodCost




  const handlePaymentPage = () => {

    navigate('/payment', {
  
      state: {
  
        roomId,
        formData,
        cartFoods,
        finalRoomPrice,
        totalFoodCost,
        finalGrandTotal
      }
    })
  }


  return (

    <div className="min-h-screen bg-[#F1F5F9]">

      <Navbar />


      <div className="bg-[#0F172A] text-white py-20">

        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <h1 className="text-6xl font-bold mb-6">

            Order Review & Checkout

          </h1>

          <p className="text-xl text-gray-300">

            Review your booking and complete payment

          </p>

        </div>

      </div>


      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">


          {/* LEFT - BOOKING & FOOD ITEMS */}

          <div className="lg:col-span-2 space-y-10">


            {/* BOOKING DETAILS */}

            <div className="bg-white border border-[#E2E8F0] p-10">

              <h2 className="text-3xl font-bold mb-8">

                Booking Details

              </h2>


              <div className="space-y-6">

                <div className="grid grid-cols-2 gap-6">

                  <div>

                    <p className="text-sm text-[#64748B] mb-2">

                      Check-In Date

                    </p>

                    <p className="text-xl font-bold">

                      {
                        new Date(
                          formData.check_in_date
                        ).toLocaleDateString()
                      }

                    </p>

                  </div>


                  <div>

                    <p className="text-sm text-[#64748B] mb-2">

                      Check-Out Date

                    </p>

                    <p className="text-xl font-bold">

                      {
                        new Date(
                          formData.check_out_date
                        ).toLocaleDateString()
                      }

                    </p>

                  </div>

                </div>


                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6">

                  <div className="flex justify-between items-center">

                    <h3 className="text-2xl font-bold">

                      Luxury Room

                    </h3>


                    <h3 className="text-3xl font-bold text-[#0F172A]">

                      ₹{finalRoomPrice}

                    </h3>

                  </div>

                </div>

              </div>

            </div>


            {/* SELECTED FOOD ITEMS */}

            {
              cartFoods.length > 0 && (

                <div className="bg-white border border-[#E2E8F0] p-10">

                  <h2 className="text-3xl font-bold mb-8">

                    Dining Items

                  </h2>


                  <div className="space-y-5">

                    {
                      cartFoods.map(item => (

                        <div
                          key={item.id}
                          className="flex justify-between items-center border border-[#E2E8F0] p-6"
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


                              <p className="text-sm text-[#64748B] mb-3">

                                {
                                  item.description?.substring(
                                    0,
                                    50
                                  )
                                }...

                              </p>


                              <div className="flex items-center gap-2">

                                <span className="text-lg font-bold">

                                  ₹{item.price}

                                </span>

                                <span className="text-[#64748B]">

                                  x {item.quantity}

                                </span>

                              </div>

                            </div>

                          </div>


                          <div className="text-right">

                            <p className="text-2xl font-bold">

                              ₹{
                                item.price *
                                item.quantity
                              }

                            </p>

                          </div>

                        </div>
                      ))
                    }

                  </div>

                </div>
              )
            }

          </div>


          {/* RIGHT - ORDER SUMMARY */}

          <div>

            <div className="bg-white border border-[#E2E8F0] p-8 sticky top-28">

              <h2 className="text-3xl font-bold mb-10">

                Order Summary

              </h2>


              <div className="space-y-5 mb-8">

                <div className="flex justify-between">

                  <p className="text-[#64748B]">

                    Room Charges

                  </p>

                  <p className="font-bold">

                    ₹{finalRoomPrice}

                  </p>

                </div>


                {
                  cartFoods.length > 0 && (

                    <div className="flex justify-between">

                      <p className="text-[#64748B]">

                        Dining Services

                      </p>

                      <p className="font-bold">

                        ₹{totalFoodCost}

                      </p>

                    </div>
                  )
                }


              </div>


              <div className="border-t pt-6 mb-8">

                <div className="flex justify-between">

                  <h2 className="text-2xl font-bold">

                    Total

                  </h2>


                  <h2 className="text-3xl font-bold text-[#0F172A]">

                    ₹{finalGrandTotal}

                  </h2>

                </div>

              </div>


              {
                error && (

                  <div className="bg-red-100 border border-red-500 text-red-700 p-4 mb-6">

                    {error}

                  </div>
                )
              }


              <button
                onClick={handlePaymentPage}
                disabled={loading}
                className="w-full bg-[#0F172A] text-white py-4 font-bold text-lg disabled:opacity-50"
              >

                {
                  loading

                    ? 'Processing Payment...'

                    : 'Complete Payment'
                }

              </button>


              <button
                onClick={() =>
                  navigate(-1)
                }
                disabled={loading}
                className="w-full mt-4 border border-[#0F172A] text-[#0F172A] py-4 font-bold disabled:opacity-50"
              >

                Back to Booking

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CheckoutPage
