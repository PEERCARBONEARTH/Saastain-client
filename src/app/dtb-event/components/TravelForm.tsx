import React, { useState } from 'react'
import FormWrapper from './FormWrapper'

interface TravelFormProps {
  onNext: () => void
}

const TravelForm = ({ onNext }: TravelFormProps) => {
  const [transportMode, setTransportMode] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [location, setLocation] = useState('')

  return (
    <FormWrapper title="Travel Information" bgColor="bg-[#E8F5E9]">
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">How did you arrive at the venue?</label>
          <select
            value={transportMode}
            onChange={(e) => setTransportMode(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A3A2F]"
          >
            <option value="">Select transport mode</option>
            <option value="car">Car</option>
            <option value="flight">Flight</option>
          </select>
        </div>

        {transportMode === 'car' && (
          <div>
            <label className="block text-sm mb-1">What type of car did you use?</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A3A2F]"
            >
              <option value="">Select car type</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
              <option value="petrol">Petrol</option>
            </select>
          </div>
        )}

        {transportMode === 'flight' && (
          <div>
            <label className="block text-sm mb-1">How long was your flight?</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A3A2F]"
            >
              <option value="">Select flight duration</option>
              <option value="short">Short Flight (1-2hrs)</option>
              <option value="medium">Medium Flight (2-4hrs)</option>
              <option value="long">Long Flight (4+ hrs)</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Where did you come from?</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location Pin"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A3A2F]"
          />
          <p className="text-xs text-gray-500 mt-1">This is optional</p>
        </div>

        <button
          onClick={onNext}
          className="w-1/4 bg-[#0A3A2F] text-white py-3 px-4 rounded-lg flex items-center justify-between mt-6"
        >
          Next
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </FormWrapper>
  )
}

export default TravelForm 