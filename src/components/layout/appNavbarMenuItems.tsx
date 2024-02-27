import { Home, BellIcon } from "lucide-react";
import { FiFilePlus } from "react-icons/fi";
import { HiOutlineChartBar, HiDocumentReport, HiOutlineChartPie, HiOutlineGlobeAlt, HiBriefcase, HiOutlineUserCircle, HiOutlineUserGroup, HiOutlineQuestionMarkCircle, HiOutlineLogout } from "react-icons/hi";
import AppNavLinkItem from "./AppNavLinkItem";
import AppNavLinkSection from "./AppNavLinkSection";
import Image from "next/image";

export const appNavbarMenuItems = [
	<AppNavLinkSection
		title="Overview"
		render={() => (
			<>
				<AppNavLinkItem title="Dashboard" icon={<Home className="text-primary" size={18} />} href="dashboard" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Accounting"
		render={() => (
			<>
				<AppNavLinkItem title="Add Data" icon={<FiFilePlus className="text-primary" size={18} />} href="accounting/add-data" />
				<AppNavLinkItem title="Data List" icon={<HiOutlineChartBar className="text-primary" size={18} />} href="accounting/data-list" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Analytics"
		render={() => (
			<>
				<AppNavLinkItem title="Emission Reports" icon={<HiDocumentReport className="text-primary" size={18} />} href="analytics/emission-reports" />
				<AppNavLinkItem title="GHG Reports" icon={<HiOutlineChartPie className="text-primary" size={18} />} href="analytics/ghg-reports" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Action Plan"
		render={() => (
			<>
				<AppNavLinkItem title="Net Zero" icon={<HiOutlineGlobeAlt className="text-primary" size={18} />} href="action-plan/net-zero" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Green Financing"
		render={() => (
			<>
				<AppNavLinkItem title="Marketplace" icon={<Image src={"/images/greenhouse-effect-img1.png"} width={18} height={18} alt="Green" />} href="green-finance/marketplace" />
				<AppNavLinkItem title="Loan Requests" icon={<HiBriefcase className="text-primary" size={18} />} href="green-finance/loans" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Company"
		render={() => (
			<>
				<AppNavLinkItem title="Profile" icon={<HiOutlineUserCircle className="text-primary" size={18} />} href="company/profile" />
				<AppNavLinkItem title="Users" icon={<HiOutlineUserGroup className="text-primary" size={18} />} href="company/users" />
				<AppNavLinkItem title="Notifications" icon={<BellIcon className="text-primary" size={18} />} href="notifications" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Others"
		render={() => (
			<>
				<AppNavLinkItem title="Docs" icon={<HiOutlineQuestionMarkCircle className="text-primary" size={18} />} href="docs" />
				<AppNavLinkItem title="Sign Out" icon={<HiOutlineLogout className="text-primary" size={18} />} href="#" />
			</>
		)}
	/>,
];
