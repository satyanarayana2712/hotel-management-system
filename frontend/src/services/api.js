import axios from 'axios'

const LOCAL_API_URL = 'http://127.0.0.1:8000/api/v1/'
const PRODUCTION_API_URL = 'https://hotel-management-system-xalj.onrender.com/api/v1/'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    (import.meta.env.DEV ? LOCAL_API_URL : PRODUCTION_API_URL)
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  
  // Only add token if it exists AND is not for public endpoints (register, login)
  if (token && !config.url.includes('register') && !config.url.includes('login')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Handle token expiration errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default api