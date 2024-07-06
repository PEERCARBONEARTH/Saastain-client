"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Home } from "lucide-react";
import { HiBriefcase } from "react-icons/hi";

const AppSubscriptions = () => {
	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<HiBriefcase size={16} />}>Subscriptions</BreadcrumbItem>
			</Breadcrumbs>
		</AuthRedirectComponent>
	);
};

export default AppSubscriptions;
