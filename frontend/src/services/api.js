import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
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