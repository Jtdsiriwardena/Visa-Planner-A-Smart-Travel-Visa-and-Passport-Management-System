'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import countries from '../../data/countries.json'
import { 
  FileText, 
  Plus, 
  Trash2, 
  Calendar, 
  Globe,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Passport {
  id: string
  country_code: string
  expiry_date: string
}

export default function PassportPage() {
  const [passports, setPassports] = useState<Passport[]>([])
  const [newPassport, setNewPassport] = useState({
    country_code: '',
    expiry_date: '',
  })
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

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
        setError('Failed to load passports')
      } finally {
        setLoading(false)
      }
    }
    fetchPassports()
  }, [token])

  const handleAdd = async () => {
    if (!newPassport.country_code || !newPassport.expiry_date) {
      setError('Please fill all fields')
      return
    }

    try {
      setError('')
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/passport`,
        {
          country_code: newPassport.country_code,
          expiry_date: newPassport.expiry_date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setPassports([...passports, res.data])
      setNewPassport({ country_code: '', expiry_date: '' })
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to create passport')
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return

    const confirmDelete = confirm('Are you sure you want to delete this passport?')
    if (!confirmDelete) return

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/passport/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setPassports(passports.filter(p => p.id !== id))
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to delete passport')
    }
  }

  const getCountryName = (code: string) => {
    return countries.find(c => c.code === code)?.name || code
  }

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const monthsUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)

    if (expiry < today) {
      return { status: 'expired', label: 'Expired', color: 'red' }
    } else if (monthsUntilExpiry <= 6) {
      return { status: 'expiring-soon', label: 'Expiring Soon', color: 'yellow' }
    } else {
      return { status: 'valid', label: 'Valid', color: 'green' }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (expiryDate: string) => {
    const { status, label, color } = getExpiryStatus(expiryDate)
    
    const colorClasses = {
      red: 'bg-red-100 text-red-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      green: 'bg-green-100 text-green-700',
    }

    const Icon = status === 'expired' ? AlertCircle : status === 'expiring-soon' ? Clock : CheckCircle

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
        <Icon className="w-3.5 h-3.5 mr-1" />
        {label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Passports</h1>
        <p className="text-gray-600 mt-1">Manage your travel documents</p>
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

      {/* Add New Passport Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Add New Passport</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={newPassport.country_code}
                onChange={(e) =>
                  setNewPassport({ ...newPassport, country_code: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Select a country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={newPassport.expiry_date}
                onChange={(e) =>
                  setNewPassport({ ...newPassport, expiry_date: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!newPassport.country_code || !newPassport.expiry_date}
          className="mt-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Add Passport
        </button>
      </div>

      {/* Passports List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading passports...</p>
          </div>
        </div>
      ) : passports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No passports yet</h3>
          <p className="text-gray-600">Add your first passport to start planning trips!</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Passports ({passports.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {passports.map((passport) => {
              const { status, color } = getExpiryStatus(passport.expiry_date)
              
              return (
                <div
                  key={passport.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Card Header with gradient */}
                  <div className={`h-2 ${
                    color === 'red' ? 'bg-linear-to-r from-red-500 to-red-600' :
                    color === 'yellow' ? 'bg-linear-to-r from-yellow-500 to-yellow-600' :
                    'bg-linear-to-r from-green-500 to-green-600'
                  }`}></div>

                  <div className="p-6">
                    {/* Country Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {getCountryName(passport.country_code)}
                          </h3>
                          <p className="text-sm text-gray-500">{passport.country_code}</p>
                        </div>
                      </div>
                    </div>

                    {/* Expiry Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        {getStatusBadge(passport.expiry_date)}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Expires on</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(passport.expiry_date)}
                        </span>
                      </div>

                      {/* Warning for expiring soon */}
                      {status === 'expiring-soon' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                          <p className="text-xs text-yellow-700">
                            <strong>Reminder:</strong> Some countries require 6 months validity on your passport.
                          </p>
                        </div>
                      )}

                      {/* Warning for expired */}
                      {status === 'expired' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                          <p className="text-xs text-red-700">
                            <strong>Expired:</strong> This passport cannot be used for travel.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(passport.id)}
                      className="mt-4 w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-lg transition-colors border border-red-200 hover:border-red-300 group-hover:shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete Passport</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Info Banner */}
      {passports.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Passport Tip</p>
              <p className="text-blue-700">
                Many countries require your passport to be valid for at least 6 months beyond your travel dates. 
                Keep your documents up to date to avoid travel disruptions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}