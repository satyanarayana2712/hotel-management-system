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
      const response = await api.get('bookings/my-bookings/')
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
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await api.delete(`bookings/cancel/${bookingId}/`)
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
      <Navbar />

      <section className="bg-[#0F172A] text-white py-14 sm:py-16 lg:py-20">
        <div className="page-shell-lg px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 text-white">
            My Bookings
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#CBD5E1] max-w-3xl leading-relaxed">
            Manage your reservations, review booking details, and track your hotel stays.
          </p>
        </div>
      </section>

      <main className="flex-1">
        <div className="page-shell-lg w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
          {error && (
            <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] px-4 sm:px-6 py-4 sm:py-5 rounded-xl mb-8 sm:mb-10 text-sm sm:text-base">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-14 sm:py-20">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] text-center">
                Loading Bookings...
              </h2>
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-8 sm:p-12 lg:p-16 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4 sm:mb-5">
                No Bookings Found
              </h2>
              <p className="text-[#64748B] text-base sm:text-lg">
                Your room reservations will appear here.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl"
              >
                <header className="bg-[#0F172A] px-5 sm:px-6 lg:px-8 py-5 sm:py-6 text-white">
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">
                        Booking #{booking.id}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#CBD5E1]">
                        Luxury Reservation
                      </p>
                    </div>

                    <div className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl self-start ${getStatusStyle(booking.status)}`}>
                      {booking.status
                        ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
                        : booking.is_confirmed
                          ? 'Confirmed'
                          : 'Pending'}
                    </div>
                  </div>
                </header>

                <div className="p-5 sm:p-6 lg:p-8">
                  <div className="mb-6 sm:mb-8">
                    <p className="text-xs uppercase tracking-wide text-[#64748B] mb-2">
                      Room Number
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                      Room {booking.room}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 sm:p-5 rounded-xl">
                      <p className="text-xs uppercase tracking-wide text-[#64748B] mb-2">
                        Check In
                      </p>
                      <h4 className="font-bold text-[#0F172A] break-words">
                        {booking.check_in_date}
                      </h4>
                    </div>

                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 sm:p-5 rounded-xl">
                      <p className="text-xs uppercase tracking-wide text-[#64748B] mb-2">
                        Check Out
                      </p>
                      <h4 className="font-bold text-[#0F172A] break-words">
                        {booking.check_out_date}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6 sm:mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0] gap-4">
                      <span className="text-[#64748B]">Guests</span>
                      <span className="font-semibold text-[#0F172A] text-right">
                        {booking.number_of_guests}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0] gap-4">
                      <span className="text-[#64748B]">Total Price</span>
                      <span className="font-semibold text-[#0F172A] text-right">
                        ₹{booking.total_price}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 gap-4">
                      <span className="text-[#64748B]">Status</span>
                      <span className={`font-semibold px-3 py-1 rounded-lg ${getStatusStyle(booking.status)}`}>
                        {booking.status
                          ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
                          : booking.is_confirmed
                            ? 'Confirmed'
                            : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={booking.status === 'cancelled'}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                  >
                    {booking.status === 'cancelled' ? 'Cancelled' : 'Cancel Booking'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MyBookingsPage