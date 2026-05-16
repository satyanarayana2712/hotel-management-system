import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import api from '../services/api'


function RoomsPage() {

  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])

  const [loading, setLoading] = useState(true)

  const [filter, setFilter] = useState('all')


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


                          <div className="bg-[#DCFCE7] text-[#166534] px-3 py-2 rounded-xl text-xs font-semibold">

                            Available

                          </div>

                        </div>


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


                        {/* Button */}

                        <button
                          onClick={() =>
                            navigate(
                              `/book-room/${room.id}`
                            )
                          }
                          className="w-full bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:opacity-95 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-md"
                        >

                          Book Room

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