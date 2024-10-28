'use client'

import React from 'react'
import Image from 'next/image'
import { Input, Checkbox, Button } from '@nextui-org/react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function LoginPage() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [confirmVisible, setConfirmVisible] = React.useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmVisibility = () => setConfirmVisible(!confirmVisible)

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <Image
            src="/images/saastain_logo.svg"
            alt="SaaStain Logo"
            width={150}
            height={40}
            className="mb-8"
          />
          <h1 className="text-2xl font-bold mb-2 text-[#2D3748]">Get Started With Saastain</h1>
          <p className="text-[#718096] mb-8">Fill the details below to create an account</p>
          
          <form className="space-y-4">
            <Input
              label="Name"
              placeholder="Your Full Name"
              variant="bordered"
            />
            <Input
              label="Email Address"
              placeholder="Email"
              type="email"
              variant="bordered"
            />
            <Input
              label="Password"
              placeholder="Password"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
            <Input
              label="Confirm Password"
              placeholder="Confirm Password"
              type={confirmVisible ? "text" : "password"}
              variant="bordered"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility}>
                  {confirmVisible ? (
                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button> 
              }
            />
            <Checkbox>I agree to the Terms and Conditions</Checkbox>
            <Button color="primary" className="w-full bg-[#22614A]">
              Sign Up
            </Button>
          </form>
          
          <p className="mt-4 text-center text-[#718096]">
            Already have an account? <a href="#" className="text-gray-500 border p-2 rounded-lg">Log in</a>
          </p>
        </div>
      </div>
      
      <div 
  className="w-1/2 bg-cover bg-center p-8 flex items-center justify-center bg-[#133726]" 
>

        <Image
          src="/images/Onboarding-bg.png"
          alt="Mountain Background"
          width={1920}
          height={2160}
        />
      </div>
    </div>
  )
}
