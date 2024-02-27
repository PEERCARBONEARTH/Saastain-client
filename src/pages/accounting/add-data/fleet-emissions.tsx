import AppLayout from "@/layouts/AppLayout";
import { z } from "zod";
import { NextPageWithLayout } from "@/types/Layout";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Spacer, Button, Breadcrumbs, BreadcrumbItem, Accordion, AccordionItem } from "@nextui-org/react";
import { AnchorIcon, Check, X } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";
import { FaAnglesRight, FaAnglesDown, FaAnglesLeft } from "react-icons/fa6";


const schema = z.object({
	date: z.date(),
	fleetType: z.string(),
	fleetName: z.string(),
	fleetCategory: z.string(),
	fuelWeight: z.string(),
    fuelType: z.string(),
    fuelUnit: z.string(),
	fuelAmount: z.number(),
});

const FugitiveEmission: NextPageWithLayout = () => {
	// define the form
	const formMethods = useForm<z.infer<typeof schema>>({
		defaultValues: {
			date: new Date(),
			fleetType: "",
			fleetName: "",
			fleetCategory: "",
			fuelWeight: "",
            fuelType: "",
            fuelUnit: "",
			fuelAmount: 0,
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
				<h1 className="text-xl font-bold">Fleet Emissions</h1>

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
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="mb-4">
								<div className="flex items-center gap-4">
									<AppSelect  label="Fleet Type" name="fleetType" control={formMethods.control} options={options} placeholder="Vehicles" />
								</div>
							</div>

							<div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Fleet Name" name="fleetName" placeholder="KIA" options={options} control={formMethods.control} />
								</div>
							</div>

                            <div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Fleet Category" name="fleetCategory" placeholder="KIA" options={options} control={formMethods.control} />
								</div>
							</div>
                        </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                            <div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Fuel Weight" name="fuelWeight" placeholder="Select One" options={options} control={formMethods.control} />
								</div>
							</div>

							<div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Fuel Type" name="fuelType" placeholder="Select One" options={options} control={formMethods.control} />
								</div>
							</div>

							<div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Fuel Unit" name="fuelUnit" placeholder="Select One" options={options}  control={formMethods.control} />
								</div>
							</div>

                            <div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppInput label="Select Fuel Amount" name="fuelAmount" placeholder="Select One" type="number" control={formMethods.control} />
								</div>
							</div>

                            </div>
						
					</form>
				</FormProvider>

				<div className="mb-4 gap-8 pr-10">
					<div className="card-actions  flex flex-col md:flex-row w-full justify-between md:justify-end gap-8">
						<Button className="btn btn-primary bg-[#5E896E]">
							<Check size={15} color="white" />
							Save
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
