'use client';

import React, { createContext, useContext, useState } from 'react';
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import BasicDetails from '../new/BasicDetails';
import WasteForm from '../new/Waste';
import ProgressSteps from './ProgressSteps';
import TravelForm from '../new/Travel';
import EnergyForm from '../new/Energy';
import FoodForm from '../new/Food';

export type StepData = {
  basicDetails?: any;
  travel?: any;
  energy?: any;
  waste?: any;
  food?: any;
};

type EventPledgeContextType = {
  currentStep: number;
  stepData: StepData;
  nextStep: () => void;
  previousStep: () => void;
  setStepData: (step: keyof StepData, data: any) => void;
  goToStep: (step: number) => void;
};

const EventPledgeContext = createContext<EventPledgeContextType | undefined>(undefined);

export const useEventPledge = () => {
  const context = useContext(EventPledgeContext);
  if (context === undefined) {
    throw new Error('useEventPledge must be used within an EventPledgeProvider');
  }
  return context;
};

const getBreadcrumbTitle = (step: number) => {
  switch (step) {
    case 1:
      return 'Basic Details';
    case 2:
      return 'Travel';
    case 3:
      return 'Energy';
    case 4:
      return 'Waste';
    case 5:
      return 'Food';
    default:
      return 'Basic Details';
  }
};

const EventPledgeProvider: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({});

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  };

  const updateStepData = (step: keyof StepData, data: any) => {
    setStepData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetails />;
      case 2:
        return <TravelForm />;
      case 3:
        return <EnergyForm />;
      case 4:
        return <WasteForm />;
      case 5:
        return <FoodForm />;
      default:
        return <BasicDetails />;
    }
  };

  return (
    <EventPledgeContext.Provider 
      value={{
        currentStep,
        stepData,
        nextStep,
        previousStep,
        setStepData: updateStepData,
        goToStep
      }}
    >
      <div className="w-full">
        <Breadcrumbs>
          <BreadcrumbItem>Neutral Events</BreadcrumbItem>
          <BreadcrumbItem>Create Event</BreadcrumbItem>
        </Breadcrumbs>
        <div className="mt-4">
          <ProgressSteps currentStep={currentStep} />
        </div>
        <div className="mt-12">
          {renderStep()}
        </div>
      </div>
    </EventPledgeContext.Provider>
  );
};

export default EventPledgeProvider;