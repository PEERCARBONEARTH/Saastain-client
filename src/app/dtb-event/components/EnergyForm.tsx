import React, { useState } from 'react'
import FormWrapper from './FormWrapper'

interface EnergyFormProps {
  onNext: () => void
}

const EnergyForm = ({ onNext }: EnergyFormProps) => {
  const [energySource, setEnergySource] = useState('')

  return (
    <FormWrapper title="Energy" bgColor="bg-[#E3F2FD]">
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">What energy source does the venue use?</label>
          <select
            value={energySource}
            onChange={(e) => setEnergySource(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A3A2F]"
          >
            <option value="">Select energy source</option>
            <option value="electricity">Electricity</option>
            <option value="solar">Solar</option>
            <option value="generator">Generator</option>
          </select>
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

export default EnergyForm 