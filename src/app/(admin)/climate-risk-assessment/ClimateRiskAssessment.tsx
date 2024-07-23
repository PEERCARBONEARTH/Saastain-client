"use client";

import Stepper, { StepItem } from "@/components/stepper";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { BreadcrumbItem, Breadcrumbs, Button, Card, Chip, Skeleton, Spacer } from "@nextui-org/react";
import { LuClipboardEdit } from "react-icons/lu";
import { FcProcess } from "react-icons/fc";
import { BsClipboard2Data } from "react-icons/bs";
import useSteps from "@/hooks/useSteps";
import AppInput from "@/components/forms/AppInput";
import AppDatePicker from "@/components/buttons/datepicker";
import AppSelect from "@/components/forms/AppSelect";
import { countiesData, generateOptions } from "@/utils";
import { date, InferType, object, string } from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { IClimateRiskData } from "@/types/ClimateRisk";
import { useState } from "react";
import toast from "react-hot-toast";

const steps = [
	{ title: "Add Data", description: "Input the necessary data for assessment", stepIcon: <LuClipboardEdit className="w-4 h-4" /> },
	{ title: "Loading", description: "Processing the data", stepIcon: <FcProcess className="w-4 h-4" /> },
	{ title: "Results", description: "Displaying the results", stepIcon: <BsClipboard2Data className="w-4 h-4" /> },
] satisfies StepItem[];

const baseURL = "https://ygows8k.trial-saastain.vingitonga.xyz";

const formSchema = object({
	address: string().required("Please enter the address."),
	date: date().required("Please pick a date for assessment"),
	county: string().required("Please choose a county"),
});

type ErrorResp = {
	Error: string;
};

type RespType = IClimateRiskData | ErrorResp;

const ClimateRiskAssessment = () => {
	const { activeStep, goToNextStep, setActiveStep } = useSteps({
		initialStep: 0,
		count: steps.length,
	});

	const formMethods = useForm({
		resolver: yupResolver(formSchema),
		defaultValues: {
			address: "",
			date: new Date(),
			county: "",
		},
	});
	const [loadedData, setLoadedData] = useState<IClimateRiskData>();

	const {
		handleSubmit,
		formState: { errors: formErrors },
		control,
		reset,
	} = formMethods;

	const onSubmit = async (data: InferType<typeof formSchema>) => {
		const info = {
			...data,
			date: data.date.toISOString().split("T")[0],
		};
		try {
			goToNextStep();
			const resp = await axios.post<RespType>(`/api/ai`, info);
			const rawData = resp.data;

			console.log("rawData", rawData);

			if ((rawData as any)?.Map_SME) {
				reset();
				let data = rawData as any;
				data = {
					...data,
					Map_SME: String(data.Map_SME).replace("http://0.0.0.0:8080", baseURL),
				};
				setLoadedData(data as any);
			}

			goToNextStep();
		} catch (err) {
			toast.error("Unable to fetch");
		}
	};

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem>Climate Risk Assessment</BreadcrumbItem>
			</Breadcrumbs>
			<div className="grid grid-cols-12 mt-10">
				<div className="col-span-3">
					<Stepper steps={steps} index={activeStep} orientation="vertical" containerHeight="200px" showVerticalDesc={false} />
				</div>
				<div className="col-span-9 border-l-1 pl-5">
					{activeStep === 0 && (
						<FormProvider {...formMethods}>
							<div className="space-y-2 mb-4">
								<h1 className="text-lg font-bold">{steps[activeStep].title}</h1>
								<p className="text-sm">{steps[activeStep].description}</p>
							</div>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Spacer y={6} />
								<AppInput label={"Location / Address"} name="address" control={control} error={formErrors?.address} placeholder="e.g. Jamhuri Primary School" />
								<Spacer y={6} />
								<div className="space-y-2">
									<p className="text-sm mb-2">Date</p>
									<AppDatePicker name="date" control={control} className="w-full" />
									{formErrors?.date && <p className="text-xs text-danger">{formErrors?.date?.message}</p>}
								</div>
								<Spacer y={6} />
								<AppSelect label="County" placeholder="Select a county" options={generateOptions(countiesData)} name="county" control={control} error={formErrors?.county} />
								<Spacer y={6} />
								<div className="flex items-center justify-end">
									<Button type="submit" color="primary">
										Continue
									</Button>
								</div>
							</form>
						</FormProvider>
					)}
					{activeStep === 1 && <LoadingSkeleton />}
					{activeStep === 2 && (
						<>
							<div className="grid grid-cols-2 gap-10">
								<div className="">
									<Card className="w-full" radius="lg">
										<iframe width={"100%"} height={"400"} src={loadedData?.Map_SME} frameBorder="0"></iframe>
									</Card>
								</div>
								<div className="space-y-10">
									<div className="flex flex-col gap-5 pb-2 border-b">
										<h3 className="font-semibold text-xl">Climate Risk Category</h3>
										<Chip color="primary">
											<p className="text-lg">{loadedData?.["Climate Risk Category"]}</p>
										</Chip>
									</div>
									<div className="flex flex-col gap-5 pb-2 border-b">
										<h3 className="font-semibold text-xl">Climate Risk Score (Based on CO2 emissions)</h3>
										<p className="text-lg">{loadedData?.["Climate Risk Score (Based on CO2 emissions)"]}</p>
									</div>
									<Button
										onPress={() => {
											setActiveStep(0);
										}}
										color="primary">
										Assess Another One
									</Button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};

const LoadingSkeleton = () => {
	return (
		<Card className="w-full space-y-5 p-4" radius="lg">
			<Skeleton className="rounded-lg">
				<div className="h-24 rounded-lg bg-default-300"></div>
			</Skeleton>
			<div className="space-y-3">
				<Skeleton className="w-3/5 rounded-lg">
					<div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
				</Skeleton>
				<Skeleton className="w-4/5 rounded-lg">
					<div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
				</Skeleton>
				<Skeleton className="w-2/5 rounded-lg">
					<div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
				</Skeleton>
			</div>
			<Skeleton className="rounded-lg">
				<div className="h-24 rounded-lg bg-default-300"></div>
			</Skeleton>
			<div className="space-y-3">
				<Skeleton className="w-2/5 rounded-lg">
					<div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
				</Skeleton>
				<Skeleton className="w-4/5 rounded-lg">
					<div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
				</Skeleton>
				<Skeleton className="w-2/5 rounded-lg">
					<div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
				</Skeleton>
			</div>
		</Card>
	);
};

export default ClimateRiskAssessment;
