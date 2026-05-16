import { useEffect, useMemo, useState } from 'react'

import {
  useNavigate,
  useParams,
  useLocation
} from 'react-router-dom'

import Navbar from '../components/Navbar'

import api from '../services/api'


function BookingPage() {

  const { roomId } = useParams()

  const navigate = useNavigate()

  const location = useLocation()


  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')


  const [selectedFoods, setSelectedFoods] =
    useState([])

  const [featuredFoods, setFeaturedFoods] =
    useState([])

  const [foodsLoading, setFoodsLoading] =
    useState(true)


  const [formData, setFormData] =
    useState(

      location.state?.formData || {

        check_in_date: '',
        check_out_date: '',
      }
    )


  const roomPrice = 5000


  useEffect(() => {

    const storedCart =
      JSON.parse(
        localStorage.getItem(
          'food_cart'
        )
      ) || []

    setSelectedFoods(storedCart)

  }, [])

  useEffect(() => {

    fetchFeaturedFoods()

  }, [])

  const fetchFeaturedFoods = async () => {

    try {

      const response = await api.get(
        'food/items/'
      )

      setFeaturedFoods(
        response.data.slice(0, 4)
      )

    } catch (error) {

      console.log(error)

    } finally {

      setFoodsLoading(false)
    }
  }


  useEffect(() => {

    localStorage.setItem(

      'food_cart',

      JSON.stringify(selectedFoods)

    )

  }, [selectedFoods])


  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value
    })
  }


  const increaseQuantity = (foodId) => {

    const updatedFoods =
      selectedFoods.map(item =>

        item.id === foodId

          ? {
              ...item,
              quantity:
                item.quantity + 1
            }

          : item
      )

    setSelectedFoods(updatedFoods)
  }


  const decreaseQuantity = (foodId) => {

    const updatedFoods =
      selectedFoods
        .map(item =>

          item.id === foodId

            ? {
                ...item,
                quantity:
                  item.quantity - 1
              }

            : item
        )
        .filter(item =>
          item.quantity > 0
        )

    setSelectedFoods(updatedFoods)
  }


  const removeItem = (foodId) => {

    const updatedFoods =
      selectedFoods.filter(
        item => item.id !== foodId
      )

    setSelectedFoods(updatedFoods)
  }

  const addFoodToCart = (food) => {

    const existingItem = selectedFoods.find(
      item => item.id === food.id
    )

    let updatedFoods = []

    if (existingItem) {

      updatedFoods = selectedFoods.map(item =>
        item.id === food.id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )

    } else {

      updatedFoods = [
        ...selectedFoods,
        {
          ...food,
          quantity: 1
        }
      ]
    }

    setSelectedFoods(updatedFoods)
  }


  const foodTotal = useMemo(() => {

    return selectedFoods.reduce(

      (total, item) =>

        total + (
          item.price *
          item.quantity
        ),

      0
    )

  }, [selectedFoods])


  const grandTotal =
    roomPrice + foodTotal


  const handleSubmit = async (e) => {

    e.preventDefault()

    setLoading(true)

    setError('')


    try {

      await api.post(

        'bookings/create/',

        {
          room: roomId,

          check_in_date:
            formData.check_in_date,

          check_out_date:
            formData.check_out_date,

          total_price:
            grandTotal.toString(),

          is_confirmed: true,
        }
      )


      if (
        selectedFoods.length > 0
      ) {

        const items =
          selectedFoods.map(item => ({

            food_item_id: item.id,

            quantity: item.quantity,

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


      localStorage.removeItem(
        'food_cart'
      )

      alert(
        'Reservation Successful'
      )

      navigate('/my-bookings')

    } catch (error) {

      console.log(error)

      setError(
        'Reservation Failed'
      )

    } finally {

      setLoading(false)
    }
  }


  return (

    <div className="min-h-screen bg-[#F1F5F9]">

      <Navbar />

      <div className="bg-[#0F172A] text-white py-20">

        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <h1 className="text-6xl font-bold mb-6">

            Complete Your Reservation

          </h1>

        </div>

      </div>


      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">


          {/* LEFT */}

          <div className="lg:col-span-2 space-y-10">

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#E2E8F0] p-10"
            >

              <h2 className="text-3xl font-bold mb-10">

                Booking Details

              </h2>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                <input
                  type="date"
                  name="check_in_date"
                  value={
                    formData.check_in_date
                  }
                  onChange={handleChange}
                  className="border border-[#CBD5E1] px-5 py-5"
                  required
                />


                <input
                  type="date"
                  name="check_out_date"
                  value={
                    formData.check_out_date
                  }
                  onChange={handleChange}
                  className="border border-[#CBD5E1] px-5 py-5"
                  required
                />

              </div>


              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-8">

                <div className="flex justify-between">

                  <h3 className="text-2xl font-bold">

                    Luxury Room

                  </h3>


                  <h3 className="text-4xl font-bold">

                    ₹{roomPrice}

                  </h3>

                </div>

              </div>

            </form>


            {/* FEATURED FOOD ITEMS */}

            <div className="bg-white border border-[#E2E8F0] p-10">

              <div className="flex justify-between items-center mb-10">

                <h2 className="text-3xl font-bold">

                  Featured Dining Options

                </h2>


                <button
                  onClick={() =>

                    navigate('/food-menu', {

                      state: {

                        returnTo: 'booking',

                        bookingData: {

                          roomId,

                          formData
                        }
                      }
                    })
                  }
                  className="text-[#0F172A] hover:underline font-semibold"
                >

                  View All Menu

                </button>

              </div>


              {foodsLoading ? (

                <p className="text-center py-10">

                  Loading menu items...

                </p>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {
                    featuredFoods.map(food => (

                      <div
                        key={food.id}
                        className="border border-[#E2E8F0] p-5 flex items-center gap-4"
                      >

                        <img
                          src={food.image_url}
                          alt={food.name}
                          className="w-24 h-24 object-cover"
                        />


                        <div className="flex-1">

                          <h3 className="text-lg font-bold mb-1">

                            {food.name}

                          </h3>


                          <p className="text-sm text-[#64748B] mb-3">

                            {food.description?.substring(0, 60)}...

                          </p>


                          <div className="flex justify-between items-center">

                            <h4 className="text-2xl font-bold">

                              ₹{food.price}

                            </h4>


                            <button
                              onClick={() =>
                                addFoodToCart(food)
                              }
                              className="bg-[#0F172A] text-white px-4 py-2 text-sm"
                            >

                              Add

                            </button>

                          </div>

                        </div>

                      </div>
                    ))
                  }

                </div>
              )}

            </div>


            {/* FOOD CART */}

            <div className="bg-white border border-[#E2E8F0] p-10">

              <div className="flex justify-between items-center mb-10">

                <h2 className="text-3xl font-bold">

                  Dining Cart

                </h2>


                <button
                  onClick={() =>

                    navigate('/food-menu', {

                      state: {

                        returnTo: 'booking',

                        bookingData: {

                          roomId,

                          formData
                        }
                      }
                    })
                  }
                  className="bg-[#0F172A] text-white px-6 py-4"
                >

                  Add More Items

                </button>

              </div>


              <div className="space-y-5">

                {
                  selectedFoods.map(item => (

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

                          <h4 className="text-lg font-bold">

                            ₹{item.price}

                          </h4>

                        </div>

                      </div>


                      <div className="flex items-center gap-5">

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.id
                            )
                          }
                          className="w-10 h-10 border"
                        >

                          -

                        </button>


                        <span className="font-bold">

                          {item.quantity}

                        </span>


                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.id
                            )
                          }
                          className="w-10 h-10 bg-[#0F172A] text-white"
                        >

                          +

                        </button>


                        <button
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="text-red-500"
                        >

                          Remove

                        </button>

                      </div>

                    </div>
                  ))
                }

              </div>

            </div>

          </div>


          {/* RIGHT */}

          <div>

            <div className="bg-white border border-[#E2E8F0] p-8 sticky top-28">

              <h2 className="text-3xl font-bold mb-10">

                Order Summary

              </h2>


              <div className="space-y-5 mb-8">

                <div className="flex justify-between">

                  <p>Room Charges</p>

                  <p>₹{roomPrice}</p>

                </div>


                <div className="flex justify-between">

                  <p>Dining Services</p>

                  <p>₹{foodTotal}</p>

                </div>

              </div>


              <div className="border-t pt-6 mb-8">

                <div className="flex justify-between">

                  <h2 className="text-3xl font-bold">

                    Total

                  </h2>


                  <h2 className="text-3xl font-bold">

                    ₹{grandTotal}

                  </h2>

                </div>

              </div>


              <button
                onClick={() =>
                  navigate('/checkout', {
                    state: {
                      roomId,
                      formData,
                      selectedFoods,
                      roomPrice,
                      foodTotal
                    }
                  })
                }
                disabled={!formData.check_in_date || !formData.check_out_date}
                className="w-full bg-[#0F172A] text-white py-5 disabled:opacity-50"
              >

                {
                  loading

                    ? 'Processing...'

                    : 'Proceed To Checkout'
                }

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default BookingPage