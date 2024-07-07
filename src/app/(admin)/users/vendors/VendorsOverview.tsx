"use client";

import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { HomeIcon, UsersIcon } from "lucide-react";

const VendorsOverview = () => {
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<HomeIcon size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<UsersIcon size={16} />}>
					Vendors
				</BreadcrumbItem>
			</Breadcrumbs>
		</>
	);
};

export default VendorsOverview;
