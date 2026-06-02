import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import api from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const getPostLoginPath = (user) => {
    if (user?.role === 'admin' || user?.is_superuser || user?.is_staff) {
      return '/rooms'
    }

    return '/dashboard'
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await api.post('users/login/', {
        email: formData.email,
        password: formData.password,
      })

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setSuccess(true)

      setTimeout(() => {
        navigate(getPostLoginPath(response.data.user), { replace: true })
      }, 900)
    } catch (err) {
      console.error('Login error:', err)
      let errorMessage = 'Login failed. Please check your credentials and try again.'

      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password'
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid email or password format'
      } else if (err.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Please try again.'
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="page-shell grid min-h-[calc(100vh-3rem)] items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="surface-card-strong relative overflow-hidden p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.9),transparent_36%)]" />
          <div className="relative z-10 max-w-xl">
            <span className="section-label">Royal Stay Portal</span>
            <h1 className="mt-5 text-5xl sm:text-6xl">Welcome back to premium hospitality.</h1>
            <p className="mt-5 max-w-lg section-copy">
              Access bookings, dining, room management, and concierge support from one polished dashboard.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { value: '24/7', label: 'Concierge support' },
                { value: '250+', label: 'Luxury rooms' },
                { value: '5★', label: 'Guest experience' },
              ].map((item) => (
                <div key={item.label} className="card p-4">
                  <div className="text-2xl font-bold text-[var(--text-strong)]">{item.value}</div>
                  <div className="mt-1 text-sm text-[var(--muted)]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-card p-6 sm:p-8 lg:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-4xl">Sign in</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">Use your account to continue to the hotel portal.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Login successful. Redirecting to dashboard...
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="input-base"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="input-base"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1 text-sm">
              <label className="flex items-center gap-2 text-[var(--muted)]">
                <input type="checkbox" className="h-4 w-4 rounded border-[var(--border)]" />
                Remember me
              </label>
              <button
                type="button"
                className="font-semibold text-[var(--secondary)] underline-offset-4 hover:underline"
                onClick={() => alert('Forgot password functionality will be implemented soon.')}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary mt-2 w-full rounded-2xl py-4">
              {loading ? (
                <span className="loading-shell">
                  <span className="loading-dots text-white">
                    <span />
                    <span />
                    <span />
                  </span>
                  Signing in
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            <span className="h-px flex-1 bg-[var(--border)]" />
            Or
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="btn btn-secondary w-full rounded-2xl py-4"
          >
            Create Your Account
          </button>

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            © 2026 Hotel Management System. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  )
}
