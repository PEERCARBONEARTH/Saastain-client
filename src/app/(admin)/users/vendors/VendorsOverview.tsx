"use client";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { BreadcrumbItem, Breadcrumbs, Tabs, Tab, Card, CardBody, Spacer } from "@nextui-org/react";
import { HomeIcon, UsersIcon } from "lucide-react";
import VendorListTab from "./VendorListTab";
import VendorsInterestsTab from "./VendorsInterestsTab";

const VendorsOverview = () => {
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<HomeIcon size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<UsersIcon size={16} />}>Vendors</BreadcrumbItem>
			</Breadcrumbs>
			<Spacer y={6} />
			<Tabs aria-label="vendor-options" color="primary">
				<Tab key="vendors-list" title="Vendors">
					<VendorListTab />
				</Tab>
				<Tab key="vendor-interest" title="Interests">
					<VendorsInterestsTab />
				</Tab>
			</Tabs>
		</>
	);
};

export default VendorsOverview;
