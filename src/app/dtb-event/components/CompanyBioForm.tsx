import React, { useState } from 'react'
import FormWrapper from './FormWrapper'

interface CompanyBioFormProps {
  onNext: () => void
}

const CompanyBioForm = ({ onNext }: CompanyBioFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <FormWrapper title="General Information" bgColor="bg-[#F8E4D0]">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A3A2F]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A3A2F]"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm mb-1">Your Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company name"
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

export default CompanyBioForm 