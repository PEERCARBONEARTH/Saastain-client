import React from 'react'
import Link from 'next/link'

const SuccessScreen = () => {
  return (
    <div className="text-center py-8">
      <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
        <svg 
          className="w-12 h-12 text-green-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">
        You have successfully recorded an emission with DTB
      </h2>

      <Link 
        href="/dtb-event/records"
        className="inline-block bg-[#0A3A2F] text-white py-3 px-6 rounded-lg mt-6"
      >
        View Your Record
      </Link>
    </div>
  )
}

export default SuccessScreen 