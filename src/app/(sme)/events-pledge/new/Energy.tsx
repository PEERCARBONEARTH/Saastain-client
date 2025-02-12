'use client';

import { FC } from 'react';
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { useEventPledge } from '../components/EventPledgeProvider';
import Emissions from '../components/Emission';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const EnergyForm: FC = () => {
    const { nextStep, previousStep, setStepData } = useEventPledge();

    const handleNext = () => {
        setStepData('energy', {
            // Add your energy form data here when you implement the form
        });
        nextStep();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="col-span-8">
                <Card className="bg-white">
                    <CardBody className="p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Energy</h2>
                            <p className="text-gray-600 text-sm">
                                Provide details on electricity consumption, energy sources, and sustainability measures to reduce emissions.
                            </p>
                        </div>

                        {/* Add your energy form fields here */}

                        <Divider className="my-6" />
                        <div className="flex justify-between">
                            <Button
                                color="primary"
                                onClick={previousStep}
                                startContent={<IoIosArrowBack />
                                }
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
                <Emissions />
            </div>
        </div>
    );
};

export default EnergyForm