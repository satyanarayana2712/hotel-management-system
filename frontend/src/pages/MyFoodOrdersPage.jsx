import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

import api from '../services/api'


function MyFoodOrdersPage() {

  const [orders, setOrders] = useState([])

  const [loading, setLoading] = useState(true)


  useEffect(() => {

    fetchOrders()

  }, [])


  const fetchOrders = async () => {

    try {

      const response = await api.get(
        'food/orders/my-orders/'
      )

      setOrders(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }


  const cancelOrder = async (orderId) => {

    try {

      await api.delete(
        `food/orders/${orderId}/cancel/`
      )

      fetchOrders()

      alert('Order Cancelled')

    } catch (error) {

      console.log(error)

      alert('Cancellation Failed')
    }
  }


  const getStatusColor = (status) => {

    switch (status) {

      case 'order_confirmed':

        return 'bg-[#DBEAFE] text-[#1D4ED8]'

      case 'preparing':

        return 'bg-[#FEF3C7] text-[#B45309]'

      case 'ready':

        return 'bg-[#DCFCE7] text-[#166534]'

      case 'delivered':

        return 'bg-[#E0E7FF] text-[#4338CA]'

      case 'cancelled':

        return 'bg-[#FEE2E2] text-[#B91C1C]'

      default:

        return 'bg-[#F1F5F9] text-[#0F172A]'
    }
  }


  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">

        <h1 className="text-2xl font-bold text-[#0F172A]">

          Loading Orders...

        </h1>

      </div>
    )
  }


  return (

    <div className="min-h-screen bg-[#F1F5F9]">

      {/* Navbar */}

      <Navbar />


      {/* Hero Section */}

      <div className="bg-[#0F172A] text-white py-20">

        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <h1 className="text-6xl font-bold tracking-tight mb-6">

            Your Food Orders

          </h1>


          <p className="text-xl text-[#CBD5E1] max-w-3xl leading-relaxed">

            Track your restaurant orders,
            delivery status, and dining history
            in one place.

          </p>

        </div>

      </div>


      {/* Main Content */}

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16">


        {
          orders.length === 0

            ? (

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-16 text-center shadow-sm">

                <h2 className="text-4xl font-bold text-[#0F172A] mb-5">

                  No Orders Yet

                </h2>


                <p className="text-[#64748B] text-lg">

                  Your food orders will appear here once you place an order.

                </p>

              </div>
            )

            : (

              <div className="space-y-10">

                {
                  orders.map(order => (

                    <div
                      key={order.id}
                      className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden"
                    >

                      {/* Order Header */}

                      <div className="border-b border-[#E2E8F0] px-8 py-6 flex flex-col lg:flex-row justify-between lg:items-center gap-5">

                        <div>

                          <h2 className="text-3xl font-bold text-[#0F172A] mb-2">

                            Order #{order.id}

                          </h2>


                          <p className="text-[#64748B]">

                            {
                              new Date(
                                order.created_at
                              ).toLocaleString()
                            }

                          </p>

                        </div>


                        <div className="flex items-center gap-4">

                          <div className={`px-5 py-3 rounded-xl text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>

                            {
                              order.status.replace(
                                '_',
                                ' '
                              )
                            }

                          </div>


                          <div className="text-right">

                            <p className="text-sm text-[#64748B] mb-1">

                              Total Amount

                            </p>

                            <h3 className="text-3xl font-bold text-[#0F172A]">

                              ₹{order.total_price}

                            </h3>

                          </div>

                        </div>

                      </div>


                      {/* Order Items */}

                      <div className="p-8">

                        <div className="space-y-6">

                          {
                            order.items.map(item => (

                              <div
                                key={item.id}
                                className="flex justify-between items-center border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-md transition"
                              >

                                <div className="flex items-center gap-5">

                                  {/* Food Image */}

                                  <img
                                    src={
                                      item.food_item.image_url
                                    }
                                    alt={
                                      item.food_item.name
                                    }
                                    className="w-24 h-24 object-cover rounded-2xl"
                                  />


                                  {/* Food Details */}

                                  <div>

                                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">

                                      {
                                        item.food_item.name
                                      }

                                    </h3>


                                    <p className="text-sm text-[#64748B] mb-2 capitalize">

                                      {
                                        item.food_item.category.replace(
                                          '_',
                                          ' '
                                        )
                                      }

                                    </p>


                                    <div className="flex gap-3">

                                      <span className="bg-[#F1F5F9] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-medium">

                                        Qty: {item.quantity}

                                      </span>


                                      <span className="bg-[#DBEAFE] text-[#1D4ED8] text-xs px-4 py-2 rounded-xl font-medium">

                                        {
                                          item.food_item.preparation_time
                                        } mins

                                      </span>

                                    </div>

                                  </div>

                                </div>


                                {/* Price */}

                                <div className="text-right">

                                  <p className="text-sm text-[#64748B] mb-1">

                                    Item Total

                                  </p>

                                  <h3 className="text-2xl font-bold text-[#0F172A]">

                                    ₹
                                    {
                                      item.price_at_order *
                                      item.quantity
                                    }

                                  </h3>

                                </div>

                              </div>
                            ))
                          }

                        </div>


                        {/* Bottom Section */}

                        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mt-10 pt-8 border-t border-[#E2E8F0]">

                          <div>

                            <h3 className="text-2xl font-bold text-[#0F172A] mb-2">

                              Delivery To Room

                            </h3>

                            <p className="text-[#64748B]">

                              Your order is being processed by our hospitality team.

                            </p>

                          </div>


                          {
                            order.status === 'order_confirmed' && (

                              <button
                                onClick={() =>
                                  cancelOrder(order.id)
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold transition"
                              >

                                Cancel Order

                              </button>
                            )
                          }

                        </div>

                      </div>

                    </div>
                  ))
                }

              </div>
            )
        }

      </div>

    </div>
  )
}

export default MyFoodOrdersPage