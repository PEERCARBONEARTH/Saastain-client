import AppLayout from "@/layouts/AppLayout";
import { z } from "zod";
import { NextPageWithLayout } from "@/types/Layout";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Spacer, Button, Breadcrumbs, BreadcrumbItem, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Check, XIcon } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";

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
		<Card className="p-6 bg-[#E4FCE6]">
			<CardHeader>
				<Breadcrumbs>
					<BreadcrumbItem>Accounting</BreadcrumbItem>
					<BreadcrumbItem>Add Data</BreadcrumbItem>
				</Breadcrumbs>
			</CardHeader>
			<FormProvider {...formMethods}>
				<form onSubmit={formMethods.handleSubmit(onSubmit)}>
					<CardBody>
						<div className="space-y-3">
							<h1 className="text-xl font-bold">Fugitive Emission</h1>
							<p className="text-gray-600 text-sm">
								Here you can input data regarding fuel consumption from vehicles under your ownership / control. Whether it's <br /> cars, trucks or airplanes.
							</p>
						</div>
						<div className="my-5">
							<AppInput label="Select Accounting Period" name="date" type="date" control={formMethods.control} className="w-full" />
							<Spacer y={6} />
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<AppSelect name="emissionSource" label="Emission Source" control={formMethods.control} options={options} placeholder="Select Source" />
								<AppSelect label="Fugitive Emission Name" name="emissionName" placeholder="Emission Name" options={options} control={formMethods.control} />
								<AppSelect label="Emission Gas" name="emissionGas" placeholder="Select Gas" options={options} control={formMethods.control} />
								<AppSelect label="Unit of Emission" name="unit" options={options} placeholder="Select Unit" control={formMethods.control} />
								<AppInput label="Amount of Leakage Gas" name="gasEmitted" placeholder="0" type="number" control={formMethods.control} />
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
