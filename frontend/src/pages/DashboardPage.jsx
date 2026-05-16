
import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import api from '../services/api'

import Navbar from '../components/Navbar'


function DashboardPage() {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)


  useEffect(() => {

    fetchUserProfile()

  }, [])


  const fetchUserProfile = async () => {

    try {

      const response = await api.get(
        'users/profile/'
      )

      setUser(response.data)

    } catch (error) {

      console.log(error)

      localStorage.removeItem(
        'access_token'
      )

      localStorage.removeItem(
        'refresh_token'
      )

      navigate('/login')

    } finally {

      setLoading(false)
    }
  }


  if (loading) {

    return (

      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">

        <h1 className="text-2xl font-semibold text-[#0F172A]">

          Loading Dashboard...

        </h1>

      </div>
    )
  }


  const features = [

    {
      title: 'Luxury Rooms',
      description:
        'Experience premium suites and luxury accommodations designed for comfort and elegance.',
      button: 'Explore Rooms',
      path: '/rooms',
      image:
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200',
    },

    {
      title: 'Premium Dining',
      description:
        'Order gourmet food and beverages directly from your room with our smart dining system.',
      button: 'View Food Menu',
      path: '/food-menu',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200',
    },

    {
      title: 'Manage Bookings',
      description:
        'Track your reservations, food orders, and upcoming stays from one dashboard.',
      button: 'My Bookings',
      path: '/my-bookings',
      image:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200',
    },
  ]


  return (

    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A]">

      <Navbar />


      {/* Hero Section */}

      <section className="bg-[#0F172A] text-white">

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-24">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}

            <div>

              <p className="uppercase tracking-[0.4em] text-sm text-[#CBD5E1] mb-6">

                Luxury Hospitality Platform

              </p>


              <h1 className="text-6xl font-bold leading-tight mb-8">

                Experience Premium Comfort
                And Modern Hospitality

              </h1>


              <p className="text-xl text-[#CBD5E1] leading-relaxed mb-10 max-w-2xl">

                Welcome back, {user?.username}.
                Discover elegant rooms, premium dining,
                and seamless hotel experiences designed
                for modern travelers.

              </p>


              <div className="flex flex-col sm:flex-row gap-5">

                <button
                  onClick={() => navigate('/rooms')}
                  className="bg-white text-[#0F172A] px-8 py-5 rounded-2xl font-semibold hover:bg-[#E2E8F0] transition"
                >

                  Book A Room

                </button>


                <button
                  onClick={() => navigate('/food-menu')}
                  className="border border-white text-white px-8 py-5 rounded-2xl font-semibold hover:bg-white hover:text-[#0F172A] transition"
                >

                  Explore Dining

                </button>

              </div>

            </div>


            {/* Right */}

            <div className="relative">

              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600"
                alt="Luxury Hotel"
                className="rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              />

            </div>

          </div>

        </div>

      </section>


      {/* Stats */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-sm">

              <h2 className="text-5xl font-bold mb-4">

                250+

              </h2>

              <p className="text-[#64748B] text-lg">

                Premium Luxury Rooms

              </p>

            </div>


            <div className="bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-sm">

              <h2 className="text-5xl font-bold mb-4">

                24/7

              </h2>

              <p className="text-[#64748B] text-lg">

                Concierge & Room Service

              </p>

            </div>


            <div className="bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-sm">

              <h2 className="text-5xl font-bold mb-4">

                5★

              </h2>

              <p className="text-[#64748B] text-lg">

                Luxury Hospitality Experience

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Features */}

      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <div className="mb-16 text-center">

            <h2 className="text-5xl font-bold mb-6">

              Explore Our Services

            </h2>

            <p className="text-[#64748B] text-xl max-w-3xl mx-auto leading-relaxed">

              Designed to provide a seamless and luxurious
              hospitality experience for every guest.

            </p>

          </div>


          <div className="space-y-16">

            {
              features.map((feature, index) => (

                <div
                  key={feature.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${
                    index % 2 !== 0
                      ? 'lg:grid-flow-col-dense'
                      : ''
                  }`}
                >

                  {/* Image */}

                  <div
                    className={
                      index % 2 !== 0
                        ? 'lg:col-start-2'
                        : ''
                    }
                  >

                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="rounded-3xl shadow-xl h-[420px] w-full object-cover"
                    />

                  </div>


                  {/* Content */}

                  <div
                    className={
                      index % 2 !== 0
                        ? 'lg:col-start-1'
                        : ''
                    }
                  >

                    <h3 className="text-4xl font-bold mb-6">

                      {feature.title}

                    </h3>


                    <p className="text-[#64748B] text-lg leading-relaxed mb-8">

                      {feature.description}

                    </p>


                    <button
                      onClick={() =>
                        navigate(feature.path)
                      }
                      className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#1E293B] transition"
                    >

                      {feature.button}

                    </button>

                  </div>

                </div>
              ))
            }

          </div>

        </div>

      </section>


      {/* Contact Section */}

      <section className="bg-[#0F172A] text-white py-24">

        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div>

              <p className="uppercase tracking-[0.4em] text-sm text-[#CBD5E1] mb-5">

                Need Assistance?

              </p>


              <h2 className="text-5xl font-bold mb-8 leading-tight">

                Our Hospitality Team Is
                Available 24/7

              </h2>


              <p className="text-[#CBD5E1] text-lg leading-relaxed max-w-2xl">

                Contact our concierge team for booking
                assistance, premium room upgrades,
                dining support, and luxury hospitality
                services.

              </p>

            </div>


            <div className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-3xl p-10">

              <div className="space-y-8">

                <div>

                  <p className="text-sm uppercase tracking-widest text-[#CBD5E1] mb-2">

                    Contact Number

                  </p>

                  <h3 className="text-3xl font-bold">

                    +91 98765 43210

                  </h3>

                </div>


                <div>

                  <p className="text-sm uppercase tracking-widest text-[#CBD5E1] mb-2">

                    Email Address

                  </p>

                  <h3 className="text-2xl font-semibold">

                    support@royalstay.com

                  </h3>

                </div>


                <div>

                  <p className="text-sm uppercase tracking-widest text-[#CBD5E1] mb-2">

                    Location

                  </p>

                  <h3 className="text-2xl font-semibold">

                    Hyderabad, India

                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Footer */}

      <footer className="bg-white border-t border-[#E2E8F0] py-10">

        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row justify-between items-center gap-6">

          <div>

            <h3 className="text-2xl font-bold mb-2">

              Royal Stay

            </h3>

            <p className="text-[#64748B]">

              Luxury Hotel Management Platform

            </p>

          </div>


          <div className="flex gap-8 text-sm text-[#64748B]">

            <button
              onClick={() => navigate('/rooms')}
              className="hover:text-[#0F172A] transition"
            >

              Rooms

            </button>


            <button
              onClick={() => navigate('/food-menu')}
              className="hover:text-[#0F172A] transition"
            >

              Dining

            </button>


            <button
              onClick={() => navigate('/my-bookings')}
              className="hover:text-[#0F172A] transition"
            >

              Bookings

            </button>

          </div>

        </div>

      </footer>

    </div>
  )
}

export default DashboardPage

