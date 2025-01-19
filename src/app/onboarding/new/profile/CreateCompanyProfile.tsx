"use client";

import AppInput from "@/components/forms/AppInput";
import AppTextArea from "@/components/forms/AppTextArea";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Progress, Spacer } from "@heroui/react";
import { ChevronLeft, ChevronRight, PencilLine } from "lucide-react";

const CreateCompanyProfile = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-6">
			<div className="col-auto md:col-span-4">
				<div className="w-full h-screen">
					<div className="flex flex-col items-center justify-center h-full px-2 md:px-28">
						<Progress value={100} color="default" className="w-full" />
						<div className="mt-5 w-full">
							<Card className="w-full md:px-5">
								<CardHeader>
									<Button variant="light" color="primary" startContent={<ChevronLeft className="w-5 h-5" />}>
										Back
									</Button>
								</CardHeader>
								<Divider />
								<CardBody>
									<h1 className="text-xl font-bold">Tell Us More About Your Company</h1>
									<Spacer y={7} />
									<AppInput label={"Your Company Name"} placeholder="Name" labelPlacement="inside" />
									<Spacer y={5} />
									<AppInput label={"Location"} placeholder="Your company location" labelPlacement="inside" />
									<Spacer y={5} />
									<AppInput label={"Official Phone Number "} placeholder="+254712345678" labelPlacement="inside" />
									<Spacer y={5} />
									<AppInput label={"Official Company Email Address"} placeholder="info@company.com" helperText="We'll never share your details. See our Privacy Policy." labelPlacement="inside" />
									<Spacer y={5} />
									<AppTextArea
										label="Brief description of your company"
										placeholder="In 10 words describe your company"
										labelPlacement="inside"
										startContent={<PencilLine size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
									/>
								</CardBody>
								<Divider />
								<CardFooter className="justify-end">
									<Button className="bg-primary-800 text-white" endContent={<ChevronRight className="w-5 h-5" />}>
										Next
									</Button>
								</CardFooter>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<div className="hidden md:block md:col-span-2">
				<div className="bg-create-company h-screen"></div>
			</div>
		</div>
	);
};

export default CreateCompanyProfile;
