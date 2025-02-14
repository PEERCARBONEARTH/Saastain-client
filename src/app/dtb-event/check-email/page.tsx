'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const CheckEmailPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white">
        <Link href="/dtb-event/offset" className="inline-flex items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-4 mt-20">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <Image
              src="/images/dtb-event/email-confirm.png"
              alt="Email"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">Check Your Email</h2>
        <p className="text-center text-gray-600 text-sm">
          An preliminary certificate has been shared to your email. Once the offset has been bought, you shall get your official offset certificate
        </p>

        <button 
          onClick={() => window.location.href = '/dtb-event'}
          className="mt-8 bg-[#0A3A2F] text-white py-3 px-6 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* Did You Know Section */}
      <div className="absolute bottom-8 left-4 right-4 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-medium mb-2">Did You Know?</h4>
        <p className="text-sm text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor voluptate
        </p>
      </div>
    </div>
  )
}

export default CheckEmailPage 