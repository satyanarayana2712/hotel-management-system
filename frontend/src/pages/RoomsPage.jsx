import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import api from '../services/api'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch (error) {
    return null
  }
}

function RoomsPage() {
  const navigate = useNavigate()
  const currentUser = getStoredUser()
  const isRoomManager = currentUser?.role === 'admin'
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [selectedDates, setSelectedDates] = useState({})
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [editingRoomId, setEditingRoomId] = useState(null)
  const [roomForm, setRoomForm] = useState({
    room_number: '',
    room_type: 'single',
    price_per_night: '',
    capacity: '',
    description: '',
    is_available: true,
  })

  const roomImages = {
    single: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&q=80',
    double: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop&q=80',
    suite: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop&q=80',
    deluxe: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&q=80',
    presidential: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop&q=80',
    budget: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=800&fit=crop&q=80',
    penthouse: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop&q=80',
    family: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&q=80',
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const resetRoomForm = () => {
    setRoomForm({
      room_number: '',
      room_type: 'single',
      price_per_night: '',
      capacity: '',
      description: '',
      is_available: true,
    })
    setEditingRoomId(null)
    setFormError('')
  }

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await api.get('rooms/')
      setRooms(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoomFormChange = (field, value) => {
    setRoomForm(prev => ({
      ...prev,
      [field]: value,
    }))
    setFormError('')
    setFormSuccess('')
  }

  const handleEditRoom = (room) => {
    setEditingRoomId(room.id)
    setRoomForm({
      room_number: room.room_number || '',
      room_type: room.room_type || 'single',
      price_per_night: room.price_per_night ?? '',
      capacity: room.capacity ?? '',
      description: room.description || '',
      is_available: room.is_available ?? true,
    })
    setFormError('')
    setFormSuccess('')
  }

  const handleDeleteRoom = async (roomId) => {
    const confirmed = window.confirm('Delete this room permanently?')
    if (!confirmed) return

    try {
      setSaving(true)
      await api.delete(`rooms/delete/${roomId}/`)
      if (editingRoomId === roomId) {
        resetRoomForm()
      }
      await fetchRooms()
      setFormSuccess('Room deleted successfully.')
    } catch (error) {
      console.error('Delete room error:', error)
      setFormError(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Unable to delete room. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleRoomSubmit = async (event) => {
    event.preventDefault()

    if (!isRoomManager) return

    const payload = {
      room_number: roomForm.room_number.trim(),
      room_type: roomForm.room_type,
      price_per_night: Number(roomForm.price_per_night),
      capacity: Number(roomForm.capacity),
      description: roomForm.description.trim(),
      is_available: roomForm.is_available,
    }

    if (!payload.room_number || !payload.room_type || !payload.price_per_night || !payload.capacity) {
      setFormError('Room number, type, price, and capacity are required.')
      return
    }

    try {
      setSaving(true)
      setFormError('')
      setFormSuccess('')

      if (editingRoomId) {
        await api.put(`rooms/update/${editingRoomId}/`, payload)
        setFormSuccess('Room updated successfully.')
      } else {
        await api.post('rooms/create/', payload)
        setFormSuccess('Room created successfully.')
      }

      resetRoomForm()
      await fetchRooms()
    } catch (error) {
      console.error('Save room error:', error)
      setFormError(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Unable to save room. Please check the form and try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDateChange = (roomId, field, date) => {
    setSelectedDates(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: date,
      },
    }))
  }

  const isDateAvailable = (room, checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return true
    if (new Date(checkOutDate) <= new Date(checkInDate)) return false

    const checkIn = new Date(checkInDate).getTime()
    const checkOut = new Date(checkOutDate).getTime()

    return !(room.booked_dates || []).some(booking => {
      const bookedIn = new Date(booking.check_in_date).getTime()
      const bookedOut = new Date(booking.check_out_date).getTime()
      return checkIn < bookedOut && checkOut > bookedIn
    })
  }

  const handleBooking = (roomId) => {
    const dates = selectedDates[roomId]

    if (!dates?.checkIn || !dates?.checkOut) {
      alert('Please select both check-in and check-out dates')
      return
    }

    if (new Date(dates.checkOut) <= new Date(dates.checkIn)) {
      alert('Check-out date must be after check-in date')
      return
    }

    const room = rooms.find(r => r.id === roomId)
    if (!room) return

    if (!isDateAvailable(room, dates.checkIn, dates.checkOut)) {
      alert('Selected dates are not available')
      return
    }

    navigate(`/book-room/${roomId}`, {
      state: {
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut,
      },
    })
  }

  const getRoomImage = (roomType) => roomImages[roomType?.toLowerCase()] || roomImages.single

  const filteredRooms =
    filter === 'all'
      ? rooms
      : rooms.filter(room => room.room_type?.toLowerCase() === filter.toLowerCase())

  const roomTypes = ['all', ...new Set(rooms.map(r => r.room_type).filter(Boolean))]

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <Navbar />

      <section className="bg-[#0F172A] text-white py-14 sm:py-16 lg:py-20">
        <div className="page-shell-lg px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 text-white">
            Luxury Accommodations
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#CBD5E1] max-w-3xl leading-relaxed">
            Experience premium hospitality with elegantly designed rooms tailored for comfort and luxury.
          </p>
        </div>
      </section>

      <main className="flex-1">
        <div className="page-shell-lg px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          {isRoomManager && (
            <section className="mb-10 sm:mb-14 rounded-3xl border border-[#CBD5E1] bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                    {editingRoomId ? 'Edit Room' : 'Create Room'}
                  </h2>
                  <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-3xl">
                    Add new room inventory or update an existing room without leaving the rooms page.
                  </p>
                </div>

                {editingRoomId && (
                  <button
                    type="button"
                    onClick={resetRoomForm}
                    className="self-start rounded-xl border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#0F172A] hover:border-[#0F172A]"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {formError && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleRoomSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Room Number</label>
                  <input
                    type="text"
                    value={roomForm.room_number}
                    onChange={(e) => handleRoomFormChange('room_number', e.target.value)}
                    className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                    placeholder="A101"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Room Type</label>
                  <select
                    value={roomForm.room_type}
                    onChange={(e) => handleRoomFormChange('room_type', e.target.value)}
                    className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                  >
                    {['single', 'double', 'suite', 'deluxe', 'presidential', 'budget', 'penthouse', 'family'].map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Price per Night</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={roomForm.price_per_night}
                    onChange={(e) => handleRoomFormChange('price_per_night', e.target.value)}
                    className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                    placeholder="1200"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={roomForm.capacity}
                    onChange={(e) => handleRoomFormChange('capacity', e.target.value)}
                    className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                    placeholder="2"
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Description</label>
                  <textarea
                    rows="3"
                    value={roomForm.description}
                    onChange={(e) => handleRoomFormChange('description', e.target.value)}
                    className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                    placeholder="Describe the room features and experience"
                  />
                </div>

                <div className="flex items-center gap-3 self-end rounded-2xl border border-[#CBD5E1] px-4 py-3">
                  <input
                    id="room-available"
                    type="checkbox"
                    checked={roomForm.is_available}
                    onChange={(e) => handleRoomFormChange('is_available', e.target.checked)}
                    className="h-4 w-4 rounded border-[#CBD5E1] text-[#0F172A]"
                  />
                  <label htmlFor="room-available" className="text-sm font-medium text-[#0F172A]">
                    Available for booking
                  </label>
                </div>

                <div className="lg:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                  <p className="text-sm text-[#64748B]">
                    {editingRoomId ? `Editing room #${editingRoomId}` : 'Create a new room in the inventory.'}
                  </p>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : editingRoomId ? 'Update Room' : 'Create Room'}
                  </button>
                </div>
              </form>
            </section>
          )}

          <div className="mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-6 sm:mb-8">
              Filter By Room Type
            </h2>

            <div className="flex gap-3 sm:gap-4 flex-wrap">
              {roomTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    filter === type
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#64748B] border-[#CBD5E1] hover:border-[#0F172A] hover:text-[#0F172A]'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-14 sm:py-20">
              <div className="w-14 h-14 border-4 border-[#CBD5E1] border-t-[#0F172A] rounded-full animate-spin mb-5" />
              <p className="text-[#64748B] text-base sm:text-lg text-center">
                Loading Rooms...
              </p>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {filteredRooms.map((room) => (
                <article
                  key={room.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
                    <img
                      src={getRoomImage(room.room_type)}
                      alt={room.room_type}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white px-4 py-2 rounded-xl font-bold shadow-lg text-sm sm:text-base">
                      ₹{room.price_per_night}/night
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-5 sm:mb-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-1 sm:mb-2">
                          Room {room.room_number}
                        </h3>
                        <p className="text-xs sm:text-sm uppercase tracking-wide text-[#64748B] font-semibold">
                          {room.room_type}
                        </p>
                      </div>

                      <div className={`px-3 py-2 rounded-xl text-xs font-semibold self-start ${
                        room.availability_status === 'available'
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : room.availability_status === 'booked'
                            ? 'bg-[#FEE2E2] text-[#991B1B]'
                            : room.availability_status === 'processing'
                              ? 'bg-[#FEF3C7] text-[#92400E]'
                              : 'bg-[#E0E7FF] text-[#3730A3]'
                      }`}>
                        {room.availability_status === 'available'
                          ? 'Available'
                          : room.availability_status === 'booked'
                            ? 'Booked'
                            : room.availability_status === 'processing'
                              ? 'Processing'
                              : 'Reserved'}
                      </div>
                    </div>

                    {(room.booked_dates || []).length > 0 && (
                      <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-lg p-4 mb-6">
                        <p className="text-xs font-semibold text-[#991B1B] mb-2">RESERVED DATES</p>
                        <div className="space-y-1">
                          {room.booked_dates.map((booking, idx) => (
                            <p key={idx} className="text-xs text-[#7F1D1D] break-words">
                              {new Date(booking.check_in_date).toLocaleDateString('en-IN')} - {new Date(booking.check_out_date).toLocaleDateString('en-IN')}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8 py-5 border-t border-b border-[#E2E8F0]">
                      <div>
                        <p className="text-xs text-[#64748B] uppercase mb-1">Capacity</p>
                        <p className="font-semibold text-[#0F172A]">
                          {room.capacity} Guests
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#64748B] uppercase mb-1">Room Style</p>
                        <p className="font-semibold text-[#0F172A]">Premium</p>
                      </div>
                    </div>

                    <p className="text-[#64748B] text-sm leading-relaxed mb-6">
                      {room.description || 'Experience comfort and luxury in our elegantly designed premium accommodations.'}
                    </p>

                    <div className="flex gap-3 flex-wrap mb-8">
                      <span className="bg-[#F1F5F9] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-medium">Air Conditioning</span>
                      <span className="bg-[#F1F5F9] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-medium">Smart TV</span>
                      <span className="bg-[#F1F5F9] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-medium">Luxury Bath</span>
                    </div>

                    {isRoomManager && (
                      <div className="mb-6 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditRoom(room)}
                          className="flex-1 rounded-xl border border-[#0F172A] px-4 py-3 text-sm font-semibold text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition"
                        >
                          Edit Room
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room.id)}
                          disabled={saving}
                          className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    <div className="mb-6 p-4 bg-[#F1F5F9] rounded-lg">
                      <p className="text-xs font-semibold text-[#0F172A] mb-3 uppercase">Select Dates</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs text-[#64748B] block mb-1">Check-in</label>
                          <input
                            type="date"
                            value={selectedDates[room.id]?.checkIn || ''}
                            onChange={(e) => handleDateChange(room.id, 'checkIn', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#64748B] block mb-1">Check-out</label>
                          <input
                            type="date"
                            value={selectedDates[room.id]?.checkOut || ''}
                            onChange={(e) => handleDateChange(room.id, 'checkOut', e.target.value)}
                            min={selectedDates[room.id]?.checkIn || new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleBooking(room.id)}
                        className="w-full bg-[#0F172A] text-white py-3 rounded-xl font-semibold hover:bg-[#1E293B] transition-all duration-300"
                      >
                        Book Now
                      </button>
                    </div>

                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default RoomsPage
