"use client";
import { useState } from "react";
import { BreadcrumbItem, Breadcrumbs, Card, Spacer, Progress, Button, Checkbox } from "@nextui-org/react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import AppInput from "@/components/forms/AppInput";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";

const schema = z.object({});

const ApplyLoan = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const formMethods = useForm<z.infer<typeof schema>>({
		defaultValues: {},
	});

	const getTitleByStep = (step) => {
		switch (step) {
			case 1:
				return "Company Details";
			case 2:
				return "Company Operations";
			case 3:
				return "Financial Information";
			case 4:
				return "Confirm All Details";
			default:
				return "Step";
		}
	};

	const onSubmit = (data: z.infer<typeof schema>) => {
		console.log(data);
		if (currentStep < 4) {
			setCurrentStep(currentStep + 1);
		} else {
			// Handle final submission logic here
			console.log("Final Step", data);
		}
	};
	const progressValue = (currentStep / 4) * 100;

	const options = [
		{ value: "option1", label: " Meko Steam Clean Cooking-4 Heads" },
		{ value: "option1", label: " Meko Steam Clean Cooking-4 Heads" },
		{ value: "option1", label: " Meko Steam Clean Cooking-4 Heads" },
		{ value: "option1", label: " Meko Steam Clean Cooking-4 Heads" },
	];
	return (
		<AuthRedirectComponent>
			<div className="mt-10">
				<Breadcrumbs>
					<BreadcrumbItem>MarketPlace</BreadcrumbItem>
					<BreadcrumbItem>Eco Project</BreadcrumbItem>
				</Breadcrumbs>
				<div className="mt-6">
					<h1 className="text-2xl font-bold">PeerCarbon Green Financing Application</h1>
					<div className="mt-4">
						<p className="text-md">
							To ensure a seamless evaluation and optimize your chances of approval, please provide complete and accurate information in all fields. Rest assured, your application and data are handled with
							the strictest confidentiality in accordance with our privacy policy.
						</p>
						<p className="mt-3 text-md"> Completing all sections allows us to make a swift and well-informed decision on your request.</p>
					</div>
				</div>
				<Spacer y={6} />
				<Card className="bg-[#E4FCE6]">
					<div className="p-8">
						<Progress size="sm" aria-label="Progress..." value={progressValue} className="w-full" maxValue={100} showValueLabel={true} />
						<h1 className="mt-3 font-bold text-xl">Company Details</h1>

						<Spacer y={4} />
						<FormProvider {...formMethods}>
							<form onSubmit={formMethods.handleSubmit(onSubmit)}>
								{/* step 1 */}
								{currentStep === 1 && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Company Name" name="companyName" placeholder="Company Name" type="text" control={formMethods.control} />
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Company Website" name="companyWebsite" placeholder="Company Website" type="text" control={formMethods.control} />
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Name of Contact Person" name="firstName" placeholder="First Name" type="text" control={formMethods.control} />
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Last Name" name="lastName" placeholder="Last Name" type="text" control={formMethods.control} />
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Title of Contact Person" name="title" placeholder="CEO" type="text" control={formMethods.control} />
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Phone Number" name="phoneNo" placeholder="+254752442222" type="text" control={formMethods.control} />
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Contact Person Email" name="email" placeholder="joe@gmail.com" type="email" control={formMethods.control} />
											</div>
										</div>
									</div>
								)}
								{/* step 2 */}
								{currentStep === 2 && (
									<div className="">
										{/* Step  2 fields */}
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Where is the Company headquatered?" name="companyLocation" placeholder="Company Location" type="text" control={formMethods.control} />
											</div>
										</div>
										<Spacer y={8} />
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput
													label="How many full-time employees does the company have?"
													name="numberOfEmployees"
													placeholder="Number of Employees"
													type="number"
													control={formMethods.control}
												/>
											</div>
										</div>
										<Spacer y={8} />
										<div>
											<p className="mb-4 text-sm">Please all applicable countries of operation:</p>
											<div className="mb-4 flex gap-4">
												<Checkbox>Kenya</Checkbox>
												<Checkbox>Tanzania</Checkbox>
												<Checkbox>Uganda</Checkbox>
												<Checkbox>Other</Checkbox>
											</div>
										</div>
									</div>
								)}
								{currentStep === 3 && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Revenue for the last 4 quarters" name="revenue" placeholder="$ 0" type="number" control={formMethods.control} />
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Total Liabilities as reported in the most recent period" name="liabilities" placeholder="$ 0" type="Number" control={formMethods.control} />
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="Total Assets as reported in the most recent period" name="assets" placeholder="$ 0" type="Number" control={formMethods.control} />
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput
													label="How many years of Audited Financial Statements do you have available?"
													name="auditedfinancialstatementyears"
													placeholder="2"
													type="Number"
													control={formMethods.control}
												/>
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppInput label="How many years of Operating Track Record do you have?" name="" placeholder="2" type="Number" control={formMethods.control} />
											</div>
										</div>
										<div className="mb-4">
											<div className="flex items-center gap-4 ">
												<AppSelect
													label="Which of our product would you like to have financed?"
													name="product"
													placeholder="Meko Steam Clean Cooking-4 Heads"
													options={options}
													control={formMethods.control}
												/>
											</div>
										</div>
										<div>
											<p className="mb-4 text-sm">Please all applicable:</p>
											<div className="mb-4">
												<Checkbox>Do you have an Integrated 3-Statement Working Financial Model ? </Checkbox>
											</div>
											<div className="mb-4">
												<Checkbox>Have established an audited emission baseline of your organization?</Checkbox>
											</div>
										</div>
									</div>
								)}
							</form>
						</FormProvider>
						<div className="mb-4 gap-8 pr-10">
							<div className="card-actions  flex flex-col md:flex-row w-full justify-between md:justify-end gap-8">
								{currentStep > 1 && (
									<Button color="primary" onClick={() => setCurrentStep(currentStep - 1)} startContent={<ChevronLeft size={15} />}>
										Previous
									</Button>
								)}
								<Button color="primary" onClick={() => setCurrentStep(currentStep + 1)} endContent={<ChevronRight size={15} />}>
									{currentStep < 3 ? "Next" : "Confirm"}
								</Button>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</AuthRedirectComponent>
	);
};

export default ApplyLoan;
