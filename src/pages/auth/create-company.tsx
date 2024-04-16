import React from 'react'
import Image from "next/image";
import { Button, Spacer } from "@nextui-org/react";
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AppInput from '@/components/forms/AppInput';
import AppTextArea from '@/components/forms/AppTextArea';
import { useState } from 'react';
import { FolderPen, MailCheck, MapPin, PencilLine, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import useCompanyUtils from '@/hooks/useCompanyUtils';
import { useSession } from 'next-auth/react';

const schema = z.object({
    companyName: z.string(),
    companyLocation: z.string(),
    companyDescription: z.string(),
    companyPhone: z.string(),
    companyEmail: z.string(),
})

const CompanyProfile = () => {
    const [loading, setLoading] = useState(false);
    const { createCompany } = useCompanyUtils()
    const { data: session}= useSession()

    const formMethods = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            companyName: "",
            companyLocation: "",
            companyDescription: "",
            companyPhone: "",
            companyEmail: "",
        },
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = formMethods;

    const onSubmit = async (data: z.infer<typeof schema>) => {
        setLoading(true);
        const id = toast.loading('Creating Company Profile...');

        try {
            if(session){
            const response = await createCompany( session.user.id, data.companyName, data.companyPhone, data.companyEmail, data.companyLocation, data.companyDescription);

            console.log(response);
            if (response.status === 'success') {
                toast.success('Company Profile Created Successfully', { id });
                reset();
            } else {
                toast.error(response.msg, { id });
            }
        } else {
            toast.error('User session not found', { id });
        }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred, please try again', { id });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-auth h-screen'>
            <div className="">
                <Image className='w-1/6 p-6' src={"/images/saastain_logo.svg"} alt="" width={140} height={140} />
            </div>
            <Spacer y={6} />
            <div className="container ml-[300px]  items-start md:h-[80vh] max-w-4xl">
                <div className='flex flex-col gap-4'>
                    <h2 className='font-semibold text-3xl'>Set Up Your Company Profile </h2>
                    <p className='text-sm leading-1'>Saastain goes beyond conventional solutions, empowering you to not only navigate the complexities of emissions tracking but also to drive sustainable growth.</p>
                </div>
                <Spacer y={6} />
                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AppInput
                                label="Company Name"
                                name="companyName"
                                placeholder='Enter Company Name'
                                control={control}
                                error={errors.companyName}
                                startContent={<FolderPen size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
                            />
                            <AppInput
                                label="Company Phone"
                                name="companyPhone"
                                placeholder='Enter Company Phone'
                                control={control}
                                error={errors.companyPhone}
                                startContent={<Phone size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
                            />

                            <AppInput
                                label="Company Email"
                                name="companyEmail"
                                placeholder='Enter Company Email'
                                control={control}
                                error={errors.companyEmail}
                                startContent={<MailCheck size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
                            />
                            <AppInput
                                label="Company Location"
                                name="companyLocation"
                                placeholder='Enter Company Location'
                                control={control}
                                error={errors.companyLocation}
                                startContent={<MapPin size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
                            />

                        </div>
                        <Spacer y={4} />
                        <AppTextArea
                            label="Company Description"
                            name="companyDescription"
                            placeholder='Enter Company Description'
                            control={control}
                            error={errors.companyDescription}
                            startContent={<PencilLine size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
                        />
                        <div className="flex flex-col md:flex-row  justify-end py-4 my-8">
						<Button type="submit" color="primary" isDisabled={loading} isLoading={loading}>
							Submit
						</Button>
					</div>
                    </form>
                </FormProvider>

            </div>
        </div>
    )
}


export default CompanyProfile
