"use client";

import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/utils";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Progress, Spacer } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HiQuestionMarkCircle } from "react-icons/hi";

const branchLevels = ["Main", "Subsidiary", "Franchise", "Satellite"];

const NewBranchScreen = () => {
	return (
		<div className="grid grid-cols-4">
			<div className="col-span-3">
				<div className="w-full h-screen">
					<div className="flex flex-col items-center justify-center h-full px-28">
						<Progress value={100} color="primary" className="w-full" />
						<div className="mt-5 w-full">
							<Card className="w-full px-5">
								<CardHeader className="justify-between">
									<Button variant="light" color="primary" startContent={<ChevronLeft className="w-5 h-5" />}>
										Back
									</Button>
									<div className="flex items-center">
										<Button variant="light" color="primary">
											Skip
										</Button>
										<Button variant="light" color="default" isIconOnly>
											<HiQuestionMarkCircle className="w-5 h-5" />
										</Button>
									</div>
								</CardHeader>
								<Divider />
								<CardBody>
									<h1 className="text-xl font-bold">Create a new branch</h1>
									<Spacer y={7} />
									<AppSelect label="Branch Type" options={generateOptions(branchLevels)} />
									<Spacer y={4} />
									<AppInput label={"Location"} placeholder="e.g. Drive In" />
								</CardBody>
								<Divider />
								<CardFooter className="justify-between">
									<Button endContent={<ChevronRight className="w-5 h-5" />} variant="bordered">
										Save & Add New
									</Button>
									<Button className="bg-primary-800 text-white" endContent={<ChevronRight className="w-5 h-5" />}>
										Next
									</Button>
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

export default NewBranchScreen;
