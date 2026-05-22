import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

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
import ConformationPage from './pages/ConformationPage'
import AIChatbot from './components/AIChatbot'

function App() {

  return (

    <div className="app-shell">

      <BrowserRouter>

        <main className="app-main">

          <Routes>

      <Route
        path="/"
            element={<Navigate to="/login" />}
           />

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

      <Route
         path="/confirmation"
           element={<ConformationPage />}
        />

          </Routes>

        </main>

        <AIChatbot />

      </BrowserRouter>

    </div>

  )
}

export default App