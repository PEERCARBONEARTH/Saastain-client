"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { Home } from "lucide-react";
import { HiUserGroup } from "react-icons/hi";

const AppLendersOverview = () => {
	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<HiUserGroup size={16} />}>Lenders</BreadcrumbItem>
			</Breadcrumbs>
		</AuthRedirectComponent>
	);
};

export default AppLendersOverview;
