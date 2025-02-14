'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import FormContainer from '../components/FormContainer'

const CompanyBioPage = () => {
  const [currentStep, setCurrentStep] = useState('bio')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="p-4 bg-white">
        <Link href="/dtb-event" className="inline-flex items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        {/* <h1 className="mt-2 text-xl font-semibold">
          {currentStep === 'bio' ? 'Company Bio' : 'Travel Info'}
        </h1> */}
      </div>

      {/* Event Card - Only shown on bio step */}
      {currentStep === 'bio' && (
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
              <h2 className="text-2xl font-bold">Event Name</h2>
              <div className="flex gap-2 mt-2 text-sm">
                <span>Location</span>
                <span>•</span>
                <span>Date</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Container */}
      <FormContainer onStepChange={setCurrentStep} />
    </div>
  )
}

export default CompanyBioPage 