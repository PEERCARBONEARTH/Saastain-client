"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { BellIcon, Home } from "lucide-react";

const AppNotifications = () => {
	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<BellIcon size={16} />}>Notifications</BreadcrumbItem>
			</Breadcrumbs>
		</AuthRedirectComponent>
	);
};

export default AppNotifications;
