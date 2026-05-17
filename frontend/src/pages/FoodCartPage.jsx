import { useEffect, useMemo, useState } from 'react'

import {
  useNavigate,
  useLocation
} from 'react-router-dom'

import Navbar from '../components/Navbar'

import { getUserStorage, setUserStorage } from '../services/storageUtils'


function FoodCartPage() {

  const navigate = useNavigate()

  const location = useLocation()


  const returnTo =
    location.state?.returnTo

  const bookingData =
    location.state?.bookingData


  const [cartItems, setCartItems] = useState(
    getUserStorage('food_cart', [])
  )


  useEffect(() => {
    setUserStorage('food_cart', cartItems)
  }, [cartItems])


  const increaseQuantity = (foodId) => {

    const updatedCart = cartItems.map(item =>

      item.id === foodId

        ? {
            ...item,
            quantity: item.quantity + 1
          }

        : item
    )

    setCartItems(updatedCart)
  }


  const decreaseQuantity = (foodId) => {

    const updatedCart = cartItems
      .map(item =>

        item.id === foodId

          ? {
              ...item,
              quantity: Math.max(
                0,
                item.quantity - 1
              )
            }

          : item
      )
      .filter(item =>
        item.quantity > 0
      )

    setCartItems(updatedCart)
  }


  const removeItem = (foodId) => {

    const updatedCart = cartItems.filter(
      item => item.id !== foodId
    )

    setCartItems(updatedCart)
  }


  const totalPrice = useMemo(() => {

    return cartItems.reduce(

      (total, item) =>
        total + (
          item.price * item.quantity
        ),

      0
    )

  }, [cartItems])


  const handleProceedToCheckout = () => {

    if (returnTo === 'booking') {

      navigate(

        `/book-room/${bookingData.roomId}`,

        {

          state: {

            formData:
              bookingData.formData
          }
        }
      )

    } else {

      navigate('/payment', {

        state: {

          cartFoods: cartItems,

          totalPrice: totalPrice,

          isFoodOnly: true
        }
      })
    }
  }


  return (

    <div className="min-h-screen bg-[#F1F5F9]">

      <Navbar />


      <div className="bg-[#0F172A] text-white py-20">

        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <h1 className="text-6xl font-bold mb-4">

            Your Food Cart

          </h1>

          <p className="text-xl text-gray-300">

            {
              cartItems.length === 0

                ? 'Your cart is empty'

                : `${cartItems.length} item(s) in cart`
            }

          </p>

        </div>

      </div>


      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">

        {
          cartItems.length === 0 ? (

            <div className="bg-white border border-[#E2E8F0] p-20 text-center">

              <p className="text-2xl font-bold text-[#64748B] mb-8">

                No items in your cart

              </p>

              <button
                onClick={() =>
                  navigate('/food-menu')
                }
                className="bg-[#0F172A] text-white px-8 py-4 text-lg"
              >

                Continue Shopping

              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">


              {/* LEFT - FOOD ITEMS */}

              <div className="lg:col-span-2">

                <div className="bg-white border border-[#E2E8F0] p-10">

                  <h2 className="text-3xl font-bold mb-10">

                    Cart Items ({cartItems.length})

                  </h2>


                  <div className="space-y-6">

                    {
                      cartItems.map(item => (

                        <div
                          key={item.id}
                          className="border border-[#E2E8F0] p-6 rounded-lg hover:shadow-lg transition"
                        >

                          <div className="flex gap-6">

                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-32 h-32 object-cover"
                            />


                            <div className="flex-1">

                              <h3 className="text-2xl font-bold mb-2">

                                {item.name}

                              </h3>


                              <p className="text-[#64748B] mb-4">

                                {item.description}

                              </p>


                              <div className="flex items-center gap-4 mb-4">

                                <span className="text-2xl font-bold text-[#0F172A]">

                                  ₹{item.price}

                                </span>


                                {
                                  item.preparation_time && (

                                    <span className="text-sm text-[#64748B]">

                                      Prep time: {item.preparation_time} mins

                                    </span>
                                  )
                                }

                              </div>

                            </div>

                          </div>


                          <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#E2E8F0]">

                            <div className="flex items-center gap-4">

                              <button
                                onClick={() =>
                                  decreaseQuantity(
                                    item.id
                                  )
                                }
                                className="w-10 h-10 border border-[#CBD5E1] flex items-center justify-center hover:bg-[#F1F5F9]"
                              >

                                -

                              </button>


                              <span className="text-xl font-bold w-8 text-center">

                                {item.quantity}

                              </span>


                              <button
                                onClick={() =>
                                  increaseQuantity(
                                    item.id
                                  )
                                }
                                className="w-10 h-10 bg-[#0F172A] text-white flex items-center justify-center hover:bg-[#1E293B]"
                              >

                                +

                              </button>

                            </div>


                            <div className="text-right">

                              <p className="text-sm text-[#64748B] mb-2">

                                Subtotal

                              </p>

                              <p className="text-3xl font-bold text-[#0F172A]">

                                ₹{
                                  item.price *
                                  item.quantity
                                }

                              </p>

                            </div>

                          </div>


                          <button
                            onClick={() =>
                              removeItem(item.id)
                            }
                            className="w-full mt-6 text-red-500 hover:bg-red-50 py-2 font-semibold"
                          >

                            Remove Item

                          </button>

                        </div>
                      ))
                    }

                  </div>


                  <button
                    onClick={() =>
                      navigate('/food-menu')
                    }
                    className="w-full mt-10 border border-[#0F172A] text-[#0F172A] py-4 font-bold text-lg hover:bg-[#F1F5F9]"
                  >

                    Continue Shopping

                  </button>

                </div>

              </div>


              {/* RIGHT - CART SUMMARY */}

              <div>

                <div className="bg-white border border-[#E2E8F0] p-8 sticky top-28">

                  <h2 className="text-3xl font-bold mb-10">

                    Cart Summary

                  </h2>


                  <div className="space-y-5 mb-8">

                    <div className="flex justify-between">

                      <p className="text-[#64748B]">

                        Items

                      </p>

                      <p className="font-bold">

                        {cartItems.length}

                      </p>

                    </div>


                    <div className="flex justify-between">

                      <p className="text-[#64748B]">

                        Subtotal

                      </p>

                      <p className="font-bold">

                        ₹{totalPrice}

                      </p>

                    </div>


                    <div className="flex justify-between">

                      <p className="text-[#64748B]">

                        Delivery Charges

                      </p>

                      <p className="font-bold">

                        ₹0

                      </p>

                    </div>

                  </div>


                  <div className="border-t pt-6 mb-8">

                    <div className="flex justify-between">

                      <h3 className="text-2xl font-bold">

                        Total

                      </h3>

                      <h3 className="text-3xl font-bold text-[#0F172A]">

                        ₹{totalPrice}

                      </h3>

                    </div>

                  </div>


                  <button
                    onClick={
                      handleProceedToCheckout
                    }
                    className="w-full bg-[#0F172A] text-white py-4 font-bold text-lg hover:bg-[#1E293B]"
                  >

                    Proceed to Checkout

                  </button>

                </div>

              </div>

            </div>
          )
        }

      </div>

    </div>
  )
}

export default FoodCartPage
