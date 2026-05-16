import { useEffect, useState } from 'react'

import api from '../services/api'

import Navbar from '../components/Navbar'


function MyBookingsPage() {

  const [bookings, setBookings] = useState([])

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)


  useEffect(() => {

    fetchBookings()

  }, [])


  const fetchBookings = async () => {

    try {

      setLoading(true)

      const response = await api.get(
        'bookings/my-bookings/'
      )

      setBookings(response.data)

      setError(null)

    } catch (error) {

      console.log(error)

      setError('Failed to load bookings')

    } finally {

      setLoading(false)
    }
  }


  const handleCancelBooking = async (bookingId) => {

    if (
      !window.confirm(
        'Are you sure you want to cancel this booking?'
      )
    ) {
      return
    }


    try {

      await api.delete(
        `bookings/cancel/${bookingId}/`
      )

      setError(null)

      fetchBookings()

      alert('Booking cancelled successfully')

    } catch (error) {

      console.log(error)

      setError('Failed to cancel booking')
    }
  }


  const getStatusStyle = (status) => {

    switch (status) {

      case 'confirmed':

        return 'bg-[#DCFCE7] text-[#166534]'

      case 'pending':

        return 'bg-[#FEF3C7] text-[#B45309]'

      case 'cancelled':

        return 'bg-[#FEE2E2] text-[#B91C1C]'

      default:

        return 'bg-[#F1F5F9] text-[#0F172A]'
    }
  }


  return (

    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">

      {/* Navbar */}

      <Navbar />


      {/* Hero Section */}

      <div className="bg-[#0F172A] text-white py-20">

        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <h1 className="text-6xl font-bold tracking-tight mb-6">

            My Bookings

          </h1>


          <p className="text-xl text-[#CBD5E1] max-w-3xl leading-relaxed">

            Manage your reservations,
            review booking details,
            and track your hotel stays.

          </p>

        </div>

      </div>


      {/* Main Content */}

      <div className="flex-1">

        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-20">


          {/* Error */}

          {
            error && (

              <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] px-6 py-5 rounded-xl mb-10">

                {error}

              </div>
            )
          }


          {/* Loading */}

          {
            loading && (

              <div className="flex justify-center items-center py-20">

                <h2 className="text-2xl font-bold text-[#0F172A]">

                  Loading Bookings...

                </h2>

              </div>
            )
          }


          {/* Empty */}

          {
            !loading &&
            bookings.length === 0 && (

              <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-16 text-center">

                <h2 className="text-4xl font-bold text-[#0F172A] mb-5">

                  No Bookings Found

                </h2>


                <p className="text-[#64748B] text-lg">

                  Your room reservations will appear here.

                </p>

              </div>
            )
          }


          {/* Booking Cards */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

            {
              bookings.map((booking) => (

                <div
                  key={booking.id}
                  className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >

                  {/* Top Header */}

                  <div className="bg-[#0F172A] px-8 py-6 text-white">

                    <div className="flex justify-between items-center">

                      <div>

                        <h2 className="text-2xl font-bold mb-2">

                          Booking #{booking.id}

                        </h2>


                        <p className="text-sm text-[#CBD5E1]">

                          Luxury Reservation

                        </p>

                      </div>


                      <div className={`px-4 py-2 text-sm font-semibold rounded-xl ${getStatusStyle(booking.status)}`}>

                        {
                          booking.status

                            ? booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)

                            : (
                                booking.is_confirmed
                                  ? 'Confirmed'
                                  : 'Pending'
                              )
                        }

                      </div>

                    </div>

                  </div>


                  {/* Content */}

                  <div className="p-8">


                    {/* Room */}

                    <div className="mb-6">

                      <p className="text-xs uppercase tracking-wide text-[#64748B] mb-2">

                        Room Number

                      </p>

                      <h3 className="text-2xl font-bold text-[#0F172A]">

                        Room {booking.room}

                      </h3>

                    </div>


                    {/* Dates */}

                    <div className="grid grid-cols-2 gap-5 mb-8">

                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5">

                        <p className="text-xs uppercase tracking-wide text-[#64748B] mb-2">

                          Check In

                        </p>

                        <h4 className="font-bold text-[#0F172A]">

                          {booking.check_in_date}

                        </h4>

                      </div>


                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5">

                        <p className="text-xs uppercase tracking-wide text-[#64748B] mb-2">

                          Check Out

                        </p>

                        <h4 className="font-bold text-[#0F172A]">

                          {booking.check_out_date}

                        </h4>

                      </div>

                    </div>


                    {/* Price */}

                    <div className="border-t border-[#E2E8F0] pt-6 mb-8">

                      <div className="flex justify-between items-center">

                        <div>

                          <p className="text-sm text-[#64748B] mb-1">

                            Total Amount

                          </p>

                          <h3 className="text-3xl font-bold text-[#0F172A]">

                            ₹{booking.total_price}

                          </h3>

                        </div>

                      </div>

                    </div>


                    {/* Cancel Button */}

                    {
                      booking.status !== 'cancelled' && (

                        <button
                          onClick={() =>
                            handleCancelBooking(
                              booking.id
                            )
                          }
                          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 transition duration-300"
                        >

                          Cancel Booking

                        </button>
                      )
                    }


                    {
                      booking.status === 'cancelled' && (

                        <div className="w-full bg-[#FEE2E2] text-[#B91C1C] font-semibold py-4 text-center">

                          Booking Cancelled

                        </div>
                      )
                    }

                  </div>

                </div>
              ))
            }

          </div>

        </div>

      </div>

    </div>
  )
}

export default MyBookingsPage