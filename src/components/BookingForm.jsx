import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Building2, User, Mail, Phone, MapPin, Package, Hash, Star, CheckCircle, FileText, CreditCard, AlertCircle } from 'lucide-react'
import { useState } from 'react'

// Validation schema with enhanced rules
const schema = yup.object({
  companyName: yup
    .string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters long')
    .max(100, 'Company name must be less than 100 characters')
    .test('no-only-spaces', 'Company name cannot contain only spaces', value => 
      value && value.trim().length > 0
    )
    .test('not-empty', 'Company name cannot be empty', value => 
      value && value.trim() !== ''
    ),
  contactPersonName: yup
    .string()
    .required('Contact person name is required')
    .min(2, 'Contact person name must be at least 2 characters long')
    .max(50, 'Contact person name must be less than 50 characters')
    .test('no-only-spaces', 'Contact person name cannot contain only spaces', value => 
      value && value.trim().length > 0
    )
    .test('not-empty', 'Contact person name cannot be empty', value => 
      value && value.trim() !== ''
    ),
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address')
    .test('no-only-spaces', 'Email address cannot contain only spaces', value => 
      value && value.trim().length > 0
    )
    .test('not-empty', 'Email address cannot be empty', value => 
      value && value.trim() !== ''
    ),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .test('valid-phone', 'Please enter a valid phone number (numbers only, 7-15 digits)', value => {
      if (!value || !value.trim()) {
        return false
      }
      // Only allow digits, no spaces, dashes, or other characters
      const cleanPhone = value.replace(/\D/g, '')
      // Must be 7-15 digits, no country code
      const isValid = /^[0-9]{7,15}$/.test(cleanPhone)
      return isValid
    }),
  boothType: yup
    .string()
    .required('Please select a booth type')
    .oneOf(['standard', 'premium', 'custom'], 'Please select a valid booth type')
    .test('not-empty', 'Please select a booth type', value => 
      value && value.trim() !== ''
    ),
  numberOfBooths: yup
    .number()
    .required('Number of booths is required')
    .min(1, 'Number of booths must be at least 1')
    .max(10, 'Number of booths cannot exceed 10')
    .integer('Number of booths must be a whole number')
    .typeError('Number of booths must be a number'),
  preferredLocation: yup
    .string()
    .required('Please select a preferred location')
    .oneOf(['main-hall', 'main-hall-north', 'main-hall-south', 'side-hall', 'outdoor'], 'Please select a valid location')
    .test('not-empty', 'Please select a preferred location', value => 
      value && value.trim() !== ''
    )
})

// Booth types configuration
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

