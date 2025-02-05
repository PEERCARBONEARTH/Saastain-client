"use client";

import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { Home } from "lucide-react";
import { AiFillPieChart } from "react-icons/ai";

const AppLoanRepayments = () => {
	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<AiFillPieChart size={16} />}>Loan Repayments</BreadcrumbItem>
			</Breadcrumbs>
		</AuthRedirectComponent>
	);
};

export default AppLoanRepayments;
