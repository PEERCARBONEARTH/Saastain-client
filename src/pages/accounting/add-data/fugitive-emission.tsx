import AppLayout from "@/layouts/AppLayout";
import { z } from "zod";
import { NextPageWithLayout } from "@/types/Layout";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Spacer, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Check, X } from "lucide-react";
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
		<Card className="mt-150 p-6 bg-[#E4FCE6] h-full">
			<Breadcrumbs>
				<BreadcrumbItem>Accounting</BreadcrumbItem>
				<BreadcrumbItem>Add Data</BreadcrumbItem>
			</Breadcrumbs>
			<div className="p-4 mt-4">
				<h1 className="text-xl font-bold">Fugitive Emission</h1>

				<p className="mt-6">Here you can input data regarding fuel consumption from vehicles under your ownership / control. Whether it's</p>
				<p> cars, trucks or airplanes.</p>
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
									<AppSelect name="emissionSource" label="Emission Source" control={formMethods.control} options={options} placeholder="Select Source" />
								</div>
							</div>

							<div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Fugitive Emission Name" name="emissionName" placeholder="Emission Name" options={options} control={formMethods.control} />
								</div>
							</div>

							<div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Emission Gas" name="emissionGas" placeholder="Select Gas" options={options} control={formMethods.control} />
								</div>
							</div>

							<div className="mb-4">
								<div className="flex items-center gap-4 ">
									<AppSelect label="Unit of Emission" name="unit" options={options} placeholder="Select Unit" control={formMethods.control} />
								</div>
							</div>

							<div className="mb-4 gap-8">
								<div className="flex items-center gap-4 ">
									<AppInput label="Amount of Leakage Gas" name="gasEmitted" placeholder="0" type="number" control={formMethods.control} />
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
