import jsPDF from 'jspdf'
import {
    useLocation,
    useNavigate
  } from 'react-router-dom'
  
  import Navbar from '../components/Navbar'
  
  
  function ConfirmationPage() {
  
    const navigate = useNavigate()
  
    const location = useLocation()
    const downloadInvoice = () => {

        const doc = new jsPDF()
        doc.setFont('helvetica')
      
      
        // TITLE
      
        doc.setFontSize(24)
      
        doc.text(
          'ROYAL STAY HOTEL',
          20,
          20
        )
      
      
        // SUBTITLE
      
        doc.setFontSize(12)
      
        doc.text(
          'Luxury Hotel Invoice',
          20,
          30
        )
      
      
        // LINE
      
        doc.line(
          20,
          35,
          190,
          35
        )
      
      
        // BOOKING DETAILS
      
        doc.setFontSize(14)
      
        doc.text(
          `Booking ID: ${bookingId}`,
          20,
          50
        )
      
        doc.text(
          `Room: ${roomId}`,
          20,
          60
        )
      
        doc.text(
          `Payment ID: ${paymentId}`,
          20,
          70
        )
      
        doc.text(
            `Total Paid: Rs. ${totalAmount}`,
          20,
          80
        )
      
      
        // FOOD ITEMS
      
        let y = 100
      
      
        if (foodItems.length > 0) {
      
          doc.setFontSize(18)
      
          doc.text(
            'Food Orders',
            20,
            y
          )
      
          y += 15
      
      
          foodItems.forEach(item => {
      
            doc.setFontSize(12)
      
            doc.text(
      
                `${item.name} x${item.quantity} - Rs. ${item.price * item.quantity}`,
      
              20,
      
              y
            )
      
            y += 10
          })
        }
      
      
        // FOOTER
      
        y += 20
      
        doc.line(
          20,
          y,
          190,
          y
        )
      
        y += 15
      
        doc.setFontSize(14)
      
        doc.text(
          'Thank You For Choosing Royal Stay',
          20,
          y
        )
      
      
        // SAVE PDF
      
        doc.save(
          `invoice-${bookingId}.pdf`
        )
      }
  
  
    const {
  
      bookingId,
  
      roomId,
  
      totalAmount,
  
      paymentId,
  
      foodItems = [],
  
      hasRoomBooking = false,
  
      hasFoodOrder = false
  
    } = location.state || {}
  
  
    return (
  
      <div className="min-h-screen bg-[#F1F5F9]">
  
        <Navbar />
  
  
        {/* HERO */}
  
        <div className="bg-[#0F172A] text-white py-24">
  
          <div className="max-w-5xl mx-auto text-center px-4">
  
            <div className="w-28 h-28 bg-green-500 flex items-center justify-center mx-auto mb-10 rounded-full">
  
              <span className="text-5xl font-bold">
  
                ✓
  
              </span>
  
            </div>
  
  
            <h1 className="text-6xl font-bold mb-6">
  
              Payment Successful
  
            </h1>
  
  
            <p className="text-xl text-[#CBD5E1]">
  
              {
                hasRoomBooking && hasFoodOrder
  
                  ? 'Your reservation and dining order have been confirmed.'
  
                  : hasRoomBooking
  
                    ? 'Your reservation has been confirmed successfully.'
  
                    : 'Your dining order has been placed successfully.'
              }
  
            </p>
  
          </div>
  
        </div>
  
  
        {/* MAIN */}
  
        <div className="max-w-6xl mx-auto px-4 py-16">
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
  
  
            {/* LEFT */}
  
            <div className="lg:col-span-2 space-y-8">
  
  
              {/* BOOKING SUMMARY */}
  
              {
                hasRoomBooking && (
  
                  <div className="bg-white border border-[#E2E8F0] p-10">
  
                    <h2 className="text-3xl font-bold mb-10">
  
                      Reservation Summary
  
                    </h2>
  
  
                    <div className="space-y-6">
  
                      <div className="flex justify-between">
  
                        <p className="text-[#64748B]">
  
                          Booking ID
  
                        </p>
  
  
                        <h3 className="font-bold text-xl">
  
                          #{bookingId}
  
                        </h3>
  
                      </div>
  
  
                      <div className="flex justify-between">
  
                        <p className="text-[#64748B]">
  
                          Room Number
  
                        </p>
  
  
                        <h3 className="font-bold text-xl">
  
                          #{roomId}
  
                        </h3>
  
                      </div>
  
                    </div>
  
                  </div>
                )
              }
  
  
              {/* FOOD SUMMARY */}
  
              {
                hasFoodOrder && (
  
                  <div className="bg-white border border-[#E2E8F0] p-10">
  
                    <h2 className="text-3xl font-bold mb-10">
  
                      Dining Services
  
                    </h2>
  
  
                    <div className="space-y-5">
  
                      {
                        foodItems.map(item => (
  
                          <div
                            key={item.id}
                            className="flex justify-between items-center border border-[#E2E8F0] p-5"
                          >
  
                            <div className="flex items-center gap-5">
  
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-24 h-24 object-cover"
                              />
  
  
                              <div>
  
                                <h3 className="text-xl font-bold mb-2">
  
                                  {item.name}
  
                                </h3>
  
  
                                <p className="text-[#64748B]">
  
                                  Quantity:
                                  {' '}
                                  {item.quantity}
  
                                </p>
  
                              </div>
  
                            </div>
  
  
                            <h3 className="text-2xl font-bold">
  
                              ₹
                              {
                                item.price *
                                item.quantity
                              }
  
                            </h3>
  
                          </div>
                        ))
                      }
  
                    </div>
  
                  </div>
                )
              }
  
            </div>
  
  
            {/* RIGHT */}
  
            <div>
  
              <div className="bg-white border border-[#E2E8F0] sticky top-28">
  
                <div className="bg-[#0F172A] text-white px-8 py-6">
  
                  <h2 className="text-3xl font-bold">
  
                    Payment Details
  
                  </h2>
  
                </div>
  
  
                <div className="p-8">
  
                  <div className="space-y-8 mb-10">
  
                    <div>
  
                      <p className="text-sm text-[#64748B] mb-2">
  
                        Razorpay Payment ID
  
                      </p>
  
  
                      <h3 className="font-bold break-all">
  
                        {paymentId}
  
                      </h3>
  
                    </div>
  
  
                    <div>
  
                      <p className="text-sm text-[#64748B] mb-2">
  
                        Total Paid
  
                      </p>
  
  
                      <h2 className="text-5xl font-bold">
  
                        ₹{totalAmount}
  
                      </h2>
  
                    </div>
  
                  </div>
  
  
                  {/* BUTTONS */}
  
                  <div className="space-y-4">
                  <button
      onClick={downloadInvoice}
      className="w-full bg-green-600 text-white py-5 text-lg font-semibold hover:bg-green-700 transition"
    >

    Download Invoice

         </button>
  
  
                    {
                      hasRoomBooking && (
  
                        <button
                          onClick={() =>
                            navigate('/my-bookings')
                          }
                          className="w-full bg-[#0F172A] text-white py-5 text-lg font-semibold"
                        >
  
                          View Room Booking
  
                        </button>
                      )
                    }
  
  
                    {
                      hasFoodOrder && (
  
                        <button
                          onClick={() =>
                            navigate('/my-food-orders')
                          }
                          className="w-full bg-[#1E293B] text-white py-5 text-lg font-semibold"
                        >
  
                          View Food Orders
  
                        </button>
                      )
                    }
  
  
                    <button
                      onClick={() =>
                        navigate('/dashboard')
                      }
                      className="w-full border border-[#CBD5E1] py-5 text-lg font-semibold"
                    >
  
                      Back To Dashboard
  
                    </button>
  
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
    )
  }
  
  export default ConfirmationPage