function BookingForm({ onSubmit }) {
  const [submissionError, setSubmissionError] = useState(null)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
    setValue,
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      boothType: '',
      numberOfBooths: 1,
      preferredLocation: ''
    },
    mode: 'onChange' // Enable real-time validation
  })

  const selectedBoothType = watch('boothType')
  const numberOfBooths = watch('numberOfBooths')
  const phoneNumber = watch('phoneNumber')

  const handleFormSubmit = async (data) => {
    try {
      setSubmissionError(null)
      setIsSubmitting(true)
      
      // Comprehensive field validation with specific error messages
      const validationErrors = []
      
      // Company Name Validation
      if (!data.companyName) {
        validationErrors.push('Company name is required')
      } else if (!data.companyName.trim()) {
        validationErrors.push('Company name cannot be empty or contain only spaces')
      } else if (data.companyName.trim().length < 2) {
        validationErrors.push('Company name must be at least 2 characters long')
      } else if (data.companyName.trim().length > 100) {
        validationErrors.push('Company name must be less than 100 characters')
      } else if (/^\s*$/.test(data.companyName)) {
        validationErrors.push('Company name cannot contain only spaces')
      }
      
      // Contact Person Name Validation
      if (!data.contactPersonName) {
        validationErrors.push('Contact person name is required')
      } else if (!data.contactPersonName.trim()) {
        validationErrors.push('Contact person name cannot be empty or contain only spaces')
      } else if (data.contactPersonName.trim().length < 2) {
        validationErrors.push('Contact person name must be at least 2 characters long')
      } else if (data.contactPersonName.trim().length > 50) {
        validationErrors.push('Contact person name must be less than 50 characters')
      } else if (/^\s*$/.test(data.contactPersonName)) {
        validationErrors.push('Contact person name cannot contain only spaces')
      }
      
      // Email Validation
      if (!data.email) {
        validationErrors.push('Email address is required')
      } else if (!data.email.trim()) {
        validationErrors.push('Email address cannot be empty or contain only spaces')
      } else if (/^\s*$/.test(data.email)) {
        validationErrors.push('Email address cannot contain only spaces')
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email.trim())) {
          validationErrors.push('Please enter a valid email address (e.g., user@example.com)')
        }
      }
      
      // Phone Number Validation
      if (!data.phoneNumber) {
        validationErrors.push('Phone number is required')
      } else if (!data.phoneNumber.trim()) {
        validationErrors.push('Phone number cannot be empty or contain only spaces')
      } else {
        // Only allow digits, no spaces, dashes, or other characters
        const cleanPhone = data.phoneNumber.replace(/\D/g, '')
        // Must be 7-15 digits, no country code
        if (!/^[0-9]{7,15}$/.test(cleanPhone)) {
          validationErrors.push('Please enter a valid phone number (numbers only, 7-15 digits, no country code)')
        }
      }
      
      // Booth Type Validation
      if (!data.boothType) {
        validationErrors.push('Please select a booth type')
      } else if (!['standard', 'premium', 'custom'].includes(data.boothType)) {
        validationErrors.push('Please select a valid booth type')
      }
      
      // Number of Booths Validation
      if (!data.numberOfBooths) {
        validationErrors.push('Number of booths is required')
      } else if (typeof data.numberOfBooths !== 'number') {
        validationErrors.push('Number of booths must be a number')
      } else if (data.numberOfBooths < 1) {
        validationErrors.push('Number of booths must be at least 1')
      } else if (data.numberOfBooths > 10) {
        validationErrors.push('Number of booths cannot exceed 10')
      } else if (!Number.isInteger(data.numberOfBooths)) {
        validationErrors.push('Number of booths must be a whole number')
      }
      
      // Preferred Location Validation
      if (!data.preferredLocation) {
        validationErrors.push('Please select a preferred location')
      } else if (!Object.keys(locations).includes(data.preferredLocation)) {
        validationErrors.push('Please select a valid location')
      }
      
      // Check for validation errors
      if (validationErrors.length > 0) {
        setSubmissionError(`Please fix the following errors:\n\n${validationErrors.map(error => `• ${error}`).join('\n')}`)
        return
      }
      
      // Call the onSubmit prop with the validated data
      await onSubmit(data)
      
      // Reset form after successful submission
      reset()
      setSubmissionError(null)
      setSubmissionSuccess(true)
      
    } catch (error) {
      setSubmissionError(error.message || 'There was an error submitting your booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBoothSelection = async (typeValue) => {
    try {
      await setValue('boothType', typeValue, { shouldValidate: true })
      await trigger('boothType')
    } catch (error) {
      setSubmissionError('Error selecting booth type. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-6 md:space-y-8 h-full flex flex-col">
      {/* Company Information Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-indigo-200 flex-shrink-0">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 mr-2 sm:mr-3 md:mr-4 text-indigo-600" />
            Company Information
          </h4>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">Provide your company details for the booking</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2 sm:mb-3 md:mb-4">
              <Star className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-red-500" />
              Company Name *
            </label>
            <input
              type="text"
              {...register('companyName')}
              className={`form-input ${errors.companyName ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Your Company Name"
              onKeyPress={(e) => {
                // Prevent multiple consecutive spaces
                if (e.key === ' ' && e.target.value.endsWith(' ')) {
                  e.preventDefault()
                }
              }}
            />
            {errors.companyName && (
              <p className="mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm text-red-600 flex items-center">
                <span className="mr-1 sm:mr-2">⚠</span>
                {errors.companyName.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Enter 2-100 characters (letters, numbers, spaces allowed)</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2 sm:mb-3 md:mb-4">
              <Star className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-red-500" />
              Contact Person Name *
            </label>
            <input
              type="text"
              {...register('contactPersonName')}
              className={`form-input ${errors.contactPersonName ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Full Name"
              onKeyPress={(e) => {
                // Prevent multiple consecutive spaces
                if (e.key === ' ' && e.target.value.endsWith(' ')) {
                  e.preventDefault()
                }
              }}
            />
            {errors.contactPersonName && (
              <p className="mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm text-red-600 flex items-center">
                <span className="mr-1 sm:mr-2">⚠</span>
                {errors.contactPersonName.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Enter 2-50 characters (letters, numbers, spaces allowed)</p>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-green-200 flex-shrink-0">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 mr-2 sm:mr-3 md:mr-4 text-green-600" />
            Contact Information
          </h4>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">How we can reach you for booking confirmation</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2 sm:mb-3 md:mb-4">
              <Star className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-red-500" />
              Email Address *
            </label>
            <input
              type="email"
              {...register('email')}
              className={`form-input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="your.email@example.com"
              onKeyPress={(e) => {
                // Prevent multiple consecutive spaces
                if (e.key === ' ' && e.target.value.endsWith(' ')) {
                  e.preventDefault()
                }
              }}
            />
            {errors.email && (
              <p className="mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm text-red-600 flex items-center">
                <span className="mr-1 sm:mr-2">⚠</span>
                {errors.email.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Enter a valid email address (e.g., user@example.com)</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2 sm:mb-3 md:mb-4">
              <Star className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-red-500" />
              Phone Number *
            </label>
            <input
              type="tel"
              {...register('phoneNumber')}
              className={`form-input ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="1234567890 (numbers only)"
              onKeyPress={(e) => {
                // Only allow digits
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault()
                }
              }}
              onChange={(e) => {
                // Remove any non-digit characters and update the form value
                const value = e.target.value.replace(/\D/g, '')
                setValue('phoneNumber', value, { shouldValidate: true })
              }}
            />
            {errors.phoneNumber && (
              <p className="mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm text-red-600 flex items-center">
                <span className="mr-1 sm:mr-2">⚠</span>
                {errors.phoneNumber.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Enter 7-15 digits only (no spaces, dashes, or country code)</p>
          </div>
        </div>
      </div>

      {/* Booth Selection Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-purple-200 flex-shrink-0">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 mr-2 sm:mr-3 md:mr-4 text-purple-600" />
            Booth Selection *
          </h4>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">Choose the perfect booth type for your exhibition needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {boothTypes.map((type) => (
            <div
              key={type.value}
              className={`booth-option ${selectedBoothType === type.value ? 'selected' : ''} ${errors.boothType && !selectedBoothType ? 'border-red-500' : ''}`}
              onClick={() => handleBoothSelection(type.value)}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4 md:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div className={`booth-checkbox ${selectedBoothType === type.value ? 'selected' : ''}`}>
                    {selectedBoothType === type.value && (
                      <div className="booth-checkbox-dot"></div>
                    )}
                  </div>
                  <h5 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl">{type.label}</h5>
                </div>
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-indigo-600">{type.price}</span>
              </div>
              <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base leading-relaxed">{type.description}</p>
              <div className="space-y-1 sm:space-y-2 md:space-y-3">
                {type.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-xs sm:text-sm md:text-base text-gray-700">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-500 mr-1 sm:mr-2 md:mr-3" />
                    {feature}
                  </div>
                ))}
              </div>
              <input type="radio" {...register('boothType')} value={type.value} className="sr-only" />
            </div>
          ))}
        </div>
        {errors.boothType && (
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-red-600 flex items-center">
            <span className="mr-1 sm:mr-2">⚠</span>
            {errors.boothType.message}
          </p>
        )}
      </div>

      {/* Booking Details Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-blue-200 flex-shrink-0">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 mr-2 sm:mr-3 md:mr-4 text-blue-600" />
            Booking Details
          </h4>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">Specify your booth requirements and preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2 sm:mb-3 md:mb-4">
              <Star className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-red-500" />
              <Hash className="inline h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 md:mr-3" />
              Number of Booths *
            </label>
            <input
              type="number"
              {...register('numberOfBooths')}
              className={`form-input ${errors.numberOfBooths ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="e.g., 1, 2, 3"
              min="1"
            />
            {errors.numberOfBooths && (
              <p className="mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm text-red-600 flex items-center">
                <span className="mr-1 sm:mr-2">⚠</span>
                {errors.numberOfBooths.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2 sm:mb-3 md:mb-4">
              <Star className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-red-500" />
              <MapPin className="inline h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 md:mr-3" />
              Preferred Booth Location *
            </label>
            <select 
              {...register('preferredLocation')} 
              className={`form-select ${errors.preferredLocation ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Select a location</option>
              {Object.entries(locations).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.preferredLocation && (
              <p className="mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm text-red-600 flex items-center">
                <span className="mr-1 sm:mr-2">⚠</span>
                {errors.preferredLocation.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cost Summary Section */}
      {selectedBoothType && numberOfBooths && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-yellow-200 flex-shrink-0">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 mr-2 sm:mr-3 md:mr-4 text-yellow-600" />
              Cost Summary
            </h4>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">Review your booking costs and details</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <div>
                <span className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
                  {boothTypes.find(t => t.value === selectedBoothType)?.label} × {numberOfBooths} booth(s)
                </span>
                <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Includes all standard amenities</p>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600">
                  {selectedBoothType === 'custom' 
                    ? 'Contact for pricing'
                    : (() => {
                        const boothType = boothTypes.find(t => t.value === selectedBoothType);
                        if (boothType) {
                          const price = parseInt(boothType.price.replace(/[$,]/g, ''));
                          const total = price * numberOfBooths;
                          return `$${total.toLocaleString()}`;
                        }
                        return 'Contact for pricing';
                      })()}
                </span>
                {selectedBoothType !== 'custom' && (
                  <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Total amount</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button Section */}
      <div className="flex justify-center pt-4 sm:pt-6 md:pt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 md:py-5 lg:py-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 sm:space-x-3 md:space-x-4"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              <span>Submit Booking</span>
            </>
          )}
        </button>
      </div>

      {/* Submission Error Display */}
      {submissionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-red-800 mb-2">Validation Errors</h4>
              <div className="text-xs sm:text-sm md:text-base text-red-700 leading-relaxed">
                {submissionError.includes('\n') ? (
                  <div className="space-y-1">
                    {submissionError.split('\n').map((line, index) => (
                      <div key={index} className={line.startsWith('•') ? 'ml-2' : ''}>
                        {line}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{submissionError}</p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setSubmissionError(null)}
              className="text-red-400 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Submission Success Display */}
      {submissionSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-green-800 mb-2">Booking Successful!</h4>
              <p className="text-xs sm:text-sm md:text-base text-green-700 leading-relaxed">Your booking has been submitted successfully. We will contact you shortly for confirmation.</p>
            </div>
            <button 
              onClick={() => setSubmissionSuccess(false)}
              className="text-green-400 hover:text-green-600 transition-colors duration-200 flex-shrink-0"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </form>
  )
}

export default BookingForm 