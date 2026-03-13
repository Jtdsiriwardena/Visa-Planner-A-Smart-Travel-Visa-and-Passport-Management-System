'use client'

import Link from 'next/link'

export default function Navbar() {


  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="shrink-0">
            <Link href="/">
              <h1 className="text-xl font-bold text-blue-600">Visa Planner</h1>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
