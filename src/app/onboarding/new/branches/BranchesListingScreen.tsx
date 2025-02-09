"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, Chip, cn, Divider, Progress, Spacer } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HiLocationMarker, HiPencilAlt, HiQuestionMarkCircle, HiTrash } from "react-icons/hi";

interface BranchItemSectionProps {
	theme: "primary" | "secondary" | "warning" | "danger" | "success";
}

const themes = ["primary", "secondary", "warning", "danger", "success"];

const getThemeByIndex = (index: number) => {
	return themes[index % themes.length] as "primary" | "secondary" | "warning" | "danger" | "success";
};

const getTextColor = (theme: "primary" | "secondary" | "warning" | "danger" | "success") => {
	switch (theme) {
		case "primary":
			return "text-primary-500";
		case "secondary":
			return "text-secondary-500";
		case "warning":
			return "text-warning-500";
		case "danger":
			return "text-danger-500";
		case "success":
			return "text-success-500";
		default:
			return "text-black";
	}
};

const BranchesListingScreen = () => {
	return (
		<div className="grid grid-cols-4">
			<div className="col-span-3">
				<div className="w-full flex-1">
					<div className="flex flex-col flex-1 items-center justify-center h-screen px-28 overflow-y-auto py-10">
						<Progress value={100} color="primary" className="w-full" />
						<div className="mt-5 w-full">
							<Card className="w-full px-5 py-3 max-h-[80vh] h-full overflow-y-scroll">
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
									<h1 className="text-xl font-bold">Your Company Branches</h1>
									<Spacer y={7} />
									<div className="space-y-5">
										{Array.from({ length: 4 }).map((_, index) => (
											<BranchItemSection key={index} theme={getThemeByIndex(index)} />
										))}
									</div>
								</CardBody>
								<Divider />
									<Spacer y={3} />
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

const BranchItemSection = ({ theme }: BranchItemSectionProps) => {
	return (
		<div className="px-4 py-5 border-1 border-gray-300 rounded-xl">
			<div className="flex items-center justify-between">
				<Chip color={theme} variant="flat">
					Main Branch
				</Chip>
				<div className="flex items-center gap-2">
					<Button isIconOnly variant="light" color={theme}>
						<HiPencilAlt className="w-5 h-5" />
					</Button>
					<Button isIconOnly variant="light" color={theme}>
						<HiTrash className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<div className="mt-2 space-y-3">
				<h1 className={cn(getTextColor(theme), "font-bold text-lg")}>News Cafe Sarit Center</h1>
				<p className={cn(getTextColor(theme))}>275 , Sarit Center Third Floor , Room 245</p>
				<Button startContent={<HiLocationMarker className="w-5 h-5" />} color={theme} variant="bordered">
					View Location
				</Button>
			</div>
		</div>
	);
};

export default BranchesListingScreen;
