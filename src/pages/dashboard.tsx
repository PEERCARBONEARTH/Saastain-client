import CompanySummary from "@/components/cards/company-summary";
import SelectBranch from "@/components/select-branch-dashboard";
import SelectYear from "@/components/select-year-dashboard";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import {BreadcrumbItem, Breadcrumbs, Button} from "@nextui-org/react";
import Image from "next/image";
import { FaRegFileLines } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import Footer from "./footer";

const AppDashboard: NextPageWithLayout = () => {
	return <div>
		<Breadcrumbs>
			<BreadcrumbItem>Overview</BreadcrumbItem>
			<BreadcrumbItem>Dashboard</BreadcrumbItem>
		</Breadcrumbs>

		<div className="flex p-12">
			<SelectBranch/>
			<SelectYear/>		
		</div>

		<div className="flex justify-between p-12">
			<div>
				<h3 className="text-4xl">Carbon Footprints record in <span className="text-primary-600">FY2023</span> for <span className="text-primary-600">All Branches</span></h3>
			</div>
			<div className="flex space-x-2">
				<Button color="primary" startContent={<MdAdd className="w-4 h-4" />} size="sm">
				Add 
				</Button>
				<Button color="primary" startContent={<FaRegFileLines className="w-4 h-4" />} size="sm">
				Export 
				</Button>
			</div>
			</div>


		<CompanySummary/>
		<Footer/>

	</div>;
};

AppDashboard.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default AppDashboard;
