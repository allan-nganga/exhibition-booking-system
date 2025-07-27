import { useState } from 'react'
import { X, Search, Filter, Download, Eye, Building2, Calendar, Users, TrendingUp, DollarSign, BarChart3, CheckCircle, Clock, Phone, Mail, MapPin, Package, Hash, AlertCircle, Edit, Trash2 } from 'lucide-react'

const boothTypes = [
  { value: 'standard', label: 'Standard Booth', price: '$2,500' },
  { value: 'premium', label: 'Premium Booth', price: '$4,500' },
  { value: 'custom', label: 'Custom Booth', price: 'Custom' }
]

const locations = {
  'main-hall': 'Main Hall - Center',
  'main-hall-north': 'Main Hall - North',
  'main-hall-south': 'Main Hall - South',
  'side-hall': 'Side Hall',
  'outdoor': 'Outdoor Area'
}

function AdminPanel({ bookings, onClose, onUpdateBooking, onDeleteBooking }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [boothTypeFilter, setBoothTypeFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contactPersonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id?.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesBoothType = boothTypeFilter === 'all' || booking.boothType === boothTypeFilter
    const matchesLocation = locationFilter === 'all' || booking.preferredLocation === locationFilter

    return matchesSearch && matchesStatus && matchesBoothType && matchesLocation
  })

  const handleExportData = () => {
    const csvContent = [
      ['Booking ID', 'Company', 'Contact', 'Email', 'Phone', 'Booth Type', 'Quantity', 'Location', 'Status', 'Date', 'Amount'],
      ...filteredBookings.map(booking => [
        booking.id,
        booking.companyName,
        booking.contactPersonName,
        booking.email,
        booking.phoneNumber,
        boothTypes.find(t => t.value === booking.boothType)?.label || booking.boothType,
        booking.numberOfBooths,
        locations[booking.preferredLocation] || booking.preferredLocation,
        booking.status,
        new Date(booking.createdAt).toLocaleDateString(),
        booking.boothType === 'custom' 
          ? 'Contact for pricing'
          : `$${(boothTypes.find(t => t.value === booking.boothType)?.price.replace(/[$,]/g, '') * booking.numberOfBooths).toLocaleString()}`
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'exhibition-bookings.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowBookingDetails(true)
  }

  const handleStatusChange = (bookingId, newStatus) => {
    if (onUpdateBooking) {
      onUpdateBooking(bookingId, { status: newStatus })
    }
  }

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      if (onDeleteBooking) {
        onDeleteBooking(bookingId)
      }
    }
  }

  const totalBooths = bookings.reduce((sum, booking) => sum + (booking.numberOfBooths || 0), 0)
  const totalRevenue = bookings.reduce((sum, booking) => {
    if (booking.boothType === 'custom') return sum
    const boothType = boothTypes.find(t => t.value === booking.boothType)
    if (boothType) {
      const price = parseInt(boothType.price.replace(/[$,]/g, ''))
      return sum + (price * (booking.numberOfBooths || 0))
    }
    return sum
  }, 0)

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'cancelled':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 sm:p-3 md:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 bg-white/20 rounded-xl">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Admin Panel</h2>
                <p className="text-indigo-100 text-xs sm:text-sm">Manage all exhibition bookings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3 md:p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-2 sm:p-3 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600">Total Bookings</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{bookings.length}</p>
                </div>
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-2 sm:p-3 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600">Confirmed</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
                <div className="p-2 bg-green-500 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-2 sm:p-3 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600">Total Booths</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{totalBooths}</p>
                </div>
                <div className="p-2 bg-yellow-500 rounded-xl">
                  <Package className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-2 sm:p-3 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600">Total Revenue</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-purple-500 rounded-xl">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={boothTypeFilter}
                onChange={(e) => setBoothTypeFilter(e.target.value)}
                className="px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Booth Types</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="custom">Custom</option>
              </select>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Locations</option>
                <option value="main-hall">Main Hall - Center</option>
                <option value="main-hall-north">Main Hall - North</option>
                <option value="main-hall-south">Main Hall - South</option>
                <option value="side-hall">Side Hall</option>
                <option value="outdoor">Outdoor Area</option>
              </select>
              <button
                onClick={handleExportData}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Booth Details
                    </th>
                    <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div className="text-xs sm:text-sm font-mono text-gray-600">
                          #{booking.id}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-gray-900">{booking.companyName}</div>
                          <div className="text-xs sm:text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {booking.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div>
                          <div className="text-sm sm:text-base text-gray-900">{booking.contactPersonName}</div>
                          <div className="text-xs sm:text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {booking.phoneNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div>
                          <div className="text-sm sm:text-base text-gray-900 flex items-center">
                            <Package className="h-4 w-4 mr-2" />
                            {boothTypes.find(t => t.value === booking.boothType)?.label || booking.boothType}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {booking.numberOfBooths} booth(s)
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div className="text-sm sm:text-base text-gray-900 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {locations[booking.preferredLocation] || booking.preferredLocation}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div className="text-sm sm:text-base font-semibold text-gray-900">
                          {booking.boothType === 'custom' 
                            ? 'Contact for pricing'
                            : `$${(boothTypes.find(t => t.value === booking.boothType)?.price.replace(/[$,]/g, '') * booking.numberOfBooths).toLocaleString()}`}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div className="text-xs sm:text-sm text-gray-600">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="p-2 text-indigo-600 hover:text-indigo-900 rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="p-2 text-green-600 hover:text-green-900 rounded-lg transition-colors duration-200"
                            title="Confirm Booking"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="p-2 text-red-600 hover:text-red-900 rounded-lg transition-colors duration-200"
                            title="Cancel Booking"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="p-2 text-red-600 hover:text-red-900 rounded-lg transition-colors duration-200"
                            title="Delete Booking"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* No Results */}
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Booking Details</h3>
                <button
                  onClick={() => setShowBookingDetails(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Booking ID and Status */}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Booking #{selectedBooking.id}</h4>
                    <p className="text-sm text-gray-600">Created on {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(selectedBooking.status)}`}>
                    {getStatusIcon(selectedBooking.status)}
                    <span className="ml-1 capitalize">{selectedBooking.status}</span>
                  </span>
                </div>

                {/* Company Information */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                    Company Information
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Company Name</p>
                      <p className="text-gray-900">{selectedBooking.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Contact Person</p>
                      <p className="text-gray-900">{selectedBooking.contactPersonName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Email</p>
                      <p className="text-gray-900">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Phone</p>
                      <p className="text-gray-900">{selectedBooking.phoneNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Booth Details */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-purple-600" />
                    Booth Details
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Booth Type</p>
                      <p className="text-gray-900">{boothTypes.find(t => t.value === selectedBooking.boothType)?.label || selectedBooking.boothType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Number of Booths</p>
                      <p className="text-gray-900">{selectedBooking.numberOfBooths}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-semibold text-gray-700">Preferred Location</p>
                      <p className="text-gray-900">{locations[selectedBooking.preferredLocation] || selectedBooking.preferredLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                  <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-yellow-600" />
                    Cost Summary
                  </h5>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedBooking.boothType === 'custom' 
                        ? 'Contact for pricing'
                        : `$${(boothTypes.find(t => t.value === selectedBooking.boothType)?.price.replace(/[$,]/g, '') * selectedBooking.numberOfBooths).toLocaleString()}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedBooking.boothType} × {selectedBooking.numberOfBooths} booth(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel 