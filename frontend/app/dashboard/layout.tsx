'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import {
  Plane,
  FileText,
  Globe,
  Calendar,
  CreditCard,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Bell,
  LayoutDashboard
} from 'lucide-react'
import { useRouter } from 'next/navigation'



interface DashboardLayoutProps {
  children: ReactNode
}

interface UserInfo {
  name: string
  email: string
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserInfo>({ name: '', email: '' })

  // Fetch user info from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [])

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/trips', label: 'My Trips', icon: Plane },
    { href: '/dashboard/passport', label: 'Passports', icon: FileText },
    { href: '/dashboard/visa', label: 'Visa Requirements', icon: Globe },
    { href: '/dashboard/documents', label: 'Documents', icon: FileText },
    { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  ]

  const secondaryItems = [
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/help', label: 'Help & Support', icon: HelpCircle },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm fixed h-screen">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Visa Planner
              </h2>
              <p className="text-xs text-gray-500">Travel with confidence</p>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg mb-1
                    transition-all duration-200 group
                    ${active
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                  />
                  <span className={`font-medium ${active ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                </Link>
              )
            })}
          </div>

          {/* Secondary Navigation */}
          <div className="pt-6 border-t border-gray-200">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Account
            </p>
            {secondaryItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg mb-1
                    transition-all duration-200 group
                    ${active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'No Name'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email || 'No Email'}</p>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500 shrink-0" />
            </button>
          </div>
        </div>

        {/* Premium Upgrade Banner */}
        <div className="p-4 m-4 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl text-white">
          <div className="flex items-start space-x-2 mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Upgrade to Pro</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Get unlimited visa checks and priority support
              </p>
            </div>
          </div>
          <button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-medium text-sm py-2 px-4 rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
