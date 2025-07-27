import { CheckCircle, Download, Mail, ArrowLeft, Building2, User, Phone, MapPin, Package, Hash, Calendar, Sparkles, Star, FileText, CreditCard, Plus, AlertCircle } from 'lucide-react'
import { useState } from 'react'

// Booth types configuration (same as BookingForm)
const boothTypes = [
  {
    value: 'standard',
    label: 'Standard Booth',
    price: '$2,500',
    description: 'Perfect for small to medium businesses looking for a professional presence.',
    features: ['10x10 ft space', 'Basic electrical setup', 'Company signage', 'Standard lighting']
  },
  {
    value: 'premium',
    label: 'Premium Booth',
    price: '$4,500',
    description: 'Enhanced booth with premium features for businesses seeking maximum visibility.',
    features: ['15x15 ft space', 'Premium electrical setup', 'Custom signage', 'Enhanced lighting', 'Furniture included']
  },
  {
    value: 'custom',
    label: 'Custom Booth',
    price: 'Contact for pricing',
    description: 'Fully customizable booth space for large corporations with specific requirements.',
    features: ['Custom size available', 'Full electrical setup', 'Custom branding', 'Premium amenities', 'Dedicated support']
  }
]

const locations = {
  'main-hall': 'Main Hall - Center',
  'main-hall-north': 'Main Hall - North', 
  'main-hall-south': 'Main Hall - South',
  'side-hall': 'Side Hall',
  'outdoor': 'Outdoor Area'
}

