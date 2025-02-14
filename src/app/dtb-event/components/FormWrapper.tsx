import { Divider } from '@heroui/react'
import React, { ReactNode } from 'react'
import { GoCheckCircle } from 'react-icons/go';

interface FormWrapperProps {
  title: string
  children: ReactNode
  bgColor: string
}

const FormWrapper = ({ title, children, bgColor }: FormWrapperProps) => {
  return (
    <div className={`${bgColor} rounded-2xl p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-[#133726]">{title}</h3>
        <GoCheckCircle className="w-6 h-6" />
      </div>
      <Divider className="my-4 bg-green-800" />
      {children}
    </div>
  )
}

export default FormWrapper 