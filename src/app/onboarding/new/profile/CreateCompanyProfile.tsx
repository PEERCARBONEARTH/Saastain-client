"use client";

import AppInput from "@/components/forms/AppInput";
import AppTextArea from "@/components/forms/AppTextArea";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Progress, Spacer } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CreateCompanyProfile = () => {
	return (
		<div className="grid grid-cols-4">
			<div className="col-span-3">
				<div className="w-full h-screen">
					<div className="flex flex-col items-center justify-center h-full px-28">
						<Progress value={100} color="default" className="w-full" />
						<div className="mt-5 w-full">
							<Card className="w-full px-5">
								<CardHeader>
									<Button variant="light" color="primary" startContent={<ChevronLeft className="w-5 h-5" />}>Back</Button>
								</CardHeader>
								<Divider />
								<CardBody>
									<h1 className="text-xl font-bold">Tell Us More About Your Company</h1>
                                    <Spacer y={7} />
                                    <AppInput label={"Your Company Name"} placeholder="Name" />
                                    <Spacer y={5} />
                                    <AppInput label={"Location"} placeholder="Your company location" />
                                    <Spacer y={5} />
                                    <AppInput label={"Official Phone Number "} placeholder="+254712345678" />
                                    <Spacer y={5} />
                                    <AppInput label={"Official Company Email Address"} placeholder="info@company.com" helperText="We'll never share your details. See our Privacy Policy." />
                                    <Spacer y={5} />
                                    <AppTextArea label="Brief description of your company" placeholder="In 10 words describe your  company" />
								</CardBody>
								<Divider />
                                <CardFooter className="justify-end">
                                    <Button className="bg-primary-800 text-white" endContent={<ChevronRight className="w-5 h-5" />}>Next</Button>
                                </CardFooter>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<div className="col-span-1">
				<div className="bg-create-company h-screen"></div>
			</div>
		</div>
	);
};

export default CreateCompanyProfile;