function BookingSummary({ booking, onNewBooking }) {
  const [isDownloading, setIsDownloading] = useState(false)
  
  try {
    // Add error handling for missing booking data
    if (!booking) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Error</h2>
            <p className="text-gray-600 mb-6">No booking data was found. Please try submitting your booking again.</p>
            <button
              onClick={onNewBooking}
              className="btn-primary px-6 py-3"
            >
              Start New Booking
            </button>
          </div>
        </div>
      )
    }

    // Validate required booking properties
    const requiredProps = ['id', 'companyName', 'contactPersonName', 'email', 'phoneNumber', 'boothType', 'numberOfBooths', 'preferredLocation']
    const missingProps = requiredProps.filter(prop => !booking[prop])
    
    if (missingProps.length > 0) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Booking Data</h2>
            <p className="text-gray-600 mb-6">The booking data is incomplete. Missing: {missingProps.join(', ')}</p>
            <button
              onClick={onNewBooking}
              className="btn-primary px-6 py-3"
            >
              Start New Booking
            </button>
          </div>
        </div>
      )
    }

    // Safely access booking properties with fallbacks
    const safeBooking = {
      id: booking.id || 'N/A',
      companyName: booking.companyName || 'N/A',
      contactPersonName: booking.contactPersonName || 'N/A',
      email: booking.email || 'N/A',
      phoneNumber: booking.phoneNumber || 'N/A',
      boothType: booking.boothType || 'N/A',
      numberOfBooths: booking.numberOfBooths || 0,
      preferredLocation: booking.preferredLocation || 'N/A',
      createdAt: booking.createdAt || new Date().toISOString(),
      status: booking.status || 'confirmed'
    }

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true)
      
      // Dynamic import for jsPDF
      const { jsPDF } = await import('jspdf')
      
      const doc = new jsPDF()
      
      // Add header
      doc.setFontSize(24)
      doc.setTextColor(99, 102, 241) // Indigo color
      doc.text('Exhibition Booking Confirmation', 20, 30)
      
      // Add line
      doc.setDrawColor(99, 102, 241)
      doc.line(20, 35, 190, 35)
      
      // Add booking details
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      
      let yPosition = 50
      
      // Booking ID
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Booking ID:', 20, yPosition)
      doc.setFont(undefined, 'normal')
      doc.text(safeBooking.id, 60, yPosition)
      yPosition += 15
      
      // Date
      doc.setFont(undefined, 'bold')
      doc.text('Date:', 20, yPosition)
      doc.setFont(undefined, 'normal')
      doc.text(new Date(safeBooking.createdAt).toLocaleDateString(), 60, yPosition)
      yPosition += 20
      
      // Company Information
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(99, 102, 241)
      doc.text('Company Information', 20, yPosition)
      yPosition += 10
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      
      doc.text(`Company: ${safeBooking.companyName}`, 20, yPosition)
      yPosition += 8
      doc.text(`Contact: ${safeBooking.contactPersonName}`, 20, yPosition)
      yPosition += 8
      doc.text(`Email: ${safeBooking.email}`, 20, yPosition)
      yPosition += 8
      doc.text(`Phone: ${safeBooking.phoneNumber}`, 20, yPosition)
      yPosition += 20
      
      // Booth Details
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(99, 102, 241)
      doc.text('Booth Details', 20, yPosition)
      yPosition += 10
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      
      doc.text(`Type: ${safeBooking.boothType}`, 20, yPosition)
      yPosition += 8
      doc.text(`Quantity: ${safeBooking.numberOfBooths}`, 20, yPosition)
      yPosition += 8
      doc.text(`Location: ${locations[safeBooking.preferredLocation] || safeBooking.preferredLocation}`, 20, yPosition)
      yPosition += 8
      doc.text(`Status: ${safeBooking.status}`, 20, yPosition)
      yPosition += 20
      
      // Cost Summary
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(99, 102, 241)
      doc.text('Cost Summary', 20, yPosition)
      yPosition += 10
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      
      const cost = safeBooking.boothType === 'custom' 
        ? 'Contact for pricing'
        : (() => {
            const boothType = boothTypes.find(t => t.value === safeBooking.boothType);
            if (boothType) {
              const price = parseInt(boothType.price.replace(/[$,]/g, ''));
              const total = price * safeBooking.numberOfBooths;
              return `$${total.toLocaleString()}`;
            }
            return 'Contact for pricing';
          })()
      
      doc.text(`Total Cost: ${cost}`, 20, yPosition)
      yPosition += 30
      
      // Footer
      doc.setFontSize(10)
      doc.setTextColor(128, 128, 128)
      doc.text('Thank you for your booking!', 20, yPosition)
      doc.text('Exhibition Booking System', 20, yPosition + 8)
      
      // Save the PDF
      doc.save(`booking-${safeBooking.id}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleEmailConfirmation = async () => {
    try {
      
      // Dynamic import for jsPDF
      const { jsPDF } = await import('jspdf')
      
      const doc = new jsPDF()
      
      // Add header
      doc.setFontSize(24)
      doc.setTextColor(99, 102, 241) // Indigo color
      doc.text('Exhibition Booking Confirmation', 20, 30)
      
      // Add line
      doc.setDrawColor(99, 102, 241)
      doc.line(20, 35, 190, 35)
      
      // Add booking details
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      
      let yPosition = 50
      
      // Booking ID
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Booking ID:', 20, yPosition)
      doc.setFont(undefined, 'normal')
      doc.text(safeBooking.id, 60, yPosition)
      yPosition += 15
      
      // Date
      doc.setFont(undefined, 'bold')
      doc.text('Date:', 20, yPosition)
      doc.setFont(undefined, 'normal')
      doc.text(new Date(safeBooking.createdAt).toLocaleDateString(), 60, yPosition)
      yPosition += 20
      
      // Company Information
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(99, 102, 241)
      doc.text('Company Information', 20, yPosition)
      yPosition += 10
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      
      doc.text(`Company: ${safeBooking.companyName}`, 20, yPosition)
      yPosition += 8
      doc.text(`Contact: ${safeBooking.contactPersonName}`, 20, yPosition)
      yPosition += 8
      doc.text(`Email: ${safeBooking.email}`, 20, yPosition)
      yPosition += 8
      doc.text(`Phone: ${safeBooking.phoneNumber}`, 20, yPosition)
      yPosition += 20
      
      // Booth Details
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(99, 102, 241)
      doc.text('Booth Details', 20, yPosition)
      yPosition += 10
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      
      doc.text(`Type: ${safeBooking.boothType}`, 20, yPosition)
      yPosition += 8
      doc.text(`Quantity: ${safeBooking.numberOfBooths}`, 20, yPosition)
      yPosition += 8
      doc.text(`Location: ${locations[safeBooking.preferredLocation] || safeBooking.preferredLocation}`, 20, yPosition)
      yPosition += 8
      doc.text(`Status: ${safeBooking.status}`, 20, yPosition)
      yPosition += 20
      
      // Cost Summary
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(99, 102, 241)
      doc.text('Cost Summary', 20, yPosition)
      yPosition += 10
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      
      const cost = safeBooking.boothType === 'custom' 
        ? 'Contact for pricing'
        : (() => {
            const boothType = boothTypes.find(t => t.value === safeBooking.boothType);
            if (boothType) {
              const price = parseInt(boothType.price.replace(/[$,]/g, ''));
              const total = price * safeBooking.numberOfBooths;
              return `$${total.toLocaleString()}`;
            }
            return 'Contact for pricing';
          })()
      
      doc.text(`Total Cost: ${cost}`, 20, yPosition)
      yPosition += 30
      
      // Footer
      doc.setFontSize(10)
      doc.setTextColor(128, 128, 128)
      doc.text('Thank you for your booking!', 20, yPosition)
      doc.text('Exhibition Booking System', 20, yPosition + 8)
      
      // Generate PDF as base64 for email attachment
      const pdfBase64 = doc.output('datauristring')
      
      // Create email content
      const subject = encodeURIComponent('Exhibition Booking Confirmation - PDF Attached')
      const body = encodeURIComponent(`
Dear ${safeBooking.contactPersonName},

Thank you for your exhibition booth booking!

Please find attached your booking confirmation PDF with all the details.

Booking Summary:
- Booking ID: ${safeBooking.id}
- Company: ${safeBooking.companyName}
- Booth Type: ${safeBooking.boothType}
- Number of Booths: ${safeBooking.numberOfBooths}
- Location: ${locations[safeBooking.preferredLocation] || safeBooking.preferredLocation}

We will contact you shortly with further details.

Best regards,
Exhibition Team
      `.trim())

      // Create mailto link with PDF attachment
      // Note: Most email clients don't support attachments via mailto, so we'll provide instructions
      const mailtoLink = `mailto:${safeBooking.email}?subject=${subject}&body=${body}`
      
      // Open email client
      window.open(mailtoLink)
      
      // Show success message
      alert('Email client opened! Please manually attach the PDF from your downloads folder.')
      
    } catch (error) {
      console.error('Error generating PDF for email:', error)
      alert('Error generating PDF for email. Please try downloading the PDF first, then send the email manually.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[95%] h-[95vh] mx-auto">
        <div className="floating-card w-full h-full flex flex-col">
          <div className="inner-content w-full h-full flex flex-col p-4 sm:p-6 lg:p-8">
            
            {/* Header */}
            <div className="flex-shrink-0 mb-6 sm:mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-green-500 mr-3" />
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Booking Confirmed!
                  </h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                  Your exhibition booth booking has been successfully submitted
                </p>
              </div>
            </div>

            {/* Booking Details - Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
              
              {/* Company Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 text-blue-600" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Company Name</p>
                    <p className="text-sm sm:text-base text-gray-900">{safeBooking.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Contact Person</p>
                    <p className="text-sm sm:text-base text-gray-900">{safeBooking.contactPersonName}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 text-green-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Email Address</p>
                    <p className="text-sm sm:text-base text-gray-900">{safeBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Phone Number</p>
                    <p className="text-sm sm:text-base text-gray-900">{safeBooking.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Booth Details */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 text-purple-600" />
                  Booth Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Booth Type</p>
                    <p className="text-sm sm:text-base text-gray-900">{safeBooking.boothType}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Number of Booths</p>
                    <p className="text-sm sm:text-base text-gray-900">{safeBooking.numberOfBooths}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Preferred Location</p>
                    <p className="text-sm sm:text-base text-gray-900">{locations[safeBooking.preferredLocation] || safeBooking.preferredLocation}</p>
                  </div>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-yellow-200">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 text-yellow-600" />
                  Cost Summary
                </h3>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <div>
                      <span className="text-gray-700 text-sm sm:text-base font-semibold">
                        {safeBooking.boothType} × {safeBooking.numberOfBooths} booth(s)
                      </span>
                      <p className="text-gray-500 mt-1 text-xs sm:text-sm">Includes all standard amenities</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">
                        {safeBooking.boothType === 'custom' 
                          ? 'Contact for pricing'
                          : (() => {
                              const boothType = boothTypes.find(t => t.value === safeBooking.boothType);
                              if (boothType) {
                                const price = parseInt(boothType.price.replace(/[$,]/g, ''));
                                const total = price * safeBooking.numberOfBooths;
                                return `$${total.toLocaleString()}`;
                              }
                              return 'Contact for pricing';
                            })()}
                      </span>
                      {safeBooking.boothType !== 'custom' && (
                        <p className="text-gray-500 mt-1 text-xs sm:text-sm">Total amount</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at Bottom */}
            <div className="flex-shrink-0 mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="btn-primary flex items-center space-x-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto justify-center"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleEmailConfirmation}
                  className="btn-secondary flex items-center space-x-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto justify-center"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email with PDF</span>
                </button>
                
                <button
                  onClick={onNewBooking}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('Error rendering BookingSummary:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Rendering Error</h2>
          <p className="text-gray-600 mb-6">There was an error displaying your booking. Please try again.</p>
          <button
            onClick={onNewBooking}
            className="btn-primary px-6 py-3"
          >
            Start New Booking
          </button>
        </div>
      </div>
    )
  }
}

export default BookingSummary 