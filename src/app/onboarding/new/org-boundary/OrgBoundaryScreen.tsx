"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Progress, Radio, RadioGroup, Spacer } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HiQuestionMarkCircle } from "react-icons/hi";

const OrgBoundaryScreen = () => {
	return (
		<div className="grid grid-cols-4">
			<div className="col-span-3">
				<div className="w-full h-screen">
					<div className="flex flex-col items-center justify-center h-full px-28">
						<Progress value={100} color="danger" className="w-full" />
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
									<h1 className="text-xl font-bold">Define Organizational Boundaries.</h1>
									<Spacer y={7} />
									<RadioGroup label="Establish your organizational boundaries to define which emissions sources will be included in your accounting." color="primary">
										<Radio value="operation-control" description="Select operational control to include emissions from facilities you manage directly.">
											We use Operational Control to track
										</Radio>
										<Radio value="financial-control" description="Select operational control to include emissions from facilities you manage directly.">
											We use Financial Control to track
										</Radio>
										<Radio value="geo-control" description="List all locations or branches included in emissions tracking.">
											We use Geographical Scope to track
										</Radio>
									</RadioGroup>
								</CardBody>
								<Divider />
								<CardFooter className="justify-between">
                                    <Button endContent={<ChevronRight className="w-5 h-5" />} variant="bordered">Learn More</Button>
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

export default OrgBoundaryScreen;
