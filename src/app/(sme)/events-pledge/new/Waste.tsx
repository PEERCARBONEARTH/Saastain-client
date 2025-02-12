'use client';

import { FC, useState, useEffect } from 'react';
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, Divider, Radio, RadioGroup } from "@heroui/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppInput from "@/components/forms/AppInput";
import { useEventPledge } from '../components/EventPledgeProvider';
import Emissions from '../components/Emission';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const schema = z.object({
  landFilledTrash: z.string().min(1, "Land filled trash amount is required"),
  recycling: z.string().min(1, "Recycling amount is required"),
  composting: z.string().min(1, "Composting amount is required"),
});

const WasteForm: FC = () => {
  const [knowWasteAmount, setKnowWasteAmount] = useState('yes');
  const { nextStep, previousStep, setStepData, stepData } = useEventPledge();

  const formMethods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      landFilledTrash: '',
      recycling: '',
      composting: '',
    }
  });

  const { handleSubmit, control, formState: { errors }, reset, setValue } = formMethods;

  useEffect(() => {
    if (stepData.waste) {
      reset(stepData.waste.formData);
      setKnowWasteAmount(stepData.waste.knowWasteAmount);
    }
  }, [stepData.waste, reset]);

  const onSubmit = (data) => {
    const wasteData = {
      formData: data,
      knowWasteAmount,
      totalWaste: knowWasteAmount === 'yes'
        ? parseFloat(data.landFilledTrash) + parseFloat(data.recycling) + parseFloat(data.composting)
        : null
    };

    setStepData('waste', wasteData);
    nextStep();
  };

  const handleNoWasteAmount = () => {
    const defaultData = {
      formData: {
        landFilledTrash: '0',
        recycling: '0',
        composting: '0'
      },
      knowWasteAmount: 'no',
      totalWaste: null
    };

    setStepData('waste', defaultData);
    nextStep();
  };

  useEffect(() => {
    if (knowWasteAmount === 'no') {
      reset({
        landFilledTrash: '0',
        recycling: '0',
        composting: '0'
      });
    }
  }, [knowWasteAmount, reset]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-8">
          <Card className="bg-white">
            <CardBody className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Waste</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Provide details about waste management and recycling efforts to calculate environmental impact.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="mb-3 text-base font-medium">Do you know the amount of waste produced in the event?</h3>
                <RadioGroup
                  value={knowWasteAmount}
                  onValueChange={setKnowWasteAmount}
                  orientation="horizontal"
                >
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </RadioGroup>
              </div>

              {knowWasteAmount === 'yes' ? (
                <FormProvider {...formMethods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-span-5">
                        <AppInput
                          label="Land Filled Trash"
                          name="landFilledTrash"
                          type="number"
                          control={control}
                          error={errors.landFilledTrash}
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <Button variant="bordered" className="w-full">
                          kg
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-span-5">
                        <AppInput
                          label="Recycling"
                          name="recycling"
                          type="number"
                          control={control}
                          error={errors.recycling}
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <Button variant="bordered" className="w-full">
                          kg
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-span-5">
                        <AppInput
                          label="Composting Waste"
                          name="composting"
                          type="number"
                          control={control}
                          error={errors.composting}
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <Button variant="bordered" className="w-full">
                          kg
                        </Button>
                      </div>
                    </div>

                    <Divider className="my-6" />

                    <div className="flex justify-between">
                      <Button
                        color="primary"
                        onClick={previousStep}
                      startContent={<IoIosArrowBack />}
                      >
                        Previous
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        endContent={<IoIosArrowForward />}

                      >
                        Next
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              ) : (
                <div>
                  <p className="text-gray-600 mb-6">
                    No problem! We'll use standard waste estimates based on your event type and number of attendees.
                  </p>
                  <Divider className="my-6" />
                  <div className="flex justify-between">
                    <Button
                      color="primary"
                      onClick={previousStep}
                      startContent={<IoIosArrowBack />}

                    >
                      Previous
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleNoWasteAmount}
                      endContent={<IoIosArrowForward />}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="col-span-4">
          <Emissions />
        </div>
      </div>
    </>
  );
};



export default WasteForm;