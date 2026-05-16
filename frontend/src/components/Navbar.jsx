
import { useState } from 'react'

import {
  useNavigate,
  useLocation
} from 'react-router-dom'


function Navbar() {

  const navigate = useNavigate()

  const location = useLocation()

  const [profileOpen, setProfileOpen] =
    useState(false)


  const navItems = [

    {
      label: 'Dashboard',
      path: '/dashboard'
    },

    {
      label: 'Rooms',
      path: '/rooms'
    },

    {
      label: 'My Bookings',
      path: '/my-bookings'
    },

    {
      label: 'Food Menu',
      path: '/food-menu'
    },

    {
      label: 'Food Orders',
      path: '/my-food-orders'
    },
  ]


  const isActive = (path) =>
    location.pathname === path


  const handleLogout = () => {

    localStorage.removeItem(
      'access_token'
    )

    localStorage.removeItem(
      'refresh_token'
    )

    navigate('/login')
  }


  return (

    <nav className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8 py-4">

        {/* Logo Section */}

        <div
          onClick={() => navigate('/dashboard')}
          className="cursor-pointer flex items-center gap-4 relative z-50"
        >

          {/* Crown Icon */}

          <div className="w-14 h-14 rounded-2xl bg-[#0F172A] flex items-center justify-center shadow-lg">

          {/* Crown Logo */}

             <img
          src="https://w7.pngwing.com/pngs/700/51/png-transparent-blue-crown-imperial-crown-crystal-crown-diamond-crown.png"
             alt="Royal Crown"
             className="w-10 h-10 object-cover scale-120 drop-shadow-md"
          />

          </div>


          {/* Brand Text */}

          <div>

            <h1
              className="text-4xl font-extrabold tracking-tight leading-none"
              style={{
                color: '#2563EB'
              }}
            >

              Royal Stay

            </h1>


            <p
              className="text-[11px] uppercase tracking-[0.35em] mt-2 font-semibold"
              style={{
                color: '#3B82F6'
              }}
            >

              Luxury Hotel Platform

            </p>

          </div>

        </div>


        {/* Navigation Links */}

        <div className="hidden md:flex items-center gap-10">

          {
            navItems.map((item) => (

              <button
                key={item.path}
                onClick={() =>
                  navigate(item.path)
                }
                className={`text-sm font-semibold transition-all duration-200 pb-1 border-b-2 ${
                  isActive(item.path)

                    ? 'border-[#0F172A] text-[#0F172A]'

                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >

                {item.label}

              </button>
            ))
          }

        </div>


        {/* Profile Section */}

        <div className="relative">

          <button
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
            className="w-12 h-12 rounded-full bg-[#0F172A] text-white font-bold flex items-center justify-center hover:scale-105 transition shadow-md"
          >

            U

          </button>


          {
            profileOpen && (

              <div className="absolute right-0 mt-4 w-60 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden">

                <button
                  onClick={() => {

                    navigate('/my-bookings')

                    setProfileOpen(false)
                  }}
                  className="w-full text-left px-6 py-4 hover:bg-[#F8FAFC] transition text-sm font-medium text-[#0F172A]"
                >

                  My Bookings

                </button>


                <button
                  onClick={() => {

                    navigate('/my-food-orders')

                    setProfileOpen(false)
                  }}
                  className="w-full text-left px-6 py-4 hover:bg-[#F8FAFC] transition text-sm font-medium text-[#0F172A]"
                >

                  My Food Orders

                </button>


                <button
                  onClick={() => {

                    navigate('/profile')

                    setProfileOpen(false)
                  }}
                  className="w-full text-left px-6 py-4 hover:bg-[#F8FAFC] transition text-sm font-medium text-[#0F172A]"
                >

                  Profile Settings

                </button>


                <hr className="border-[#E2E8F0]" />


                <button
                  onClick={handleLogout}
                  className="w-full text-left px-6 py-4 hover:bg-red-50 text-red-600 font-semibold transition text-sm"
                >

                  Logout

                </button>

              </div>
            )
          }

        </div>

      </div>

    </nav>
  )
}

export default Navbar

