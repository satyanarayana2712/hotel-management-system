import { useEffect, useState } from 'react'

import {
  useNavigate,
  useLocation
} from 'react-router-dom'

import Navbar from '../components/Navbar'

import Toast from '../components/Toast'

import api from '../services/api'

import { getUserStorage, setUserStorage } from '../services/storageUtils'


function FoodMenuPage() {

  const navigate = useNavigate()

  const location = useLocation()


  const returnTo =
    location.state?.returnTo

  const bookingData =
    location.state?.bookingData


  const [foods, setFoods] = useState([])

  const [cart, setCart] = useState(
    getUserStorage('food_cart', [])
  )

  const [loading, setLoading] =
    useState(true)

  const [showToast, setShowToast] =
    useState(false)

  const [toastMessage, setToastMessage] =
    useState('')


  useEffect(() => {

    fetchFoods()

  }, [])


  const fetchFoods = async () => {

    try {

      const response = await api.get(
        'food/items/'
      )

      setFoods(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }


  const addToCart = (food) => {

    const existingItem = cart.find(

      item => item.id === food.id
    )

    let updatedCart = []


    if (existingItem) {

      updatedCart = cart.map(item =>

        item.id === food.id

          ? {
              ...item,
              quantity: item.quantity + 1
            }

          : item
      )

      setToastMessage(
        `${food.name} quantity updated`
      )

    } else {

      updatedCart = [

        ...cart,

        {
          ...food,
          quantity: 1
        }
      ]

      setToastMessage(
        `${food.name} added to cart`
      )
    }

    setShowToast(true)

    setCart(updatedCart)

    setUserStorage('food_cart', updatedCart)


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
    }
  }


  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading...

      </div>
    )
  }


  return (

    <div className="min-h-screen bg-[#F1F5F9]">

      <Navbar />


      <div className="bg-[#0F172A] text-white py-14 sm:py-16 lg:py-20">

        <div className="page-shell-lg px-4 sm:px-6 lg:px-8 flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center">

          <div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">

              Premium Dining Experience

            </h1>

          </div>


          {
            cart.length > 0 && (

              <button
                onClick={() =>
                  navigate('/food-cart', {

                    state: {

                      returnTo,

                      bookingData
                    }
                  })
                }
                className="w-full sm:w-auto bg-white text-[#0F172A] px-6 sm:px-8 py-4 font-bold text-base sm:text-lg hover:bg-gray-100 rounded-2xl"
              >

                View Cart ({cart.length})

              </button>
            )
          }

        </div>

      </div>


      <div className="page-shell-lg px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">

          {
            foods.map((food) => (

              <div
                key={food.id}
                className="bg-white border border-[#E2E8F0] overflow-hidden rounded-2xl shadow-sm"
              >

                <img
                  src={food.image_url}
                  alt={food.name}
                  className="w-full h-56 sm:h-64 lg:h-72 object-cover"
                />


                <div className="p-5 sm:p-6 lg:p-8">

                  <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[#0F172A]">

                    {food.name}

                  </h2>


                  <p className="text-[#64748B] mb-5 sm:mb-6 text-sm sm:text-base">

                    {food.description}

                  </p>


                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">

                      ₹{food.price}

                    </h3>


                    <button
                      onClick={() =>
                        addToCart(food)
                      }
                      className="w-full sm:w-auto bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold"
                    >

                      Add To Cart

                    </button>

                  </div>

                </div>

              </div>
            ))
          }

        </div>

      </div>

      {
        showToast && (

          <Toast

            message={toastMessage}

            type="success"

            onClose={() =>
              setShowToast(false)
            }

          />
        )
      }

    </div>
  )
}

export default FoodMenuPage