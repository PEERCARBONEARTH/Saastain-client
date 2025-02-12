'use client';

import { FC, useState, useEffect } from "react";
import { Breadcrumbs, BreadcrumbItem, Card, CardBody, Input, Button, Select, SelectItem, Checkbox, Progress, Divider } from "@heroui/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import AppDatePicker from "@/components/buttons/datepicker";
import { generateOptions } from "@/utils";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { useEventPledge } from '../components/EventPledgeProvider';
import Link from "next/link";
import Emissions from "../components/Emission";
import { IoIosArrowForward } from "react-icons/io";

const schema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  numberOfAttendees: z.string().min(1, "Number of attendees is required"),
  startDate: z.date(),
  endDate: z.date(),
  eventType: z.string().min(1, "Event type is required"),
  location: z.string().min(1, "Location is required"),
  country: z.string().min(1, "Country is required"),
  address: z.string().min(1, "Address is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  percentageLocal: z.string().min(1, "Percentage of local attendees is required")
});

const CreateEvent: FC = () => {
  const [isSingleDay, setIsSingleDay] = useState(false);
  const { nextStep, setStepData, stepData } = useEventPledge();

  const formMethods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      eventName: "",
      numberOfAttendees: "",
      startDate: new Date(),
      endDate: new Date(),
      eventType: "",
      location: "",
      country: "Kenya",
      address: "",
      zipCode: "",
      percentageLocal: ""
    }
  });

  const { handleSubmit, control, formState: { errors }, reset } = formMethods;

  useEffect(() => {
    if (stepData.basicDetails) {
      reset(stepData.basicDetails);
      setIsSingleDay(stepData.basicDetails.isSingleDay || false);
    }
  }, [stepData.basicDetails, reset]);

  const onSubmit = (data) => {
    setStepData('basicDetails', {
      ...data,
      isSingleDay
    });
    nextStep();
  };

  useEffect(() => {
    if (isSingleDay) {
      const startDate = formMethods.getValues('startDate');
      formMethods.setValue('endDate', startDate);
    }
  }, [isSingleDay, formMethods]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-8">
          <Card className="bg-white">
            <CardBody className="p-4">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Basic Details</h2>
                <p className="text-gray-600 text-sm">
                  Provide key information about your event to help track and manage its carbon footprint
                </p>
              </div>

              <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  <AppInput
                    label="Event Name"
                    placeholder="event name"
                    name="eventName"
                    control={control}
                    error={errors.eventName}
                  />

                  <AppInput
                    label="Number of Attendees"
                    placeholder="0"
                    name="numberOfAttendees"
                    type="number"
                    control={control}
                    error={errors.numberOfAttendees}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <AppDatePicker
                      label="Start Date"
                      name="startDate"
                      control={control}
                      className="w-full"
                      onChange={(date) => {
                        if (isSingleDay) {
                          formMethods.setValue('endDate', date);
                        }
                      }}
                    />
                    <AppDatePicker
                      label="End Date"
                      name="endDate"
                      control={control}
                      className="w-full"
                      // isDisabled={isSingleDay}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={isSingleDay}
                      onChange={(e) => setIsSingleDay(e.target.checked)}
                    />
                    <span className="text-sm">This is single day event</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <AppSelect
                      label="What type of event is this?"
                      name="eventType"
                      control={control}
                      error={errors.eventType}
                      options={generateOptions(['Physical', 'Virtual', 'Hybrid'])}
                    />
                    <AppInput
                      label="Provide the event location"
                      name="location"
                      control={control}
                      error={errors.location}
                      disabled={formMethods.watch('eventType') === 'Virtual'}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <AppSelect
                      label="Select the country"
                      name="country"
                      control={control}
                      error={errors.country}
                      options={generateOptions(['Kenya', 'Uganda', 'Tanzania'])}
                    />
                    <AppInput
                      label="Provide the address"
                      name="address"
                      control={control}
                      error={errors.address}
                      disabled={formMethods.watch('eventType') === 'Virtual'}
                    />
                    <AppInput
                      label="Provide the zip code"
                      name="zipCode"
                      control={control}
                      error={errors.zipCode}
                      disabled={formMethods.watch('eventType') === 'Virtual'}
                    />
                  </div>

                  <div>
                    <AppInput
                      label="What is the percentage of the people who will be coming from town?"
                      placeholder="20%"
                      name="percentageLocal"
                      type="number"
                      control={control}
                      error={errors.percentageLocal}
                      disabled={formMethods.watch('eventType') === 'Virtual'}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <HiOutlineInformationCircle className="w-4 h-4" />
                      This will help in predictions of travel emissions
                    </p>
                  </div>

                  <div>
                    <Divider className="my-6" />
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        color="primary"
                        endContent={<IoIosArrowForward/>}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
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



export default CreateEvent;