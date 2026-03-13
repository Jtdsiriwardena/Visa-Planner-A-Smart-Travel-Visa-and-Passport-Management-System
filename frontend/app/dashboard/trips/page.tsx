'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { apiClient } from '@/lib/api-client'
import countries from '../../data/countries.json'
import {
  Plus,
  Calendar,
  MapPin,
  Trash2,
  X,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  Plane
} from 'lucide-react'

// Trip destination interface
interface TripDestination {
  id: string
  country_code: string
  country_name?: string
  visa_status: string | null
  visa_duration: string | null
  mandatory_reg: boolean
  visa_category: string
  passport?: { id: string; country_code: string; expiry_date: string }
  created_at?: string
}

// Trip interface
interface Trip {
  id: string
  name: string
  start_date: string
  end_date: string
  destinations: TripDestination[]
}

// User passport interface
interface UserPassport {
  id: string
  country_code: string
  expiry_date: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)
  const [newTrip, setNewTrip] = useState({ name: '', start_date: '', end_date: '' })
  const [error, setError] = useState('')
  const [passports, setPassports] = useState<UserPassport[]>([])

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [selectedPassportId, setSelectedPassportId] = useState<string | null>(null)
  const [destinationCountry, setDestinationCountry] = useState('')

  useEffect(() => {
    fetchTrips()
    fetchPassports()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get('/trips')
      setTrips(data)
    } catch (err) {
      console.error('Error fetching trips:', err)
      setError('Failed to load trips. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchPassports = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/passport`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      setPassports(res.data)
    } catch (err) {
      console.error('Error fetching passports:', err)
    }
  }

  const handleCreateTrip = async () => {
    if (!newTrip.name || !newTrip.start_date || !newTrip.end_date) {
      setError('All fields are required')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/trips`,
        newTrip,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTrips(prev => [...prev, res.data])
      setNewTrip({ name: '', start_date: '', end_date: '' })
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create trip')
    }
  }

  const openAddDestinationModal = (tripId: string) => {
    setSelectedTripId(tripId)
    setDestinationCountry('')
    setSelectedPassportId(passports[0]?.id || null)
    setShowModal(true)
  }

  const handleAddDestination = async () => {
    if (!destinationCountry) {
      alert('Destination country is required')
      return
    }
    if (!selectedPassportId) {
      alert('No passport selected. Please create a passport first.')
      return
    }
    if (!selectedTripId) return

    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/trips/${selectedTripId}/destination`,
        { passport_id: selectedPassportId, country_code: destinationCountry.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setTrips(prevTrips =>
        prevTrips.map(trip =>
          trip.id === selectedTripId
            ? {
              ...trip,
              destinations: Array.isArray(trip.destinations)
                ? [...trip.destinations, res.data]
                : [res.data],
            }
            : trip
        )
      )

      setShowModal(false)
      alert('Destination added successfully!')
    } catch (err: any) {
      console.error('Error adding destination:', err)
      alert(err.response?.data?.message || err.message || 'Failed to add destination')
    }
  }

  const handleDeleteDestination = async (tripId: string, destinationId: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/trips/${tripId}/destination/${destinationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTrips(prev =>
        prev.map(trip =>
          trip.id === tripId
            ? {
              ...trip,
              destinations: trip.destinations.filter(d => d.id !== destinationId),
            }
            : trip
        )
      )
    } catch (err) {
      console.error('Error deleting destination:', err)
      alert('Failed to delete destination')
    }
  }

  const getVisaStatusBadge = (status: string | null) => {
    if (!status) return null

    const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
      'visa_required': { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
      'visa_free': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      'visa_on_arrival': { bg: 'bg-blue-100', text: 'text-blue-700', icon: Plane },
      'e_visa': { bg: 'bg-purple-100', text: 'text-purple-700', icon: Globe },
    }

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertCircle }
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3.5 h-3.5 mr-1" />
        {status.replace(/_/g, ' ').toUpperCase()}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleExport = async (tripId: string) => {
    const token = localStorage.getItem('token')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/trips/${tripId}/export`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'trip.pdf'
    a.click()

    window.URL.revokeObjectURL(url)
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600 mt-1">Plan and manage your travel itineraries</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
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

      {/* Create New Trip Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Create New Trip</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Name
            </label>
            <input
              type="text"
              placeholder="e.g., European Summer Adventure"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={newTrip.name}
              onChange={e => setNewTrip({ ...newTrip, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={newTrip.start_date}
              onChange={e => setNewTrip({ ...newTrip, start_date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={newTrip.end_date}
              onChange={e => setNewTrip({ ...newTrip, end_date: e.target.value })}
            />
          </div>
        </div>

        <button
          className="mt-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          onClick={handleCreateTrip}
        >
          Create Trip
        </button>
      </div>

      {/* Trips List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">

          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading trips...</p>
          </div>
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600">Create your first trip to start planning your journey!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Trip Header */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{trip.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>{calculateDays(trip.start_date, trip.end_date)} days</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        <span>{trip.destinations?.length || 0} destinations</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-sm border border-blue-200"
                    onClick={() => openAddDestinationModal(trip.id)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Destination</span>
                  </button>
                  <button
                    onClick={() => handleExport(trip.id)}
                    className="ml-3 flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <span>Export PDF</span>
                  </button>

                </div>
              </div>

              {/* Destinations */}
              <div className="p-6">
                {(trip.destinations ?? []).length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No destinations added yet</p>
                    <button
                      onClick={() => openAddDestinationModal(trip.id)}
                      className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Add your first destination
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Country</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Visa Status</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Registration</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Passport</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Checked</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(trip.destinations ?? []).map((dest, index) => (
                          <tr key={dest.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Globe className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {countries.find(c => c.code === dest.country_code)?.name || dest.country_code}
                                  </p>
                                  <p className="text-xs text-gray-500">{dest.country_code}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {getVisaStatusBadge(dest.visa_status)}
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-700 capitalize">
                                {dest.visa_category?.replace(/_/g, ' ') || '-'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-700">
                                {dest.visa_duration || '-'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {dest.mandatory_reg ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                  Required
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">No</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              {dest.passport ? (
                                <div className="text-sm">
                                  <p className="font-medium text-gray-900">{dest.passport.country_code}</p>
                                  <p className="text-xs text-gray-500">Exp: {formatDate(dest.passport.expiry_date)}</p>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">-</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-500">
                                {dest.created_at ? formatDate(dest.created_at) : '-'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                                onClick={() => handleDeleteDestination(trip.id, dest.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Destination Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Add Destination</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Country
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                >
                  <option value="">Select a country</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Passport
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedPassportId || ''}
                  onChange={e => setSelectedPassportId(e.target.value)}
                >
                  {passports.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.country_code} - Expires: {formatDate(p.expiry_date)}
                    </option>
                  ))}
                </select>
              </div>

              {passports.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">No passports found</p>
                    <p className="mt-1">Please add a passport before adding destinations.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddDestination}
                disabled={!destinationCountry || !selectedPassportId}
              >
                Add Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}