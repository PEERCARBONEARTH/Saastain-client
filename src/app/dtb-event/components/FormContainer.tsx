import React, { useState } from 'react'
import CompanyBioForm from './CompanyBioForm'
import TravelForm from './TravelForm'
import EnergyForm from './EnergyForm'
import WasteForm from './WasteForm'
import SuccessScreen from './SuccessScreen'

export type FormStep = 'bio' | 'travel' | 'energy' | 'waste' | 'success'

const FormContainer = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>('bio')
  const [formData, setFormData] = useState({
    bio: {},
    travel: {},
    energy: {},
    waste: {}
  })

  const handleNext = (step: FormStep, data = {}) => {
    // Save form data
    setFormData(prev => ({
      ...prev,
      [currentStep]: data
    }))
    // Move to next step
    setCurrentStep(step)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Description */}
      <div className="px-4 my-4 text-center">
        <p className="text-lg text-[#133726]">
          Answer a few questions about the event,<br/> to help us track our emissions.
        </p>
        <p className="text-xs text-gray-500 mt-1 italic">
          All information filled here will only be used by DTB Bank and will be cleared upon
        </p>
      </div>

      {/* Forms */}
      <div className="px-4">
        {currentStep === 'bio' && <CompanyBioForm onNext={() => handleNext('travel')} />}
        {currentStep === 'travel' && <TravelForm onNext={() => handleNext('energy')} />}
        {currentStep === 'energy' && <EnergyForm onNext={() => handleNext('waste')} />}
        {currentStep === 'waste' && <WasteForm onNext={() => handleNext('success')} />}
        {currentStep === 'success' && <SuccessScreen />}
      </div>

      {/* Did You Know Section */}
      <div className="p-4 mt-8 bg-gray-200 rounded-lg">
        <h4 className="font-medium mb-2">Did You Know?</h4>
        <p className="text-sm text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor voluptate
        </p>
      </div>
    </div>
  )
}

export default FormContainer 