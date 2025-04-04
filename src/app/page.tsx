import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white px-8 py-4 shadow-md">
        <div className="text-xl font-bold text-blue-600">Event</div>
        <div className="space-x-6">
          
          <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
            Admin
          </Link>
          <a href="/consumer" className="text-gray-700 hover:text-blue-600 font-medium">
            Consumer
          </a>
        </div>
      </nav>

      {/* Center Content */}
      <main className="flex flex-col justify-center items-center h-[80vh] text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">
          Event Management Website 2025
        </h1>
        <p className="text-gray-500 text-lg max-w-md">
          Simplify your event planning, hosting, and engagement — all in one place.
        </p>
      </main>
    </div>
  )
}
