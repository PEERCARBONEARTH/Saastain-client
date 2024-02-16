import DashboardBreadCrumb from "@/components/breadcrumbs";
import BreadCrumb from "@/components/breadcrumbs";
import CompanySummary from "@/components/cards/company-summary";
import SelectBranch from "@/components/select-branch-dashboard";
import SelectYear from "@/components/select-year-dashboard";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import {Button} from "@nextui-org/react";
import Image from "next/image";

const AppDashboard: NextPageWithLayout = () => {
	return <div>
		<DashboardBreadCrumb />
		<div className="flex p-12">
			<SelectBranch/>
			<SelectYear/>		
		</div>
		<div className="flex p-12">
			<h3>Carbon Footprints record in FY2023 for All Branches</h3>
			<div className="pl-12">
			<Button className="mr-4">
					<Image
						src="/images/plus.png"
						width={20}
						height={20}
						alt="Picture of the author"
					/>
					
					Add</Button>
				<Button>
				<Image
						src="/images/save.svg"
						width={20}
						height={20}
						alt="Picture of the author"
					/>
					Export</Button>
			</div>
		</div>
		<CompanySummary/>
		<footer className="flex justify-between mx-12">
			<p>© 2024 Peer Carbon. All rights reserved.</p>
			<div className="flex ">
				<Image
								src="/images/linkedin.png"
								width={30}
								height={20}
								alt=""
								className="mr-4"
				/>
				<Image
								src="/images/twitter.png"
								width={30}
								height={20}
								alt=""
								/>
			</div>
			
		</footer>
		
	</div>;
};

AppDashboard.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default AppDashboard;
