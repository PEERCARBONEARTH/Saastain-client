import React, { useState } from 'react'
import FormWrapper from './FormWrapper'

interface WasteFormProps {
  onNext: () => void
}

const WasteForm = ({ onNext }: WasteFormProps) => {
  const [disposalMethod, setDisposalMethod] = useState('')
  const [trashcanType, setTrashcanType] = useState('')

  return (
    <FormWrapper title="Waste" bgColor="bg-[#FFF8E1]">
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">How did you dispose your waste?</label>
          <select
            value={disposalMethod}
            onChange={(e) => setDisposalMethod(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A3A2F]"
          >
            <option value="">Select disposal method</option>
            <option value="trashcans">Use of trashcans</option>
            <option value="recycling">Recycling bins</option>
          </select>
        </div>

        {disposalMethod === 'trashcans' && (
          <div>
            <label className="block text-sm mb-1">
              Were the trashcans divided into "Decomposing" or "Non-Decomposing"?
            </label>
            <select
              value={trashcanType}
              onChange={(e) => setTrashcanType(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A3A2F]"
            >
              <option value="">Select type</option>
              <option value="divided">Yes, they were divided</option>
              <option value="not-divided">No, they were not divided</option>
            </select>
          </div>
        )}

        <button
          onClick={onNext}
          className="w-1/4 bg-[#0A3A2F] text-white py-3 px-4 rounded-lg flex items-center justify-between mt-6"
        >
          Finish
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </FormWrapper>
  )
}

export default WasteForm 