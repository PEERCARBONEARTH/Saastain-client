'use client';

import { FC, useEffect } from 'react';
import { Card, CardBody, Button, Divider, Tabs, Tab } from "@heroui/react";
import { useEventPledge } from '../components/EventPledgeProvider';
import Emission from '../components/Emission';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AppInput from '@/components/forms/AppInput';
import AppSelect from '@/components/forms/AppSelect';
import { generateOptions } from '@/utils';

const schema = z.object({
    shortFlightPercentage: z.string().min(1, "Percentage of short flights is required"),
    carPercentage: z.string().min(1, "Percentage of car used is required"),
    planePercentage: z.string().min(1, "Percentage of plane used is required"),
    trainPercentage: z.string().min(1, "Percentage of train used is required"),
    carDistance: z.string().min(1, "Distance covered by car is required"),
    trainDistance: z.string().min(1, "Distance covered by train is required"),
    shortFlightDistance: z.string().min(1, "Distance covered by short flight is required"),
    mediumFlightDistance: z.string().min(1, "Distance covered by medium flight is required"),
    longFlightDistance: z.string().min(1, "Distance covered by long flight is required"),
    distanceType: z.string().min(1, "Distance type is required"),
  });

const TravelForm: FC = () => {
    const { nextStep, previousStep, stepData, setStepData } = useEventPledge();

    const handleNext = () => {
        setStepData('travel', {
            // Add your travel form data here when you implement the form
        });
        nextStep();
    };

    const formMethods = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
          shortFlightPercentage: "",
          carPercentage: "",
          planePercentage: "",
          trainPercentage: "" , 
          carDistance: "",
          trainDistance: "",
          shortFlightDistance: "",
          mediumFlightDistance: "",
          longFlightDistance: "",
          distanceType: ''
        }
      });

      const { handleSubmit, control, formState: { errors }, reset } = formMethods;

      const onSubmit = (data) => {
        setStepData('basicDetails', {
          ...data,
        });
        nextStep();
      };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="col-span-8">
                <Card className="bg-white">
                    <CardBody className="p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Travel Information</h2>
                            <p className="text-gray-600 text-sm">
                                Capture travel-related data to assess and minimize your event’s carbon footprint.
                            </p>
                        </div>
                        <div className="flex w-full flex-col">

                <Tabs aria-label="Options">
                    <Tab key="estimate" title="Estimate">
                    <Card>
                        <CardBody>
                        <FormProvider {...formMethods}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                            <AppInput
                                label="Percentage used by short flights"
                                placeholder="10%"
                                name="shortFlightPercentage"
                                control={control}
                                error={errors.shortFlightPercentage}
                            />

                            <AppInput
                                label="Percentage used by car"
                                placeholder="10%"
                                name="carPercentage"
                                type="number"
                                control={control}
                                error={errors.carPercentage}
                            />

                            <AppInput
                                label="Percentage used by plane"
                                placeholder="10%"
                                name="planePercentage"
                                type="number"
                                control={control}
                                error={errors.planePercentage}
                            />

                            <AppInput
                                label="Percentage used by train"
                                placeholder="10%"
                                name="trainPercentage"
                                type="number"
                                control={control}
                                error={errors.trainPercentage}
                            />
                            </form>
                            </FormProvider>
                        </CardBody>
                    </Card>
                    </Tab>
                    <Tab key="distance" title="Distance">
                    <Card>
                        <CardBody>
                        <FormProvider {...formMethods}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                            <AppSelect
                            label='Select Distance in miles or kilometers'
                            name='distanceType'
                            control={control}
                            error={errors.distanceType}
                            options={generateOptions(['Miles', 'Kms'])}
                            baseClassName='w-1/2'/>

                                <AppInput
                                label="Total Distance by Car"
                                placeholder="10"
                                name="milesByCar"
                                control={control}
                                error={errors.carDistance}
                            />
                          <AppInput
                                label="Total Distance by Train"
                                placeholder="10"
                                name="milesByCar"
                                control={control}
                                error={errors.trainDistance}
                            />

                            <AppInput
                                label="Total Distance by Short Flight"
                                placeholder="10"
                                name="milesByCar"
                                control={control}
                                error={errors.shortFlightDistance}
                            />

                            <AppInput
                                label="Total Distance by Medium Flight"
                                placeholder="10"
                                name="milesByCar"
                                control={control}
                                error={errors.mediumFlightDistance}
                            />

                            <AppInput
                                label="Total Distance by Long Flight"
                                placeholder="10"
                                name="milesByCar"
                                control={control}
                                error={errors.longFlightDistance}
                            />

                            </form>
                            </FormProvider>

                        </CardBody>
                    </Card>
                    </Tab>
                </Tabs>
                </div>

                        {/* Add your travel form fields here */}

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
                                onClick={handleNext}
                                endContent={<IoIosArrowForward />}

                            >
                                Next
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="col-span-4">
                <Emission />
            </div>
        </div>
    );
};


export default TravelForm