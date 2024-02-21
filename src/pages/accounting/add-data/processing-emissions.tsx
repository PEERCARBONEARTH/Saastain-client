import AppLayout from "@/layouts/AppLayout";
import { z } from "zod";
import { NextPageWithLayout } from "@/types/Layout";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Spacer, Button, Breadcrumbs, BreadcrumbItem, Accordion, AccordionItem } from "@nextui-org/react";
import { Check, X } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";
import { FaAnglesRight, FaAnglesDown, FaAnglesLeft } from "react-icons/fa6";


const schema = z.object({
	date: z.date(),
	processType: z.string(),
	processEmissionName: z.string(),
    wasteGas: z.string(),
	emissionUnit: z.string(),
	wasteGasAmount: z.number(),
});

const FugitiveEmission: NextPageWithLayout = () => {
	// define the form
	const formMethods = useForm<z.infer<typeof schema>>({
		defaultValues: {
			date: new Date(),
			processType: "",
			processEmissionName: "",
            wasteGas: "",
			emissionUnit: "",
			wasteGasAmount: 0,	
		},
	});

	const onSubmit = (data: z.infer<typeof schema>) => {
		console.log(data);
	};

	const options = [
		{ value: "option1", label: "Option  1" },
		{ value: "option2", label: "Option  2" },
		{ value: "option3", label: "Option  3" },
	];

    const defaultContent="";

	return (
		<Card className="mt-150 p-6 bg-[#E4FCE6] h-full">
			<Breadcrumbs>
				<BreadcrumbItem>Accounting</BreadcrumbItem>
				<BreadcrumbItem>Add Data</BreadcrumbItem>
			</Breadcrumbs>
			<div className="p-4 mt-4">
				<h1 className="text-xl font-bold">Process Emissions</h1>

				<p className="mt-6">In this section, please enter details of the fuel combustion from owned / controlled sources.
                 This section includes equipment like boilers , generators and heaters.
                 </p>

                 <Accordion>
                    <AccordionItem className="flex" key="anchor" aria-label="Learn More" indicator={({ isOpen }) => (isOpen ? <FaAnglesLeft /> : <FaAnglesRight />)} title={<span className="text-sm">Learn More</span>} >
                    <div className="mt-12"> 
                        {defaultContent}
                    </div>
                    </AccordionItem>
                </Accordion>


			</div>
			<Spacer y={6} />
			<div className="p-4">
				<FormProvider {...formMethods}>
					<form onSubmit={formMethods.handleSubmit(onSubmit)}>
						<div className="mb-6">
							<AppInput label="Select Accounting Period" name="date" type="date" control={formMethods.control} className="w-full" />
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="mb-4">
								<div className="flex items-center gap-4">
									<AppSelect label="Process Type" name="processType" placeholder="Select Process" control={formMethods.control} options={options}  />
								</div>
							</div>

							<div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Process Emission Name" name="processEmissionName" placeholder="Name" options={options} control={formMethods.control} />
								</div>
							</div>
                        </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

							<div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Waste Gas" name="wasteGas" placeholder="Select One" options={options} control={formMethods.control} />
								</div>
							</div>

							<div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Unit of emission" name="emissionUnit" options={options} placeholder="Select One" control={formMethods.control} />
								</div>
							</div>

							<div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppInput label="Amount of waste gas" name="wasteGasAmount" placeholder="Select One" type="number" control={formMethods.control} />
								</div>
							</div>
                            </div>
						
					</form>
				</FormProvider>

				<div className="mb-4 gap-8 pr-10">
					<div className="card-actions  flex flex-col md:flex-row w-full justify-between md:justify-end gap-8">
						<Button className="btn btn-primary bg-[#5E896E]">
							<Check size={15} color="white" />
							Calculate
						</Button>
						<Button className="btn btn-secondary border border-[#5E896E]">
							<X size={15} color="green" />
							Cancel
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
};

FugitiveEmission.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default FugitiveEmission;
