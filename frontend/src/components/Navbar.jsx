
import { useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch (error) {
    return null
  }
}

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentUser = getStoredUser()
  const isAdminUser = currentUser?.role === 'admin' || currentUser?.is_staff || currentUser?.is_superuser

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Rooms', path: '/rooms' },
    { label: 'Food Menu', path: '/food-menu' },
    ...(!isAdminUser
      ? [
          { label: 'My Bookings', path: '/my-bookings' },
          { label: 'Food Orders', path: '/my-food-orders' },
        ]
      : []),
  ]

  const handleNavigate = (path) => {
    navigate(path)
    setMobileOpen(false)
    setProfileOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color:var(--bg-elevated)] backdrop-blur-xl">
      <div className="page-shell-lg flex items-center justify-between gap-4 py-4">
        <button
          type="button"
          onClick={() => handleNavigate('/dashboard')}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--secondary),#0f2132)] text-white shadow-[var(--shadow-sm)]">
            <img
              src="https://w7.pngwing.com/pngs/700/51/png-transparent-blue-crown-imperial-crown-crystal-crown-diamond-crown.png"
              alt="Royal Stay"
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl">Royal Stay</h1>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              Luxury Hotel Platform
            </p>
          </div>
        </button>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNavigate(item.path)}
              className={`btn px-4 py-2 text-sm ${
                location.pathname === item.path ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-icon lg:hidden"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Open navigation menu"
          >
            ☰
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(prev => !prev)}
              className="btn-icon bg-[var(--surface)] font-semibold"
              aria-label="Open profile menu"
            >
              U
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
                {!isAdminUser && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/my-bookings')}
                      className="w-full px-5 py-4 text-left text-sm font-medium hover:bg-[var(--primary-soft)]"
                    >
                      My Bookings
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/my-food-orders')}
                      className="w-full px-5 py-4 text-left text-sm font-medium hover:bg-[var(--primary-soft)]"
                    >
                      My Food Orders
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleNavigate('/profile')}
                  className="w-full px-5 py-4 text-left text-sm font-medium hover:bg-[var(--primary-soft)]"
                >
                  Profile Settings
                </button>
                <div className="border-t border-[var(--border)]" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-5 py-4 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] lg:hidden">
          <div className="page-shell-lg grid gap-2 py-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  location.pathname === item.path
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--primary-soft)] text-[var(--text-strong)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

