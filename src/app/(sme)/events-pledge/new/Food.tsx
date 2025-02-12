'use client';

import { FC, useState } from 'react';
import { Card, CardBody, Button, Divider, RadioGroup, Radio } from "@heroui/react";
import { useEventPledge } from '../components/EventPledgeProvider';
import Emissions from '../components/Emission';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FormProvider, useForm } from 'react-hook-form';
import AppInput from '@/components/forms/AppInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
    meatPercentage: z.string().min(1, "Percentage of food that was meat is required"),
    swagBudget: z.string().min(1, "Budget spent on swag/gifts is required"),
  });

const FoodForm: FC = () => {
    const { nextStep, previousStep, setStepData } = useEventPledge();
    const [alcoholicAmount, setAlcoholicAmount] = useState('yes');
    const [nonAlcoholicAmount, setNonAlcoholicAmount] = useState('yes');
    const [knowMeatAmount, setKnowMeatAmount] = useState('yes');
    const [snacksAmount, setSnacksAmount] = useState('yes');

    const formMethods = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
          meatPercentage: '',
          swagBudget: '',
        }
      });

    const { handleSubmit, control, formState: { errors }, reset, setValue } = formMethods;

    const handleNext = () => {
        setStepData('food', {
            // Add your food form data here when you implement the form
        });
        nextStep();
    };

    const onSubmit = (data) => {
        const foodData = {
          formData: data,
          alcoholicAmount,
          nonAlcoholicAmount,
          knowMeatAmount,
          snacksAmount,
        };
    
        setStepData('food', foodData);
        nextStep();
      };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="col-span-8">
                <Card className="bg-white">
                    <CardBody className="-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Food & Beverages</h2>
                            <p className="text-gray-600 text-sm">
                                Provide information about catering and food services to calculate environmental impact.
                            </p>
                        </div>

                <div className="mb-8">
                    <h3 className="mb-3 text-base font-medium">Alcoholic Drinks</h3>
                    <RadioGroup
                    value={alcoholicAmount}
                    onValueChange={setAlcoholicAmount}
                    orientation="horizontal"
                    >
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                    </RadioGroup>
                </div>

                <div className="mb-8">
                    <h3 className="mb-3 text-base font-medium">Non-Alcoholic Drinks</h3>
                    <RadioGroup
                    value={nonAlcoholicAmount}
                    onValueChange={setNonAlcoholicAmount}
                    orientation="horizontal"
                    >
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                    </RadioGroup>
                </div>

                <div className="mb-8">
                    <h3 className="mb-3 text-base font-medium">Snacks</h3>
                    <RadioGroup
                    value={snacksAmount}
                    onValueChange={setSnacksAmount}
                    orientation="horizontal"
                    >
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                    </RadioGroup>
                </div>

                <div className="mb-8">
                    <h3 className="mb-3 text-base font-medium">Meat</h3>
                    <RadioGroup
                    value={knowMeatAmount}
                    onValueChange={setKnowMeatAmount}
                    orientation="horizontal"
                    >
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                    </RadioGroup>
                </div>

                <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit)} className=" w-1/2">
                    <div className="space-y-8">
                      <AppInput
                        label="Percentage of Food that was Meat"
                        name="meatPercentage"
                        type="number"
                        control={control}
                        error={errors.meatPercentage}
                        placeholder="0"
                      />

                    <AppInput
                        label="Budget spent on swags/gifts"
                        name="swagBudget"
                        type="number"
                        control={control}
                        error={errors.swagBudget}
                        placeholder="0"
                      />
                    </div>
                </form>
                </FormProvider>

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
                                Finish
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="col-span-4">
                <Emissions />
            </div>
        </div>
    );
};

export default FoodForm