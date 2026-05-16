import { useEffect, useState } from 'react'

import {
  useNavigate,
  useLocation
} from 'react-router-dom'

import Navbar from '../components/Navbar'

import Toast from '../components/Toast'

import api from '../services/api'


function FoodMenuPage() {

  const navigate = useNavigate()

  const location = useLocation()


  const returnTo =
    location.state?.returnTo

  const bookingData =
    location.state?.bookingData


  const [foods, setFoods] = useState([])

  const [cart, setCart] = useState(

    JSON.parse(
      localStorage.getItem('food_cart')
    ) || []

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


    localStorage.setItem(

      'food_cart',

      JSON.stringify(updatedCart)
    )


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


      <div className="bg-[#0F172A] text-white py-20">

        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex justify-between items-center">

          <div>

            <h1 className="text-6xl font-bold">

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
                className="bg-white text-[#0F172A] px-8 py-4 font-bold text-lg hover:bg-gray-100"
              >

                View Cart ({cart.length})

              </button>
            )
          }

        </div>

      </div>


      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {
            foods.map((food) => (

              <div
                key={food.id}
                className="bg-white border border-[#E2E8F0] overflow-hidden"
              >

                <img
                  src={food.image_url}
                  alt={food.name}
                  className="w-full h-72 object-cover"
                />


                <div className="p-8">

                  <h2 className="text-2xl font-bold mb-3">

                    {food.name}

                  </h2>


                  <p className="text-[#64748B] mb-6">

                    {food.description}

                  </p>


                  <div className="flex justify-between items-center">

                    <h3 className="text-3xl font-bold">

                      ₹{food.price}

                    </h3>


                    <button
                      onClick={() =>
                        addToCart(food)
                      }
                      className="bg-[#0F172A] text-white px-6 py-3"
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