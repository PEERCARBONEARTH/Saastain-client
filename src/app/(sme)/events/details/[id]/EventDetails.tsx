"use client";

import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, Chip, Tab, Tabs } from "@heroui/react";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { HiPencil } from "react-icons/hi2";

interface IProps {
	id: string;
}

const EventDetails = ({ id }: IProps) => {
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Neutral Events</BreadcrumbItem>
				<BreadcrumbItem>Event Details</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-5">
				<Tabs aria-label="Options" color="success" classNames={{ cursor: "bg-[#E4FCE6] text-[#6B7280]", tab: "h-12" }} fullWidth>
					<Tab key={"overview"} title={"Overview"}>
						<div className="mt-4">
							<div className="grid grid-cols-1 md:grid-cols-8 gap-5">
								<div className="col-auto md:col-span-6">
									<div className="space-y-3">
										<h1 className="text-gray-700 text-xl font-bold">Green Future Summit</h1>
										<p className="text-gray-700 text-sm font-medium">View key details, monitor sustainability progress, and ensure each event aligns with your carbon-neutral goals.</p>
										<div className="flex items-center gap-2">
											<Chip classNames={{ base: "bg-[#E1EFFE] text-[#1E429F]" }}>Pre Event</Chip>
											<Chip classNames={{ base: "bg-yellow-100 text-yellow-800" }}>May 25th, 2025</Chip>
											<Chip classNames={{ base: "bg-green-100 text-green-800" }}>Industry</Chip>
										</div>
									</div>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-8">
										<Card className="bg-[#F3F4F6]" classNames={{ base: "px-5 py-3" }}>
											<CardBody>
												<h1 className="text-[#4B5563] font-medium text-xs">Signed Pledge</h1>
												<div className="flex items-center gap-2 mt-3">
													<p className="text-sm font-semibold text-[#4B5563]">Green Finance ...</p>
													<ExternalLinkIcon />
												</div>
											</CardBody>
										</Card>
										<Card className="bg-[#F3F4F6]" classNames={{ base: "px-5 py-3" }}>
											<CardBody>
												<h1 className="text-[#4B5563] font-medium text-xs">Attendees</h1>
												<p className="text-sm font-semibold text-[#4B5563] mt-3">200</p>
											</CardBody>
										</Card>
										<Card className="bg-[#F3F4F6]" classNames={{ base: "px-5 py-3" }}>
											<CardBody>
												<h1 className="text-[#4B5563] font-medium text-xs">Location</h1>
												<p className="text-sm font-semibold text-[#4B5563] mt-3">Tamarin Hotel</p>
											</CardBody>
										</Card>
									</div>
									<div className="mt-8">
										<div className="flex items-center justify-between">
											<h1 className="font-bold text-gray-700">Location</h1>
											<Button color="primary" variant="light" isIconOnly>
												<HiPencil className="w-5 h-5" />
											</Button>
										</div>
										<div className="mt-4 w-full h-[400px] relative overflow-hidden rounded-lg border-2 border-[#EED2AD]">
											<iframe
												className="absolute top-0 left-0 w-full h-full border-0"
												loading="lazy"
												src="https://www.google.com/maps/embed/v1/place?q=thome&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
												allowFullScreen
											/>
										</div>
									</div>
									<div className="mt-8">
										<div className="flex items-center justify-between">
											<h1 className="font-bold text-gray-700">Collaborators</h1>
											<Button color="primary" variant="light" isIconOnly>
												<HiPencil className="w-5 h-5" />
											</Button>
										</div>
										<div className="mt-4 flex items-center flex-wrap gap-5">
											{[...Array.from({ length: 5 })].map((_, idx) => (
												<div key={idx} className="w-32 h-32 bg-gray-300 flex items-center justify-center rounded-lg">
													<Image src={"https://saastian.ams3.digitaloceanspaces.com/dtb-logo.png"} width={200} height={200} alt="Image1" />
												</div>
											))}
										</div>
									</div>
									<div className="mt-8">
										<div className="flex items-center justify-between">
											<h1 className="font-bold text-gray-700">Emission Reduction</h1>
											<Button color="primary" endContent={<HiPencil className="w-5 h-5" />}>
												View Report
											</Button>
										</div>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-4">
											<div className="bg-[#EED2AD] px-5 py-5 shadow-md rounded-lg">
												<h1 className="text-[#4B5563] font-medium text-sm">Attendees</h1>
												<p className="text-lg font-semibold text-[#4B5563] mt-3">20b</p>
											</div>
											<div className="bg-[#E4FCE6] px-5 py-5 shadow-md rounded-lg">
												<h1 className="text-[#4B5563] font-medium text-sm">Attendees</h1>
												<p className="text-lg font-semibold text-[#4B5563] mt-3">70b</p>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto md:col-span-2"></div>
							</div>
						</div>
					</Tab>
					<Tab key={"measure"} title={"Measure"}></Tab>
					<Tab key={"mitigate"} title={"Mitigate"}></Tab>
					<Tab key={"report"} title={"Report"}></Tab>
				</Tabs>
			</div>
		</>
	);
};

export default EventDetails;
