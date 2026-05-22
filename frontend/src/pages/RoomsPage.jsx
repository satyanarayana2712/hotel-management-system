import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import api from '../services/api'

function RoomsPage() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedDates, setSelectedDates] = useState({})

  const roomImages = {
    single: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&q=80',
    double: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop&q=80',
    suite: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop&q=80',
    deluxe: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&q=80',
    presidential: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop&q=80',
    budget: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=800&fit=crop&q=80',
    penthouse: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop&q=80',
    family: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&q=80',
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await api.get('rooms/')
      setRooms(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (roomId, field, date) => {
    setSelectedDates(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: date,
      },
    }))
  }

  const isDateAvailable = (room, checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return true
    if (new Date(checkOutDate) <= new Date(checkInDate)) return false

    const checkIn = new Date(checkInDate).getTime()
    const checkOut = new Date(checkOutDate).getTime()

    return !(room.booked_dates || []).some(booking => {
      const bookedIn = new Date(booking.check_in_date).getTime()
      const bookedOut = new Date(booking.check_out_date).getTime()
      return checkIn < bookedOut && checkOut > bookedIn
    })
  }

  const handleBooking = (roomId) => {
    const dates = selectedDates[roomId]

    if (!dates?.checkIn || !dates?.checkOut) {
      alert('Please select both check-in and check-out dates')
      return
    }

    if (new Date(dates.checkOut) <= new Date(dates.checkIn)) {
      alert('Check-out date must be after check-in date')
      return
    }

    const room = rooms.find(r => r.id === roomId)
    if (!room) return

    if (!isDateAvailable(room, dates.checkIn, dates.checkOut)) {
      alert('Selected dates are not available')
      return
    }

    navigate(`/book-room/${roomId}`, {
      state: {
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut,
      },
    })
  }

  const getRoomImage = (roomType) => roomImages[roomType?.toLowerCase()] || roomImages.single

  const filteredRooms =
    filter === 'all'
      ? rooms
      : rooms.filter(room => room.room_type?.toLowerCase() === filter.toLowerCase())

  const roomTypes = ['all', ...new Set(rooms.map(r => r.room_type).filter(Boolean))]

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <Navbar />

      <section className="bg-[#0F172A] text-white py-14 sm:py-16 lg:py-20">
        <div className="page-shell-lg px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 text-white">
            Luxury Accommodations
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#CBD5E1] max-w-3xl leading-relaxed">
            Experience premium hospitality with elegantly designed rooms tailored for comfort and luxury.
          </p>
        </div>
      </section>

      <main className="flex-1">
        <div className="page-shell-lg px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <div className="mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-6 sm:mb-8">
              Filter By Room Type
            </h2>

            <div className="flex gap-3 sm:gap-4 flex-wrap">
              {roomTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    filter === type
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#64748B] border-[#CBD5E1] hover:border-[#0F172A] hover:text-[#0F172A]'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-14 sm:py-20">
              <div className="w-14 h-14 border-4 border-[#CBD5E1] border-t-[#0F172A] rounded-full animate-spin mb-5" />
              <p className="text-[#64748B] text-base sm:text-lg text-center">
                Loading Rooms...
              </p>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {filteredRooms.map((room) => (
                <article
                  key={room.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
                    <img
                      src={getRoomImage(room.room_type)}
                      alt={room.room_type}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white px-4 py-2 rounded-xl font-bold shadow-lg text-sm sm:text-base">
                      ₹{room.price_per_night}/night
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-5 sm:mb-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-1 sm:mb-2">
                          Room {room.room_number}
                        </h3>
                        <p className="text-xs sm:text-sm uppercase tracking-wide text-[#64748B] font-semibold">
                          {room.room_type}
                        </p>
                      </div>

                      <div className={`px-3 py-2 rounded-xl text-xs font-semibold self-start ${
                        room.availability_status === 'available'
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : room.availability_status === 'booked'
                            ? 'bg-[#FEE2E2] text-[#991B1B]'
                            : room.availability_status === 'processing'
                              ? 'bg-[#FEF3C7] text-[#92400E]'
                              : 'bg-[#E0E7FF] text-[#3730A3]'
                      }`}>
                        {room.availability_status === 'available'
                          ? 'Available'
                          : room.availability_status === 'booked'
                            ? 'Booked'
                            : room.availability_status === 'processing'
                              ? 'Processing'
                              : 'Reserved'}
                      </div>
                    </div>

                    {(room.booked_dates || []).length > 0 && (
                      <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-lg p-4 mb-6">
                        <p className="text-xs font-semibold text-[#991B1B] mb-2">RESERVED DATES</p>
                        <div className="space-y-1">
                          {room.booked_dates.map((booking, idx) => (
                            <p key={idx} className="text-xs text-[#7F1D1D] break-words">
                              {new Date(booking.check_in_date).toLocaleDateString('en-IN')} - {new Date(booking.check_out_date).toLocaleDateString('en-IN')}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8 py-5 border-t border-b border-[#E2E8F0]">
                      <div>
                        <p className="text-xs text-[#64748B] uppercase mb-1">Capacity</p>
                        <p className="font-semibold text-[#0F172A]">
                          {room.capacity} Guests
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#64748B] uppercase mb-1">Room Style</p>
                        <p className="font-semibold text-[#0F172A]">Premium</p>
                      </div>
                    </div>

                    <p className="text-[#64748B] text-sm leading-relaxed mb-6">
                      {room.description || 'Experience comfort and luxury in our elegantly designed premium accommodations.'}
                    </p>

                    <div className="flex gap-3 flex-wrap mb-8">
                      <span className="bg-[#F1F5F9] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-medium">Air Conditioning</span>
                      <span className="bg-[#F1F5F9] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-medium">Smart TV</span>
                      <span className="bg-[#F1F5F9] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-medium">Luxury Bath</span>
                    </div>

                    <div className="mb-6 p-4 bg-[#F1F5F9] rounded-lg">
                      <p className="text-xs font-semibold text-[#0F172A] mb-3 uppercase">Select Dates</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs text-[#64748B] block mb-1">Check-in</label>
                          <input
                            type="date"
                            value={selectedDates[room.id]?.checkIn || ''}
                            onChange={(e) => handleDateChange(room.id, 'checkIn', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#64748B] block mb-1">Check-out</label>
                          <input
                            type="date"
                            value={selectedDates[room.id]?.checkOut || ''}
                            onChange={(e) => handleDateChange(room.id, 'checkOut', e.target.value)}
                            min={selectedDates[room.id]?.checkIn || new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleBooking(room.id)}
                        className="w-full bg-[#0F172A] text-white py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition-all duration-300"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default RoomsPage
