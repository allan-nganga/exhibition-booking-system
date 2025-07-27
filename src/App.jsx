import { useState, useEffect } from 'react'
import BookingForm from './components/BookingForm'
import BookingSummary from './components/BookingSummary'
import AdminPanel from './components/AdminPanel'
import { Calendar, Users, Building2, CheckCircle, Sparkles, TrendingUp, Award } from 'lucide-react'
import { loadDemoData } from './utils/demoData'

function App() {
  const [bookings, setBookings] = useState([])
  const [currentBooking, setCurrentBooking] = useState(null)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('exhibitionBookings')
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    } else {
      // Load demo data if no existing bookings
      const demoBookings = loadDemoData()
      setBookings(demoBookings)
    }
  }, [])

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('exhibitionBookings', JSON.stringify(bookings))
  }, [bookings])

  const handleBookingSubmit = async (bookingData) => {
    try {
      // Validate booking data
      if (!bookingData || typeof bookingData !== 'object') {
        throw new Error('Invalid booking data. Please try again.')
      }
      
      // Validate required fields
      const requiredFields = ['companyName', 'contactPersonName', 'email', 'phoneNumber', 'boothType', 'numberOfBooths', 'preferredLocation']
      const missingFields = requiredFields.filter(field => !bookingData[field])
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }
      
      // Validate data types and values
      if (typeof bookingData.numberOfBooths !== 'number' || bookingData.numberOfBooths < 1) {
        throw new Error('Number of booths must be at least 1')
      }
      
      if (!bookingData.email.includes('@')) {
        throw new Error('Please enter a valid email address')
      }
      
      // Check for double booking
      const doubleBookingCheck = checkForDoubleBooking(bookingData)
      if (doubleBookingCheck.isDoubleBooking) {
        throw new Error(`Double booking detected: ${doubleBookingCheck.reason}`)
      }
      
      const newBooking = {
        id: Date.now().toString(),
        ...bookingData,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      }
      
      // Update state
      setBookings(prev => [...prev, newBooking])
      setCurrentBooking(newBooking)
      
    } catch (error) {
      // Re-throw the error so the BookingForm can handle it
      throw error
    }
  }

  // Function to check for double booking
  const checkForDoubleBooking = (newBooking) => {
    const existingBookings = bookings.filter(booking => booking.status !== 'cancelled')
    
    // Check for same company booking
    const sameCompany = existingBookings.find(booking => 
      booking.companyName.toLowerCase() === newBooking.companyName.toLowerCase()
    )
    if (sameCompany) {
      return {
        isDoubleBooking: true,
        reason: `Company "${newBooking.companyName}" already has a booking (ID: ${sameCompany.id})`
      }
    }
    
    // Check for same email booking
    const sameEmail = existingBookings.find(booking => 
      booking.email.toLowerCase() === newBooking.email.toLowerCase()
    )
    if (sameEmail) {
      return {
        isDoubleBooking: true,
        reason: `Email "${newBooking.email}" already has a booking (ID: ${sameEmail.id})`
      }
    }
    
    // Check for same phone booking
    const samePhone = existingBookings.find(booking => 
      booking.phoneNumber === newBooking.phoneNumber
    )
    if (samePhone) {
      return {
        isDoubleBooking: true,
        reason: `Phone number "${newBooking.phoneNumber}" already has a booking (ID: ${samePhone.id})`
      }
    }
    
    // Check for location capacity (optional - can be implemented based on business rules)
    const locationBookings = existingBookings.filter(booking => 
      booking.preferredLocation === newBooking.preferredLocation
    )
    const totalBoothsInLocation = locationBookings.reduce((sum, booking) => 
      sum + booking.numberOfBooths, 0
    )
    const maxBoothsPerLocation = 50 // Example limit
    
    if (totalBoothsInLocation + newBooking.numberOfBooths > maxBoothsPerLocation) {
      return {
        isDoubleBooking: true,
        reason: `Location "${newBooking.preferredLocation}" is at capacity. Only ${maxBoothsPerLocation - totalBoothsInLocation} booths remaining.`
      }
    }
    
    return { isDoubleBooking: false }
  }

  // Function to update booking status
  const handleUpdateBooking = (bookingId, updates) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, ...updates }
        : booking
    ))
    
    // Update localStorage
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, ...updates }
        : booking
    )
    localStorage.setItem('exhibitionBookings', JSON.stringify(updatedBookings))
  }

  // Function to delete booking
  const handleDeleteBooking = (bookingId) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId))
    
    // Update localStorage
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId)
    localStorage.setItem('exhibitionBookings', JSON.stringify(updatedBookings))
  }

  const handleNewBooking = () => {
    setCurrentBooking(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!currentBooking ? (
        <div className="w-[95%] h-[95vh] mx-auto">
          {/* Main Background Card */}
          <div className="main-background-card w-full h-full flex flex-col">
            {/* Header */}
            <header className="glass-effect sticky top-0 z-40 border-b border-white/30 mb-2 sm:mb-3 md:mb-4 flex-shrink-0">
              <div className="px-2 py-2 sm:px-3 md:px-6 lg:px-8 md:py-4">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="icon-container">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Exhibition Booking System</h1>
                      <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium">Professional Booth Management</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                    className="btn-secondary flex items-center space-x-2 text-xs sm:text-sm md:text-base px-3 py-2 sm:px-4 sm:py-3"
                  >
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4" />
                    <span>Admin Panel</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="px-2 py-2 sm:px-3 md:px-6 lg:px-8 md:py-4 lg:py-6 flex-1 overflow-y-auto">
              <main className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
                {/* Hero Section Card */}
                <div className="floating-card">
                  <div className="px-2 py-3 sm:px-3 md:px-6 lg:px-8 md:py-4 lg:py-6 w-[95%] h-[95%] mx-auto">
                    <div className="text-center h-full flex flex-col justify-center">
                      <div className="relative mb-2 sm:mb-3 md:mb-4">
                        <div className="flex justify-center mb-2 sm:mb-3">
                          <div className="icon-container p-2 sm:p-3 md:p-4 lg:p-5">
                            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white" />
                          </div>
                        </div>
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 md:-top-3 md:-right-3">
                          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-yellow-500 animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3 md:space-y-4">
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                          Book Your Exhibition Booth
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed font-medium max-w-4xl mx-auto px-2">
                          Secure your premium space at our upcoming exhibition. Choose from our exclusive booth options 
                          and get the perfect location for your business to shine.
                        </p>
                        <div className="flex justify-center mt-2 sm:mt-3">
                          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-2 sm:px-4 sm:py-3 rounded-full border border-indigo-200 text-xs sm:text-sm md:text-base">
                            <Award className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 text-indigo-600" />
                            <span className="font-semibold text-indigo-700">Professional Exhibition Management</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exhibition Statistics Card */}
                <div className="floating-card">
                  <div className="px-2 py-3 sm:px-3 md:px-6 lg:px-8 md:py-4 lg:py-6 w-[95%] h-[95%] mx-auto">
                    <div className="mb-2 sm:mb-3 md:mb-4">
                      <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 mr-2 sm:mr-3 text-indigo-600" />
                        Exhibition Statistics
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed text-center">Current booking overview and system performance</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 h-[85%]">
                      <div className="stats-card">
                        <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                          <div className="icon-container p-1 sm:p-2 md:p-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{bookings.length}</div>
                          <div className="text-xs sm:text-sm md:text-base font-semibold text-gray-600">Total Bookings</div>
                        </div>
                      </div>
                      
                      <div className="stats-card">
                        <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                          <div className="icon-container p-1 sm:p-2 md:p-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                            {bookings.filter(b => b.status === 'confirmed').length}
                          </div>
                          <div className="text-xs sm:text-sm md:text-base font-semibold text-gray-600">Confirmed</div>
                        </div>
                      </div>
                      
                      <div className="stats-card">
                        <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                          <div className="icon-container p-1 sm:p-2 md:p-2">
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                            {bookings.reduce((sum, booking) => sum + booking.numberOfBooths, 0)}
                          </div>
                          <div className="text-xs sm:text-sm md:text-base font-semibold text-gray-600">Total Booths</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exhibition Booth Booking Card */}
                <div className="floating-card">
                  <div className="px-2 py-3 sm:px-3 md:px-6 lg:px-8 md:py-4 lg:py-6 w-[95%] h-[95%] mx-auto">
                    <div className="mb-2 sm:mb-3 md:mb-4">
                      <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center justify-center">
                        <Building2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 mr-2 sm:mr-3 text-indigo-600" />
                        Exhibition Booth Booking
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed text-center">Complete your booth reservation with our comprehensive booking form</p>
                    </div>
                    <div className="h-[85%] overflow-y-auto">
                      <BookingForm onSubmit={handleBookingSubmit} />
                    </div>
                  </div>
                </div>

                {/* Footer Card */}
                <div className="floating-card">
                  <div className="px-2 py-3 sm:px-3 md:px-6 lg:px-8 md:py-4 lg:py-6 w-[95%] h-[95%] mx-auto">
                    <div className="text-center h-full flex flex-col justify-center">
                      <div className="mb-2 sm:mb-3 md:mb-4">
                        <div className="flex justify-center mb-2 sm:mb-3">
                          <div className="icon-container p-2 sm:p-3 md:p-4 lg:p-5">
                            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3 md:space-y-4">
                        <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                          Ready to Showcase Your Business?
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed font-medium max-w-3xl mx-auto px-2">
                          Join us at the most prestigious exhibition of the year. Secure your booth today and connect with industry leaders, 
                          potential clients, and business partners in a professional environment designed for success.
                        </p>
                        <div className="flex justify-center mt-2 sm:mt-3">
                          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-2 sm:px-4 sm:py-3 rounded-full border border-green-200 text-xs sm:text-sm md:text-base">
                            <Award className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 text-green-600" />
                            <span className="font-semibold text-green-700">Professional Exhibition Experience</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      ) : (
        <BookingSummary 
          booking={currentBooking} 
          onNewBooking={handleNewBooking}
        />
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel 
          bookings={bookings} 
          onClose={() => setShowAdminPanel(false)}
          onUpdateBooking={handleUpdateBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      )}
    </div>
  )
}

export default App

