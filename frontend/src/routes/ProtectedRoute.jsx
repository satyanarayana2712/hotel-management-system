import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'


const decodeJwtPayload = (token) => {
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('Invalid JWT format')
  }

  const base64 = parts[1]
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const paddedBase64 =
    base64 +
    '='.repeat((4 - (base64.length % 4)) % 4)

  return JSON.parse(atob(paddedBase64))
}


function ProtectedRoute({ children }) {

  const [isValid, setIsValid] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setIsValid(false)
      return
    }

    try {
      // Decode JWT token to check expiry
      const decoded = decodeJwtPayload(token)
      const currentTime = Math.floor(Date.now() / 1000)

      if (decoded.exp && decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        setIsValid(false)
      } else {
        setIsValid(true)
      }
    } catch (error) {
      console.log('Token validation error:', error)
      setIsValid(false)
    }
  }, [])

  if (isValid === null) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0F172A]"></div></div>
  }

  if (!isValid) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute