import React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

const steps = [
  { id: 1, name: 'Basic Details' },
  { id: 2, name: 'Travel' },
  { id: 3, name: 'Energy' },
  { id: 4, name: 'Waste' },
  { id: 5, name: 'Food' }
];

const ProgressSteps = ({ currentStep = 1 }) => {
  return (
    <div className="w-full mb-4 mt-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center relative">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  step.id <= currentStep ? "bg-primary" : "bg-gray-200",
                  "transition-colors duration-200"
                )}
              >
                {step.id < currentStep ? (
                  <CheckIcon className="w-5 h-5 text-white" />
                ) : (
                  <span className={cn(
                    "text-sm",
                    step.id <= currentStep ? "text-white" : "text-gray-500"
                  )}>{step.id}</span>
                )}
              </div>
              <span className={cn(
                "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap",
                step.id <= currentStep ? "text-primary font-medium" : "text-gray-500"
              )}>
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-[2px] flex-1 mx-2",
                  step.id < currentStep ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;



