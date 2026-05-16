import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './routes/ProtectedRoute'
import RoomsPage from './pages/RoomsPage'
import BookingPage from './pages/BookingPage'
import CheckoutPage from './pages/CheckoutPage'
import MyBookingsPage from './pages/MyBookingsPage'
import FoodMenuPage from './pages/FoodMenuPage'
import FoodCartPage from './pages/FoodCartPage'
import MyFoodOrdersPage from './pages/MyFoodOrdersPage'
import PaymentPage from './pages/PaymentPage'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <RoomsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-room/:roomId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

          <Route
             path="/food-menu"
             element={
             <ProtectedRoute>
             <FoodMenuPage />
            </ProtectedRoute>
             }
          />

         <Route
          path="/food-cart"
          element={
            <ProtectedRoute>
            <FoodCartPage />
             </ProtectedRoute>
            }
           />

         <Route
          path="/my-food-orders"
          element={
            <ProtectedRoute>
            <MyFoodOrdersPage />
             </ProtectedRoute>
            }
           />

         <Route
           path="/payment"
           element={
             <ProtectedRoute>
               <PaymentPage />
             </ProtectedRoute>
           }
         />

      </Routes>

    </BrowserRouter>

  )
}

export default App