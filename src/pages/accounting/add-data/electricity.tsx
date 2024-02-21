import AppLayout from "@/layouts/AppLayout";
import { z } from "zod";
import { NextPageWithLayout } from "@/types/Layout";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Button, Breadcrumbs, BreadcrumbItem, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Check, X, XIcon } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";

// import {Button} from "@/components/ui/button";

const schema = z.object({
	date: z.date(),
	emissionSource: z.string(),
	emissionName: z.string(),
	emissionGas: z.string(),
	unit: z.string(),
	gasEmitted: z.number(),
});

const FugitiveEmission: NextPageWithLayout = () => {
	// define the form
	const formMethods = useForm<z.infer<typeof schema>>({
		defaultValues: {
			date: new Date(),
			emissionSource: "",
			emissionName: "",
			emissionGas: "",
			unit: "",
			gasEmitted: 0,
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
	return (
		<Card className="p-10 bg-[#E4FCE6]">
			<CardHeader>
				<Breadcrumbs>
					<BreadcrumbItem>Accounting</BreadcrumbItem>
					<BreadcrumbItem>Add Data</BreadcrumbItem>
				</Breadcrumbs>
			</CardHeader>
			<FormProvider {...formMethods}>
				<form onSubmit={formMethods.handleSubmit(onSubmit)}>
					<CardBody>
						<div className="p-4 mt-4">
							<h1 className="text-xl font-bold">Electricity Consumption</h1>
							<p className="mt-6">In this section please enter the details on electricity consumption from owned or controlled sources.</p>
						</div>
						<div className="p-4">
							<div className="mb-6">
								<AppInput label="Select Accounting Period" name="date" type="date" control={formMethods.control} className="w-full" />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="mb-4">
									<div className="flex items-center gap-4">
										<AppSelect name="country" label="Select your country" control={formMethods.control} options={options} placeholder="Select your country" />
									</div>
								</div>

								<div className="mb-4">
									<div className="flex items-center gap-4 ">
										<AppSelect label="Electricity Sources" name="emissionSources" placeholder="Emission Sources" options={options} control={formMethods.control} />
									</div>
								</div>
								<div className="mb-4">
									<div className="flex items-center gap-4 ">
										<AppSelect
											label="Is it a renewable source"
											name="isRenewable"
											placeholder="
                                    yes or no"
											options={options}
											control={formMethods.control}
										/>
									</div>
								</div>

								<div className="mb-4">
									<div className="flex items-center gap-4 ">
										<AppInput label="Amount of Emissions" name="totalEmissions" placeholder="0" type="number" control={formMethods.control} />
									</div>
								</div>
							</div>
						</div>
					</CardBody>
					<CardFooter className="justify-between md:justify-end gap-5">
						<Button color="primary" startContent={<Check size={15} />}>
							Calculate
						</Button>
						<Button color="primary" startContent={<XIcon size={15} />} variant="bordered">
							Cancel
						</Button>
					</CardFooter>
				</form>
			</FormProvider>
		</Card>
	);
};

FugitiveEmission.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default FugitiveEmission;
