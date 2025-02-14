import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const DtbEvent = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/dtb-event/hero1.jpg"
          alt="Forest background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 py-4">
        {/* Header */}
        <div className="mb-auto">
          <div className="flex items-center gap-2 text-white">
            <Image 
              src="/images/dtb-event/ke-dtk-logo.png" 
              alt="DTB Logo" 
              width={160} 
              height={80}
            />
          </div>
          <div className="text-white text-sm mt-2">
            Powered by Saastain
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-auto">
          <h1 className="text-white text-4xl font-bold leading-tight mb-8">
            Know more<br />
            about your<br />
            carbon footprint
          </h1>
          
          <Link 
            href="/dtb-event/start" 
            className="inline-block bg-[#D68B22] text-white px-8 py-3 rounded-full"
          >
            Start
          </Link>
        </div>

        {/* Footer */}
        <div className="text-white text-sm">
          Powered by Saastain
        </div>
      </div>
    </div>
  )
}

export default DtbEvent