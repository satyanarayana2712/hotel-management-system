import { useEffect, useState } from 'react'

import {
  useNavigate,
  useLocation
} from 'react-router-dom'

import Navbar from '../components/Navbar'

import Toast from '../components/Toast'

import api from '../services/api'

import { getUserStorage, setUserStorage } from '../services/storageUtils'


const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch (error) {
    return null
  }
}


function FoodMenuPage() {

  const navigate = useNavigate()

  const location = useLocation()


  const returnTo =
    location.state?.returnTo

  const bookingData =
    location.state?.bookingData


  const currentUser = getStoredUser()
  const isFoodManager =
    currentUser?.role === 'admin' ||
    currentUser?.is_staff ||
    currentUser?.is_superuser


  const [foods, setFoods] = useState([])

  const [cart, setCart] = useState(
    getUserStorage('food_cart', [])
  )

  const [loading, setLoading] =
    useState(true)

  const [showToast, setShowToast] =
    useState(false)

  const [toastMessage, setToastMessage] =
    useState('')

  const [saving, setSaving] = useState(false)

  const [formError, setFormError] = useState('')

  const [formSuccess, setFormSuccess] = useState('')

  const [editingFoodId, setEditingFoodId] = useState(null)

  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    category: 'starter',
    price: '',
    image_url: '',
    available: true,
    preparation_time: 15,
    is_vegetarian: false,
    is_vegan: false,
  })


  useEffect(() => {

    fetchFoods()

  }, [])


  const resetFoodForm = () => {
    setFoodForm({
      name: '',
      description: '',
      category: 'starter',
      price: '',
      image_url: '',
      available: true,
      preparation_time: 15,
      is_vegetarian: false,
      is_vegan: false,
    })
    setEditingFoodId(null)
    setFormError('')
  }


  const fetchFoods = async () => {

    try {

      const response = await api.get(
        'food/items/'
      )

      setFoods(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }


  const handleFoodFormChange = (field, value) => {
    setFoodForm(prev => ({
      ...prev,
      [field]: value,
    }))
    setFormError('')
    setFormSuccess('')
  }


  const handleEditFood = (food) => {
    setEditingFoodId(food.id)
    setFoodForm({
      name: food.name || '',
      description: food.description || '',
      category: food.category || 'starter',
      price: food.price ?? '',
      image_url: food.image_url || '',
      available: food.available ?? true,
      preparation_time: food.preparation_time ?? 15,
      is_vegetarian: food.is_vegetarian ?? false,
      is_vegan: food.is_vegan ?? false,
    })
    setFormError('')
    setFormSuccess('')
  }


  const handleDeleteFood = async (foodId) => {
    const confirmed = window.confirm('Delete this food item permanently?')

    if (!confirmed) return

    try {
      setSaving(true)
      await api.delete(`food/items/${foodId}/delete/`)
      if (editingFoodId === foodId) {
        resetFoodForm()
      }
      await fetchFoods()
      setFormSuccess('Food item deleted successfully.')
    } catch (error) {
      console.log(error)
      setFormError(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Failed to delete food item.'
      )
    } finally {
      setSaving(false)
    }
  }


  const handleFoodSubmit = async (event) => {
    event.preventDefault()

    if (!isFoodManager) return

    const payload = {
      name: foodForm.name.trim(),
      description: foodForm.description.trim(),
      category: foodForm.category,
      price: Number(foodForm.price),
      image_url: foodForm.image_url.trim(),
      available: foodForm.available,
      preparation_time: Number(foodForm.preparation_time),
      is_vegetarian: foodForm.is_vegetarian,
      is_vegan: foodForm.is_vegan,
    }

    if (!payload.name || !payload.category || !payload.price) {
      setFormError('Name, category, and price are required.')
      return
    }

    try {
      setSaving(true)
      setFormError('')
      setFormSuccess('')

      if (editingFoodId) {
        await api.put(`food/items/${editingFoodId}/update/`, payload)
        setFormSuccess('Food item updated successfully.')
      } else {
        await api.post('food/items/create/', payload)
        setFormSuccess('Food item created successfully.')
      }

      resetFoodForm()
      await fetchFoods()
    } catch (error) {
      console.log(error)
      setFormError(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Failed to save food item.'
      )
    } finally {
      setSaving(false)
    }
  }


  const addToCart = (food) => {

    const existingItem = cart.find(

      item => item.id === food.id
    )

    let updatedCart = []


    if (existingItem) {

      updatedCart = cart.map(item =>

        item.id === food.id

          ? {
              ...item,
              quantity: item.quantity + 1
            }

          : item
      )

      setToastMessage(
        `${food.name} quantity updated`
      )

    } else {

      updatedCart = [

        ...cart,

        {
          ...food,
          quantity: 1
        }
      ]

      setToastMessage(
        `${food.name} added to cart`
      )
    }

    setShowToast(true)

    setCart(updatedCart)

    setUserStorage('food_cart', updatedCart)


    if (returnTo === 'booking') {

      navigate(

        `/book-room/${bookingData.roomId}`,

        {

          state: {

            formData:
              bookingData.formData
          }
        }
      )
    }
  }


  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading...

      </div>
    )
  }


  return (

    <div className="min-h-screen bg-[#F1F5F9]">

      <Navbar />


      <div className="bg-[#0F172A] text-white py-14 sm:py-16 lg:py-20">

        <div className="page-shell-lg px-4 sm:px-6 lg:px-8 flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center">

          <div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">

              Premium Dining Experience

            </h1>

          </div>


          {
            !isFoodManager && cart.length > 0 && (

              <button
                onClick={() =>
                  navigate('/food-cart', {

                    state: {

                      returnTo,

                      bookingData
                    }
                  })
                }
                className="w-full sm:w-auto bg-white text-[#0F172A] px-6 sm:px-8 py-4 font-bold text-base sm:text-lg hover:bg-gray-100 rounded-2xl"
              >

                View Cart ({cart.length})

              </button>
            )
          }

        </div>

      </div>


      <div className="page-shell-lg px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">

        {isFoodManager && (
          <section className="mb-10 sm:mb-14 rounded-3xl border border-[#CBD5E1] bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                  {editingFoodId ? 'Edit Food Item' : 'Create Food Item'}
                </h2>
                <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-3xl">
                  Manage the hotel menu from one place.
                </p>
              </div>

              {editingFoodId && (
                <button
                  type="button"
                  onClick={resetFoodForm}
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

            <form onSubmit={handleFoodSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Name</label>
                <input
                  type="text"
                  value={foodForm.name}
                  onChange={(e) => handleFoodFormChange('name', e.target.value)}
                  className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                  placeholder="Paneer Tikka"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Category</label>
                <select
                  value={foodForm.category}
                  onChange={(e) => handleFoodFormChange('category', e.target.value)}
                  className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                >
                  <option value="starter">Starter</option>
                  <option value="veg_main">Vegetarian Main Course</option>
                  <option value="non_veg_main">Non-Vegetarian Main Course</option>
                  <option value="bread">Bread (Roti/Naan)</option>
                  <option value="rice">Rice Dishes (Biryani/Pulao)</option>
                  <option value="dessert">Dessert/Sweets</option>
                  <option value="beverage">Beverage</option>
                  <option value="salad">Salad</option>
                  <option value="soup">Soup</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={foodForm.price}
                  onChange={(e) => handleFoodFormChange('price', e.target.value)}
                  className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                  placeholder="450"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Preparation Time (minutes)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={foodForm.preparation_time}
                  onChange={(e) => handleFoodFormChange('preparation_time', e.target.value)}
                  className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Image URL</label>
                <input
                  type="url"
                  value={foodForm.image_url}
                  onChange={(e) => handleFoodFormChange('image_url', e.target.value)}
                  className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                  placeholder="https://..."
                />
              </div>

              <div className="lg:col-span-3">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Description</label>
                <textarea
                  rows="3"
                  value={foodForm.description}
                  onChange={(e) => handleFoodFormChange('description', e.target.value)}
                  className="w-full rounded-2xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#0F172A]"
                  placeholder="Describe the item"
                />
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#CBD5E1] px-4 py-3">
                <input
                  id="food-available"
                  type="checkbox"
                  checked={foodForm.available}
                  onChange={(e) => handleFoodFormChange('available', e.target.checked)}
                  className="h-4 w-4 rounded border-[#CBD5E1] text-[#0F172A]"
                />
                <label htmlFor="food-available" className="text-sm font-medium text-[#0F172A]">
                  Available
                </label>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#CBD5E1] px-4 py-3">
                <input
                  id="food-veg"
                  type="checkbox"
                  checked={foodForm.is_vegetarian}
                  onChange={(e) => handleFoodFormChange('is_vegetarian', e.target.checked)}
                  className="h-4 w-4 rounded border-[#CBD5E1] text-[#0F172A]"
                />
                <label htmlFor="food-veg" className="text-sm font-medium text-[#0F172A]">
                  Vegetarian
                </label>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#CBD5E1] px-4 py-3">
                <input
                  id="food-vegan"
                  type="checkbox"
                  checked={foodForm.is_vegan}
                  onChange={(e) => handleFoodFormChange('is_vegan', e.target.checked)}
                  className="h-4 w-4 rounded border-[#CBD5E1] text-[#0F172A]"
                />
                <label htmlFor="food-vegan" className="text-sm font-medium text-[#0F172A]">
                  Vegan
                </label>
              </div>

              <div className="lg:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                <p className="text-sm text-[#64748B]">
                  {editingFoodId ? `Editing item #${editingFoodId}` : 'Create a new menu item.'}
                </p>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingFoodId ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">

          {
            foods.map((food) => (

              <div
                key={food.id}
                className="bg-white border border-[#E2E8F0] overflow-hidden rounded-2xl shadow-sm"
              >

    <img
    src={food.image_url?.trim()}
    alt={food.name}
    onError={(e) => {
        e.target.src =
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38";
    }}
    className="w-full h-56 sm:h-64 lg:h-72 object-cover"
     />


                <div className="p-5 sm:p-6 lg:p-8">

                  <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[#0F172A]">

                    {food.name}

                  </h2>


                  <p className="text-[#64748B] mb-5 sm:mb-6 text-sm sm:text-base">

                    {food.description}

                  </p>


                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">

                      ₹{food.price}

                    </h3>

                      {!isFoodManager ? (
                        <button
                          onClick={() =>
                            addToCart(food)
                          }
                          className="w-full sm:w-auto bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold"
                        >

                          Add To Cart

                        </button>
                      ) : (
                        <div className="flex w-full gap-3 sm:w-auto">
                          <button
                            type="button"
                            onClick={() => handleEditFood(food)}
                            className="flex-1 sm:flex-none bg-[#0F172A] text-white px-6 py-3 rounded-xl font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFood(food.id)}
                            disabled={saving}
                            className="flex-1 sm:flex-none bg-red-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      )}

                  </div>

                </div>

              </div>
            ))
          }

        </div>

      </div>

      {
        showToast && (

          <Toast

            message={toastMessage}

            type="success"

            onClose={() =>
              setShowToast(false)
            }

          />
        )
      }

    </div>
  )
}

export default FoodMenuPage