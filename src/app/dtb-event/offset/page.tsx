'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const OffsetPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white">
        <Link href="/dtb-event/records" className="inline-flex items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>

      {/* Event Card */}
      <div className="mx-4 mt-4">
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            src="/images/dtb-event/event-banner.jpg"
            alt="Event banner"
            width={400}
            height={200}
            className="w-full object-cover h-[160px]"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h2 className="text-2xl font-bold">Order for joy,<br />this festive season.</h2>
            <div className="flex gap-2 mt-2 text-sm">
              <span>Location</span>
              <span>•</span>
              <span>Date</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Emissions Display */}
      <div className="px-4 mt-6 text-center">
        <h2 className="text-2xl font-bold">2,234</h2>
        <p className="text-sm text-gray-600">metric tonnes of CO2E</p>
      </div>

      {/* Offset Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A3A2F] text-white p-6 rounded-t-3xl">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Would you like to offset your emissions
        </h3>
        
        <div className="flex gap-4">
          <Link
            href="/dtb-event/records"
            className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-center"
          >
            No
          </Link>
          <Link
            href="/dtb-event/check-email"
            className="flex-1 py-3 px-4 rounded-lg bg-white text-[#0A3A2F] text-center"
          >
            Yes
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OffsetPage 