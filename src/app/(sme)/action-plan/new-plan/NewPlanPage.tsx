"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Input } from "@heroui/react";
import { SearchIcon } from "lucide-react";
import { HiPlusCircle } from "react-icons/hi";
import { TbRefresh } from "react-icons/tb";

const NewPlan = () => {
	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem>Net Zero</BreadcrumbItem>
				<BreadcrumbItem>New Plan</BreadcrumbItem>
			</Breadcrumbs>
			<div className="flex items-start md:items-center justify-between my-5">
				<h1 className="text-2xl font-bold">Select a Mitigation Option</h1>
				<Input
					classNames={{
						base: "max-w-full sm:max-w-[20rem] h-10",
						mainWrapper: "h-full",
						input: "text-small",
						inputWrapper: "h-full font-normal text-default-600 rounded-2xl",
					}}
					placeholder="Search Mitigation Options ..."
					size="sm"
					startContent={<SearchIcon size={18} />}
					type="search"
					variant="bordered"
				/>
			</div>
			<div className="my-5 md:w-[90%]">
				<p className="text-[#374151] font-normal text-sm">
					In this section, you're in control of selecting mitigation options that align with your sustainability goals. Backed by real data, our platform provides insights into effective measures to reduce your
					emissions. From adopting energy-efficient practices to sustainable transportation choices, you can tailor your approach to make a tangible impact on the environment
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
				<div className="relative w-full">
					<div className="bg-[#5E896E] absolute h-5 rounded-3xl px-1 w-full" />
					<Card className="py-5 px-4  top-1 right-0 w-full rounded-lg bg-[#F3FAF7]">
						<CardHeader className="text-[#5E896E] font-bold">Optimize boiler Operating conditions</CardHeader>
						<CardBody>
							<p className="text-sm text-gray-700">
								By fine-tuning your boiler operations, you can enhance energy efficiency, reduce fuel consumption, and minimize carbon emissions, resulting in a more sustainable approach.
							</p>
						</CardBody>
						<CardFooter className="items-center justify-between">
							<Button color="primary" endContent={<TbRefresh className="w-5 h-5" />}>
								Simulate
							</Button>
							<Button color="primary" endContent={<HiPlusCircle className="h-5 w-5" />}>
								Set Plan
							</Button>
						</CardFooter>
					</Card>
				</div>
				<div className="relative w-full">
					<div className="bg-[#5E896E] absolute h-5 rounded-3xl px-1 w-full" />
					<Card className="py-5 px-4  top-1 right-0 w-full rounded-lg bg-[#F3FAF7]">
						<CardHeader className="text-[#5E896E] font-bold">Electrification of the internal fleet</CardHeader>
						<CardBody>
							<p className="text-sm text-gray-700">
								By fine-tuning your boiler operations, you can enhance energy efficiency, reduce fuel consumption, and minimize carbon emissions, resulting in a more sustainable approach.
							</p>
						</CardBody>
						<CardFooter className="items-center justify-between">
							<Button color="primary" endContent={<TbRefresh className="w-5 h-5" />}>
								Simulate
							</Button>
							<Button color="primary" endContent={<HiPlusCircle className="h-5 w-5" />}>
								Set Plan
							</Button>
						</CardFooter>
					</Card>
				</div>
				<div className="relative w-full">
					<div className="bg-[#5E896E] absolute h-5 rounded-3xl px-1 w-full" />
					<Card className="py-5 px-4  top-1 right-0 w-full rounded-lg bg-[#F3FAF7]">
						<CardHeader className="text-[#5E896E] font-bold">Optimize boiler Operating conditions</CardHeader>
						<CardBody>
							<p className="text-sm text-gray-700">
								By fine-tuning your boiler operations, you can enhance energy efficiency, reduce fuel consumption, and minimize carbon emissions, resulting in a more sustainable approach.
							</p>
						</CardBody>
						<CardFooter className="items-center justify-between">
							<Button color="primary" endContent={<TbRefresh className="w-5 h-5" />}>
								Simulate
							</Button>
							<Button color="primary" endContent={<HiPlusCircle className="h-5 w-5" />}>
								Set Plan
							</Button>
						</CardFooter>
					</Card>
				</div>
				<div className="relative w-full">
					<div className="bg-[#5E896E] absolute h-5 rounded-3xl px-1 w-full" />
					<Card className="py-5 px-4  top-1 right-0 w-full rounded-lg bg-[#F3FAF7]">
						<CardHeader className="text-[#5E896E] font-bold">Reduction of business trips by plane</CardHeader>
						<CardBody>
							<p className="text-sm text-gray-700">
								By fine-tuning your boiler operations, you can enhance energy efficiency, reduce fuel consumption, and minimize carbon emissions, resulting in a more sustainable approach.
							</p>
						</CardBody>
						<CardFooter className="items-center justify-between">
							<Button color="primary" endContent={<TbRefresh className="w-5 h-5" />}>
								Simulate
							</Button>
							<Button color="primary" endContent={<HiPlusCircle className="h-5 w-5" />}>
								Set Plan
							</Button>
						</CardFooter>
					</Card>
				</div>
				<div className="relative w-full">
					<div className="bg-[#5E896E] absolute h-5 rounded-3xl px-1 w-full" />
					<Card className="py-5 px-4  top-1 right-0 w-full rounded-lg bg-[#F3FAF7]">
						<CardHeader className="text-[#5E896E] font-bold">Increase the recovery of building waste</CardHeader>
						<CardBody>
							<p className="text-sm text-gray-700">
								By fine-tuning your boiler operations, you can enhance energy efficiency, reduce fuel consumption, and minimize carbon emissions, resulting in a more sustainable approach.
							</p>
						</CardBody>
						<CardFooter className="items-center justify-between">
							<Button color="primary" endContent={<TbRefresh className="w-5 h-5" />}>
								Simulate
							</Button>
							<Button color="primary" endContent={<HiPlusCircle className="h-5 w-5" />}>
								Set Plan
							</Button>
						</CardFooter>
					</Card>
				</div>
				<div className="relative w-full">
					<div className="bg-[#5E896E] absolute h-5 rounded-3xl px-1 w-full" />
					<Card className="py-5 px-4  top-1 right-0 w-full rounded-lg bg-[#F3FAF7]">
						<CardHeader className="text-[#5E896E] font-bold">Reduction of production losses</CardHeader>
						<CardBody>
							<p className="text-sm text-gray-700">
								By fine-tuning your boiler operations, you can enhance energy efficiency, reduce fuel consumption, and minimize carbon emissions, resulting in a more sustainable approach.
							</p>
						</CardBody>
						<CardFooter className="items-center justify-between">
							<Button color="primary" endContent={<TbRefresh className="w-5 h-5" />}>
								Simulate
							</Button>
							<Button color="primary" endContent={<HiPlusCircle className="h-5 w-5" />}>
								Set Plan
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</AuthRedirectComponent>
	);
};


export default NewPlan;
