"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { Home, LayoutDashboard } from "lucide-react";

const Dashboard = () => {
	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<LayoutDashboard size={16} />}>Dashboard</BreadcrumbItem>
			</Breadcrumbs>
		</AuthRedirectComponent>
	);
};

export default Dashboard;
