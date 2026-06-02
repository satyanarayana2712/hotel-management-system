import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import api from '../services/api'

function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const isAdminUser = user?.role === 'admin' || user?.is_staff || user?.is_superuser

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('users/profile/')
      setUser(response.data)
    } catch (error) {
      console.log(error)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-card flex flex-col items-center gap-4 px-8 py-10 text-center">
          <div className="loading-dots text-[var(--primary)]" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h1 className="text-3xl">Loading dashboard</h1>
          <p className="text-[var(--muted)]">Preparing your hotel experience...</p>
        </div>
      </div>
    )
  }

  const customerFeatures = [
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

  const adminQuickActions = [
    {
      title: 'Manage Rooms',
      description: 'Create, update, and remove rooms from the live inventory.',
      button: 'Open Rooms Manager',
      path: '/rooms',
      image:
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200',
    },
    {
      title: 'Manage Food Menu',
      description: 'Maintain menu items, pricing, availability, and kitchen-ready details.',
      button: 'Open Food Manager',
      path: '/food-menu',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200',
    },
    {
      title: 'Hotel Operations',
      description: 'Move between bookings, rooms, and dining tools from one control center.',
      button: 'Go to Rooms',
      path: '/rooms',
      image:
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200',
    },
  ]

  return (
    <div className="min-h-screen text-[var(--text-strong)]">
      <Navbar />

      <section className="page-shell-lg py-6 sm:py-8 lg:py-10">
        <div className="surface-card-strong overflow-hidden p-6 sm:p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="section-label">
                {isAdminUser ? 'Hotel Operations Console' : 'Luxury Hospitality Platform'}
              </span>
              <h1 className="mt-5 text-5xl sm:text-6xl leading-tight">
                {isAdminUser
                  ? 'Control rooms, dining, and guest services from one dashboard.'
                  : 'Experience premium comfort and modern hospitality.'}
              </h1>
              <p className="mt-5 max-w-2xl section-copy">
                {isAdminUser
                  ? `Welcome back, ${user?.username}. Manage rooms and food inventory, keep operations current, and move quickly between admin tools.`
                  : `Welcome back, ${user?.username}. Discover elegant rooms, premium dining, and seamless hotel experiences designed for modern travelers.`}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/rooms')}
                  className="btn btn-primary rounded-2xl px-6 py-4"
                >
                  {isAdminUser ? 'Manage Rooms' : 'Book A Room'}
                </button>
                <button
                  onClick={() => navigate('/food-menu')}
                  className="btn btn-secondary rounded-2xl px-6 py-4"
                >
                  {isAdminUser ? 'Manage Food Menu' : 'Explore Dining'}
                </button>
              </div>
            </div>

            <div className="card overflow-hidden rounded-[28px]">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600"
                alt="Luxury Hotel"
                className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[460px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell-lg pb-6 sm:pb-8 lg:pb-12">
        <div className="container-grid container-grid-3">
          {isAdminUser ? (
            <>
              <div className="card p-6 sm:p-8">
                <h2 className="text-5xl">Rooms</h2>
                <p className="mt-3 text-[var(--muted)]">Create and update live room inventory</p>
              </div>
              <div className="card p-6 sm:p-8">
                <h2 className="text-5xl">Food</h2>
                <p className="mt-3 text-[var(--muted)]">Maintain menu items and availability</p>
              </div>
              <div className="card p-6 sm:p-8">
                <h2 className="text-5xl">Ops</h2>
                <p className="mt-3 text-[var(--muted)]">Move faster across hotel management tools</p>
              </div>
            </>
          ) : (
            <>
              <div className="card p-6 sm:p-8">
                <h2 className="text-5xl">250+</h2>
                <p className="mt-3 text-[var(--muted)]">Premium luxury rooms</p>
              </div>
              <div className="card p-6 sm:p-8">
                <h2 className="text-5xl">24/7</h2>
                <p className="mt-3 text-[var(--muted)]">Concierge & room service</p>
              </div>
              <div className="card p-6 sm:p-8">
                <h2 className="text-5xl">5★</h2>
                <p className="mt-3 text-[var(--muted)]">Luxury hospitality experience</p>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="page-shell-lg pb-6 sm:pb-8 lg:pb-12">
        <div className="mb-8 text-center">
          <span className="section-label">{isAdminUser ? 'Admin Shortcuts' : 'Explore Services'}</span>
          <h2 className="section-title mt-4">
            {isAdminUser
              ? 'Fast access to the management screens you use most.'
              : 'Everything your stay needs, arranged with clarity.'}
          </h2>
          <p className="section-copy mx-auto mt-4 max-w-3xl">
            {isAdminUser
              ? 'Jump directly into room operations and menu control without leaving the dashboard.'
              : 'Designed to provide a seamless and luxurious hospitality experience for every guest.'}
          </p>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {(isAdminUser ? adminQuickActions : customerFeatures).map((feature, index) => (
            <article
              key={feature.title}
              className={`grid gap-6 lg:grid-cols-2 lg:items-center ${index % 2 !== 0 ? 'lg:[direction:rtl]' : ''}`}
            >
              <div className={`overflow-hidden rounded-[28px] ${index % 2 !== 0 ? 'lg:[direction:ltr]' : ''}`}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[420px]"
                />
              </div>

              <div className={`surface-card p-6 sm:p-8 ${index % 2 !== 0 ? 'lg:[direction:ltr]' : ''}`}>
                <h3 className="text-4xl">{feature.title}</h3>
                <p className="mt-4 section-copy">{feature.description}</p>
                <button
                  onClick={() => navigate(feature.path)}
                  className="btn btn-primary mt-6 rounded-2xl px-6 py-4"
                >
                  {feature.button}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {!isAdminUser && (
        <section className="page-shell-lg pb-6 sm:pb-8 lg:pb-12">
          <div className="surface-card-strong grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <span className="section-label">Need Assistance?</span>
              <h2 className="section-title mt-4">Our hospitality team is available 24/7.</h2>
              <p className="section-copy mt-4 max-w-2xl">
                Contact our concierge team for booking assistance, premium room upgrades, dining support, and luxury hospitality services.
              </p>
            </div>

            <div className="card p-6 sm:p-8">
              <div className="grid gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Contact Number</p>
                  <h3 className="mt-2 text-3xl">+91 98765 43210</h3>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Email Address</p>
                  <h3 className="mt-2 text-2xl">support@royalstay.com</h3>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Location</p>
                  <h3 className="mt-2 text-2xl">Hyderabad, India</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-[var(--border)] bg-[color:var(--bg-elevated)] py-8 backdrop-blur-xl">
        <div className="page-shell-lg flex flex-col gap-4 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div>
            <h3 className="text-2xl">Royal Stay</h3>
            <p className="mt-1 text-[var(--muted)]">Luxury Hotel Management Platform</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
            <button onClick={() => navigate('/rooms')} className="btn btn-ghost rounded-2xl px-5 py-3">
              Rooms
            </button>
            <button onClick={() => navigate('/food-menu')} className="btn btn-ghost rounded-2xl px-5 py-3">
              Dining
            </button>
            {!isAdminUser && (
              <button onClick={() => navigate('/my-bookings')} className="btn btn-ghost rounded-2xl px-5 py-3">
                Bookings
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DashboardPage


