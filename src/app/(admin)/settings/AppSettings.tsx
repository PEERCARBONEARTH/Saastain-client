"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Breadcrumbs, BreadcrumbItem, Tabs, Tab } from "@heroui/react";
import { Cog, Home } from "lucide-react";
import GreenCategoryTab from "./GreenCategoryTab";
import SDGsTab from "./SDGsTab";
import EmailTemplatesTab from "./EmailTemplatesTab";
import { useMediaQuery } from "react-responsive";
import VehicleEmissionsConfig from "./VehicleEmissionsConfig";

const AppSettings = () => {
	const isMobile = useMediaQuery({ maxWidth: "768px" });

	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<Cog size={16} />}>Settings</BreadcrumbItem>
			</Breadcrumbs>
			<div className="my-5">
				<div className="py-4 border-b-1.5 border-gray-500">
					<h1 className="text-2xl font-semibold text-green-800">Settings</h1>
				</div>
				<div className="mt-5">
					<Tabs isVertical={!isMobile} aria-label="Settings Opts" color="primary" fullWidth={isMobile}>
						<Tab key={"my-profile"} title={"My Profile"}>
							<div className="pl-5 border-l-1.5 h-full border-[#A7B3A7]"></div>
						</Tab>
						<Tab key={"green-categories"} title={"Green Categories"}>
							<div className="pl-5 border-l-1.5 h-full border-[#A7B3A7]">
								<GreenCategoryTab />
							</div>
						</Tab>
						<Tab key={"sdgs"} title={"SDGs"}>
							<div className="pl-5 border-l-1.5 h-full border-[#A7B3A7]">
								<SDGsTab />
							</div>
						</Tab>
						<Tab key={"loan-reviewers"} title={"Loan Reviewers"}>
							<div className="pl-5 border-l-1.5 h-full border-[#A7B3A7]"></div>
						</Tab>
						<Tab key={"document-templates"} title={"Document Templates"}>
							<div className="pl-5 border-l-1.5 h-full border-[#A7B3A7]"></div>
						</Tab>
						<Tab key={"email-templates"} title={"Email Templates"}>
							<div className="pl-5 border-l-1.5 h-full border-[#A7B3A7]">
								<EmailTemplatesTab />
							</div>
						</Tab>
						<Tab key={"vehicle-emissions"} title={"Vehicle Emissions Config"}>
							<div className="pl-5 border-l-1.5 h-full border-[#A7B3A7]">
								<VehicleEmissionsConfig />
							</div>
						</Tab>
					</Tabs>
				</div>
			</div>
		</AuthRedirectComponent>
	);
};

export default AppSettings;
