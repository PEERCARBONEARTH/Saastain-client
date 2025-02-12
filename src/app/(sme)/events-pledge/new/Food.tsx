'use client';

import { FC } from 'react';
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { useEventPledge } from '../components/EventPledgeProvider';
import Emissions from '../components/Emission';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const FoodForm: FC = () => {
    const { nextStep, previousStep, setStepData } = useEventPledge();

    const handleNext = () => {
        setStepData('food', {
            // Add your food form data here when you implement the form
        });
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

                        {/* Add your food form fields here */}

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