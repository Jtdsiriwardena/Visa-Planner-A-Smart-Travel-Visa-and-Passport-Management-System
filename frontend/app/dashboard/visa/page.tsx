'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import countries from '../../data/countries.json'
import { 
  Search, 
  Globe, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Plane,
  Clock,
  Info,
  X,
  MapPin
} from 'lucide-react'

interface VisaCheck {
  id: string
  country_code: string
  visa_status: string
  visa_duration: string | null
  mandatory_reg: boolean
}

interface UserPassport {
  id: string
  country_code: string
  expiry_date: string
}

export default function VisaPage() {
  const [passports, setPassports] = useState<UserPassport[]>([])
  const [selectedPassport, setSelectedPassport] = useState('')
  const [destination, setDestination] = useState('')
  const [suggestions, setSuggestions] = useState<typeof countries>([])
  const [visaChecks, setVisaChecks] = useState<VisaCheck[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Fetch user passports
  useEffect(() => {
    if (!token) return

    const fetchPassports = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/passport`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setPassports(res.data)
      } catch (err) {
        console.error('Error fetching passports:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPassports()
  }, [token])

  // Filter country suggestions as user types
  const handleDestinationChange = (value: string) => {
    setDestination(value)
    if (!value) {
      setSuggestions([])
      return
    }
    const filtered = countries.filter(
      c =>
        c.code.toLowerCase().includes(value.toLowerCase()) ||
        c.name.toLowerCase().includes(value.toLowerCase())
    )
    setSuggestions(filtered.slice(0, 8)) // Limit to 8 suggestions
  }

  const handleSelectSuggestion = (code: string, name: string) => {
    setDestination(name)
    setSuggestions([])
  }

  // Check visa without trip
  const handleCheckVisa = async () => {
    if (!selectedPassport || !destination) {
      setError('Please select a passport and enter a destination')
      return
    }

    // Find country code from name or use as-is if it's already a code
    const selectedCountry = countries.find(
      c => c.name.toLowerCase() === destination.toLowerCase() || c.code.toLowerCase() === destination.toLowerCase()
    )

    if (!selectedCountry) {
      setError('Please select a valid country from the suggestions')
      return
    }

    setError('')
    setIsChecking(true)

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/visa/check`,
        {
          passport_id: selectedPassport,
          country_code: selectedCountry.code.toUpperCase(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setVisaChecks(prev => [res.data, ...prev])
      setDestination('')
    } catch (err: any) {
      console.error('Error checking visa:', err)
      setError(err.response?.data?.message || 'Failed to check visa')
    } finally {
      setIsChecking(false)
    }
  }

  const handleRemoveCheck = (id: string) => {
    setVisaChecks(prev => prev.filter(v => v.id !== id))
  }

  const getCountryName = (code: string) => {
    return countries.find(c => c.code === code)?.name || code
  }

  const getVisaStatusBadge = (status: string | null) => {
    if (!status) return null
    
    const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
      'visa_required': { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Visa Required' },
      'visa_free': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Visa Free' },
      'visa_on_arrival': { bg: 'bg-blue-100', text: 'text-blue-700', icon: Plane, label: 'Visa on Arrival' },
      'e_visa': { bg: 'bg-purple-100', text: 'text-purple-700', icon: Globe, label: 'eVisa Available' },
      'domestic': { bg: 'bg-gray-100', text: 'text-gray-700', icon: MapPin, label: 'Domestic Travel' },
    }

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertCircle, label: status }
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4 mr-1.5" />
        {config.label}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Visa Requirements</h1>
        <p className="text-gray-600 mt-1">Check visa requirements for your destinations</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={() => setError('')}
              className="text-sm text-red-600 hover:text-red-800 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Check Visa Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Search className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Check Visa Requirements</h2>
        </div>

        {passports.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">No passports found</p>
              <p className="mt-1">Please add a passport before checking visa requirements.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Passport Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Passport
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    value={selectedPassport}
                    onChange={e => setSelectedPassport(e.target.value)}
                  >
                    <option value="">Choose a passport</option>
                    {passports.map(passport => (
                      <option key={passport.id} value={passport.id}>
                        {passport.country_code} — Expires {formatDate(passport.expiry_date)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Country
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., France, Germany, Japan"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={destination}
                    onChange={e => handleDestinationChange(e.target.value)}
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {suggestions.map(s => (
                        <div
                          key={s.code}
                          className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors flex items-center space-x-3"
                          onClick={() => handleSelectSuggestion(s.code, s.name)}
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{s.name}</p>
                            <p className="text-xs text-gray-500">{s.code}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckVisa}
              disabled={!selectedPassport || !destination || isChecking}
              className="w-full md:w-auto bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
            >
              {isChecking ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Check Visa Requirements
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Visa Checks Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Checks ({visaChecks.length})
          </h2>
          {visaChecks.length > 0 && (
            <button
              onClick={() => setVisaChecks([])}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          )}
        </div>

        {visaChecks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No visa checks yet</h3>
            <p className="text-gray-600">Start by checking visa requirements for your destination!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {visaChecks.map(check => (
              <div
                key={check.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Country Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getCountryName(check.country_code)}
                        </h3>
                        <p className="text-sm text-gray-500">{check.country_code}</p>
                      </div>
                    </div>

                    {/* Visa Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Visa Status */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Visa Status</p>
                        {getVisaStatusBadge(check.visa_status)}
                      </div>

                      {/* Duration */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Duration</p>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {check.visa_duration || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Registration */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Registration</p>
                        {check.mandatory_reg ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                            Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Not Required
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Additional Info */}
                    {(check.visa_status === 'visa_required' || check.mandatory_reg) && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-900">
                            {check.visa_status === 'visa_required' 
                              ? 'You need to obtain a visa before traveling to this country.'
                              : 'Mandatory registration is required upon arrival.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveCheck(check.id)}
                    className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-2">Important Information</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Visa requirements can change without notice. Always verify with official sources.</li>
              <li>• Some countries require your passport to be valid for at least 6 months.</li>
              <li>• Processing times vary by country and visa type.</li>
              <li>• Additional documents may be required for visa applications.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}