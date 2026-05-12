import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../services/api'


function LoginPage() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })


  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }


  const handleSubmit = async (event) => {

    event.preventDefault()

    try {

      const response = await api.post(
        'users/login/',
        formData
      )

      localStorage.setItem(
        'access_token',
        response.data.access
      )

      localStorage.setItem(
        'refresh_token',
        response.data.refresh
      )

      alert('Login Successful')

      navigate('/dashboard')

    } catch (error) {

      console.log(error)

      alert('Invalid Credentials')
    }
  }


  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="w-full p-3 border rounded mb-4"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="w-full p-3 border rounded mb-4"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default LoginPage