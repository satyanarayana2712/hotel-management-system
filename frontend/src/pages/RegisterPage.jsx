import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Clear any invalid tokens before registration
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    setLoading(true)

    try {
      const response = await api.post('users/register/', formData)

      console.log('Registration successful:', response.data)

      alert('Registration Successful! Please log in.')

      navigate('/login')

    } catch (error) {
      console.error('Registration error:', error)

      let errorMsg = 'Registration Failed'
      
      if (error.response?.data) {
        const data = error.response.data
        if (typeof data === 'object') {
          errorMsg = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value[0] : value}`)
            .join(', ')
        } else {
          errorMsg = data
        }
      }

      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2000&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Main Card */}
      <div className="w-full max-w-lg bg-white rounded-none shadow-2xl p-12 lg:p-14">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="mb-4">
                <svg className="w-12 h-12 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-serif text-slate-900 tracking-wide mb-1">Royal Stay</h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Management Portal</p>
              </div>
            </div>
          </div>
          <p className="text-slate-600 text-sm">Create your luxury hotel account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider text-xs">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-2 py-4 border-b-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 outline-none focus:border-slate-900 transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider text-xs">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-2 py-4 border-b-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 outline-none focus:border-slate-900 transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider text-xs">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone_number"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-2 py-4 border-b-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 outline-none focus:border-slate-900 transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider text-xs">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Enter a strong password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-2 py-4 border-b-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 outline-none focus:border-slate-900 transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black disabled:bg-gray-400 text-white font-serif uppercase tracking-widest text-sm py-4 px-6 transition-all duration-300 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <p className="text-gray-600 text-center mb-4 text-sm font-serif">Already have an account?</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-transparent text-slate-900 font-serif uppercase tracking-widest text-sm py-3 px-6 border-2 border-slate-900 hover:bg-slate-50 transition-all duration-300"
          >
            Sign In
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 text-red-700 px-4 py-3 rounded-none text-sm flex items-center border-l-4 border-red-500">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default RegisterPage