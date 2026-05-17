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

  const [expandedRoom, setExpandedRoom] = useState(null)


  // Room Images

  const roomImages = {

    single:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&q=80',

    double:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop&q=80',

    suite:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop&q=80',

    deluxe:
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&q=80',

    presidential:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop&q=80',

    budget:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=800&fit=crop&q=80',

    penthouse:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop&q=80',

    family:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&q=80',
  }


  useEffect(() => {

    fetchRooms()

  }, [])


  const fetchRooms = async () => {

    try {

      setLoading(true)

      const response = await api.get(
        'rooms/'
      )

      setRooms(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }


  const isDateAvailable = (room, checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return true
    if (new Date(checkOutDate) <= new Date(checkInDate)) return false

    const checkIn = new Date(checkInDate).getTime()
    const checkOut = new Date(checkOutDate).getTime()

    return !room.booked_dates.some(booking => {
      const bookedIn = new Date(booking.check_in_date).getTime()
      const bookedOut = new Date(booking.check_out_date).getTime()
      return checkIn < bookedOut && checkOut > bookedIn
    })
  }

  const handleDateChange = (roomId, field, date) => {
    setSelectedDates(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: date
      }
    }))
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

    if (!isDateAvailable(rooms.find(r => r.id === roomId), dates.checkIn, dates.checkOut)) {
      alert('Selected dates are not available')
      return
    }

    navigate(`/book-room/${roomId}`, {
      state: {
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut
      }
    })
  }


  const getRoomImage = (roomType) => {

    return (
      roomImages[
        roomType?.toLowerCase()
      ] ||

      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&q=80'
    )
  }


  const filteredRooms =

    filter === 'all'

      ? rooms

      : rooms.filter(
          room =>
            room.room_type
              .toLowerCase() ===
            filter.toLowerCase()
        )


  const roomTypes = [

    'all',

    ...new Set(
      rooms.map(r => r.room_type)
    )
  ]


  return (

    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">

      {/* Navbar */}

      <Navbar />


      {/* Hero Section */}

      <div className="bg-[#0F172A] text-white py-20">

        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <h1 className="text-6xl font-bold tracking-tight mb-6">

            Luxury Accommodations

          </h1>


          <p className="text-xl text-[#CBD5E1] max-w-3xl leading-relaxed">

            Experience premium hospitality with
            elegantly designed rooms tailored
            for comfort and luxury.

          </p>

        </div>

      </div>


      {/* Main Content */}

      <div className="flex-1">

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">


          {/* Filter Section */}

          <div className="mb-14">

            <h2 className="text-3xl font-bold text-[#0F172A] mb-8">

              Filter By Room Type

            </h2>


            <div className="flex gap-4 flex-wrap">

              {
                roomTypes.map((type) => (

                  <button
                    key={type}
                    onClick={() =>
                      setFilter(type)
                    }
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                      filter === type

                        ? 'bg-[#0F172A] text-white border-[#0F172A]'

                        : 'bg-white text-[#64748B] border-[#CBD5E1] hover:border-[#0F172A] hover:text-[#0F172A]'
                    }`}
                  >

                    {
                      type.charAt(0)
                        .toUpperCase() +

                      type.slice(1)
                    }

                  </button>
                ))
              }

            </div>

          </div>


          {/* Loading */}

          {
            loading && (

              <div className="flex flex-col items-center justify-center py-20">

                <div className="w-14 h-14 border-4 border-[#CBD5E1] border-t-[#0F172A] rounded-full animate-spin mb-5">

                </div>

                <p className="text-[#64748B] text-lg">

                  Loading Rooms...

                </p>

              </div>
            )
          }


          {/* Rooms Grid */}

          {
            !loading && (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                {
                  filteredRooms.map((room) => (

                    <div
                      key={room.id}
                      className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                    >

                      {/* Room Image */}

                      <div className="relative h-72 overflow-hidden">

                        <img
                          src={
                            getRoomImage(
                              room.room_type
                            )
                          }
                          alt={room.room_type}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />


                        {/* Price Badge */}

                        <div className="absolute top-5 right-5 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white px-5 py-3 rounded-xl font-bold shadow-lg">

                          ₹
                          {
                            room.price_per_night
                          }

                          /night

                        </div>

                      </div>


                      {/* Room Content */}

                      <div className="p-8">


                        {/* Header */}

                        <div className="flex justify-between items-start mb-6">

                          <div>

                            <h3 className="text-xl font-bold text-[#0F172A] mb-2">

                              Room {
                                room.room_number
                              }

                            </h3>


                            <p className="text-sm uppercase tracking-wide text-[#64748B] font-semibold">

                              {
                                room.room_type
                              }

                            </p>

                          </div>


                          <div className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                            room.availability_status === 'available'
                              ? 'bg-[#DCFCE7] text-[#166534]'
                              : room.availability_status === 'booked'
                              ? 'bg-[#FEE2E2] text-[#991B1B]'
                              : room.availability_status === 'processing'
                              ? 'bg-[#FEF3C7] text-[#92400E]'
                              : 'bg-[#E0E7FF] text-[#3730A3]'
                          }`}>

                            {
                              room.availability_status === 'available'
                                ? 'Available'
                                : room.availability_status === 'booked'
                                ? 'Booked'
                                : room.availability_status === 'processing'
                                ? 'Processing'
                                : 'Reserved'
                            }

                          </div>

                        </div>


                        {/* Booking Info */}
                        {room.booked_dates && room.booked_dates.length > 0 && (
                          <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-lg p-4 mb-6">
                            <p className="text-xs font-semibold text-[#991B1B] mb-2">RESERVED DATES</p>
                            <div className="space-y-1">
                              {room.booked_dates.map((booking, idx) => (
                                <p key={idx} className="text-xs text-[#7F1D1D]">
                                  {new Date(booking.check_in_date).toLocaleDateString('en-IN')} - {new Date(booking.check_out_date).toLocaleDateString('en-IN')}
                                </p>
                              ))}
                            </div>
                            {room.next_available_date && (
                              <p className="text-xs text-[#7F1D1D] mt-2 pt-2 border-t border-[#FECACA]">
                                <span className="font-semibold">Available from:</span> {new Date(room.next_available_date).toLocaleDateString('en-IN')}
                              </p>
                            )}
                          </div>
                        )}


                        {/* Features */}

                        <div className="grid grid-cols-2 gap-4 mb-6 py-5 border-t border-b border-[#E2E8F0]">

                          <div>

                            <p className="text-xs text-[#64748B] uppercase mb-1">

                              Capacity

                            </p>

                            <p className="font-semibold text-[#0F172A]">

                              {
                                room.capacity
                              } Guests

                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-[#64748B] uppercase mb-1">

                              Room Style

                            </p>

                            <p className="font-semibold text-[#0F172A]">

                              Premium

                            </p>

                          </div>

                        </div>


                        {/* Description */}

                        <p className="text-[#64748B] text-sm leading-relaxed mb-6">

                          {
                            room.description ||

                            'Experience comfort and luxury in our elegantly designed premium accommodations.'
                          }

                        </p>


                        {/* Amenities */}

                        <div className="flex gap-3 flex-wrap mb-8">

                          <span className="bg-[#F1F5F9] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-medium">

                            Air Conditioning

                          </span>


                          <span className="bg-[#F1F5F9] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-medium">

                            Smart TV

                          </span>


                          <span className="bg-[#F1F5F9] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-medium">

                            Luxury Bath

                          </span>

                        </div>


                        {/* Date Selection */}
                        {room.availability_status === 'available' || room.booked_dates.length > 0 ? (
                          <div className="mb-6 p-4 bg-[#F1F5F9] rounded-lg">
                            <p className="text-xs font-semibold text-[#0F172A] mb-3 uppercase">Select Dates</p>
                            <div className="grid grid-cols-2 gap-3 mb-3">
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
                            
                            {selectedDates[room.id]?.checkIn && selectedDates[room.id]?.checkOut && (
                              <div className="text-xs text-[#64748B] mb-3 pb-3 border-b border-[#CBD5E1]">
                                <p>
                                  {Math.ceil((new Date(selectedDates[room.id].checkOut) - new Date(selectedDates[room.id].checkIn)) / (1000 * 60 * 60 * 24))} night(s) 
                                  {' '} × ₹{room.price_per_night} = 
                                  {' '} ₹{Math.ceil((new Date(selectedDates[room.id].checkOut) - new Date(selectedDates[room.id].checkIn)) / (1000 * 60 * 60 * 24)) * room.price_per_night}
                                </p>
                              </div>
                            )}

                            <button
                              onClick={() => handleBooking(room.id)}
                              disabled={!selectedDates[room.id]?.checkIn || !selectedDates[room.id]?.checkOut}
                              className={`w-full font-semibold py-3 rounded-lg transition-all ${
                                selectedDates[room.id]?.checkIn && selectedDates[room.id]?.checkOut
                                  ? 'bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:opacity-95 text-white'
                                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                              }`}
                            >
                              {isDateAvailable(room, selectedDates[room.id]?.checkIn, selectedDates[room.id]?.checkOut) || !selectedDates[room.id]?.checkIn
                                ? 'Proceed to Book'
                                : 'Dates Not Available'}
                            </button>
                          </div>
                        ) : null}


                        {/* Quick Book Button (for available rooms only) */}

                        <button
                          onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)}
                          className={`w-full font-semibold py-4 rounded-xl transition-all duration-300 shadow-md ${
                            room.availability_status === 'available'
                              ? 'bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:opacity-95 text-white'
                              : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                          }`}
                          disabled={room.availability_status !== 'available'}
                        >

                          {
                            room.availability_status === 'available'
                              ? (expandedRoom === room.id ? 'Close Date Picker' : 'Select Dates')
                              : room.availability_status === 'booked'
                              ? 'Currently Booked'
                              : room.availability_status === 'processing'
                              ? 'Processing'
                              : 'Reserved'
                          }

                        </button>

                      </div>

                    </div>
                  ))
                }

              </div>
            )
          }


          {/* No Rooms */}

          {
            !loading &&
            filteredRooms.length === 0 && (

              <div className="text-center py-20">

                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">

                  No Rooms Available

                </h2>


                <p className="text-[#64748B] text-lg">

                  Try selecting another room type.

                </p>

              </div>
            )
          }

        </div>

      </div>

    </div>
  )
}

export default RoomsPage