import { Home, BellIcon, SettingsIcon } from "lucide-react";
import { FiFilePlus } from "react-icons/fi";
import { HiOutlineChartBar, HiDocumentReport, HiOutlineChartPie, HiOutlineGlobeAlt, HiBriefcase, HiOutlineUserCircle, HiOutlineUserGroup, HiOutlineQuestionMarkCircle, HiOutlineLogout } from "react-icons/hi";
import AppNavLinkItem from "./AppNavLinkItem";
import AppNavLinkSection from "./AppNavLinkSection";
import Image from "next/image";
import { IConfiguration } from "@/types/Configuration";
import { HiCalendar, HiOutlineTicket } from "react-icons/hi2";

export const appNavbarMenuItems = (config: IConfiguration) => [
	<AppNavLinkSection
		title="Overview"
		render={() => (
			<>
				<AppNavLinkItem title="Dashboard" icon={<Home className="text-primary" size={18} />} href="dashboard" show={config.modules.Overview.Dashboard} />
			</>
		)}
		show={config.modules.Overview.Dashboard}
	/>,
	<AppNavLinkSection
		title="Accounting"
		render={() => (
			<>
				<AppNavLinkItem title="Add Data" icon={<FiFilePlus className="text-primary" size={18} />} href="accounting/add-data" show={config.modules.Accounting["Add Data"]} />
				<AppNavLinkItem title="Data List" icon={<HiOutlineChartBar className="text-primary" size={18} />} href="accounting/data-list" show={config.modules.Accounting["Data List"]} />
			</>
		)}
		show={config.modules.Accounting["Add Data"] || config.modules.Accounting["Data List"]}
	/>,
	<AppNavLinkSection
		title="Carbon Neutral Events"
		render={() => (
			<>
				<AppNavLinkItem title="Events Pledge" icon={<HiOutlineTicket className="text-primary" size={18} />} href="events-pledge" />
				<AppNavLinkItem title="Events" icon={<HiCalendar className="text-primary" size={18} />} href="events" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Analytics"
		render={() => (
			<>
				<AppNavLinkItem title="GHG Analytics" icon={<HiDocumentReport className="text-primary" size={18} />} href="analytics/emission-reports" show={config.modules.Analytics["GHG Analytics"]} />
				<AppNavLinkItem title="ESG Reports" icon={<HiOutlineChartPie className="text-primary" size={18} />} href="analytics/ghg-reports" show={config.modules.Analytics["ESG Reports"]} />
			</>
		)}
		show={config.modules.Analytics["GHG Analytics"] || config.modules.Analytics["ESG Reports"]}
	/>,
	<AppNavLinkSection
		title="Action Plan"
		render={() => (
			<>
				<AppNavLinkItem title="Net Zero" icon={<HiOutlineGlobeAlt className="text-primary" size={18} />} href="action-plan/net-zero" show={config.modules.ActionPlan['Net Zero']} />
				<AppNavLinkItem show={config.modules.ActionPlan['My Projects']} title="My Projects" icon={<HiBriefcase className="text-primary" size={18} />} href="projects" />
			</>
		)}
		show={config.modules.ActionPlan['My Projects'] || config.modules.ActionPlan['Net Zero']}
	/>,
	<AppNavLinkSection
		title="Green Financing"
		render={() => (
			<>
				<AppNavLinkItem title="Marketplace" icon={<Image src={"/images/greenhouse-effect-img1.png"} width={18} height={18} alt="Green" />} href="green-finance/marketplace" show={config.modules.GreenFinancing.Marketplace} />
				<AppNavLinkItem title="Loan Requests" icon={<HiBriefcase className="text-primary" size={18} />} href="green-finance/loans" show={config.modules.GreenFinancing['Loan Requests']} />
			</>
		)}
		show={config.modules.GreenFinancing.Marketplace || config.modules.GreenFinancing['Loan Requests']}
	/>,
	<AppNavLinkSection
		title="Company"
		render={() => (
			<>
				<AppNavLinkItem title="Profile" icon={<HiOutlineUserCircle className="text-primary" size={18} />} href="company/profile" show={config.modules.Company.Profile} />
				<AppNavLinkItem title="Users" icon={<HiOutlineUserGroup className="text-primary" size={18} />} href="company/users" show={config.modules.Company.Users} />
				<AppNavLinkItem title="Notifications" icon={<BellIcon className="text-primary" size={18} />} href="notifications" show={config.modules.Company.Notifications} />
			</>
		)}
		show={config.modules.Company.Profile || config.modules.Company.Users || config.modules.Company.Notifications}
	/>,
	<AppNavLinkSection
		title="Others"
		render={() => (
			<>
				<AppNavLinkItem title="Configuration" icon={<SettingsIcon className="text-primary" size={18} />} href="configuration" />
				<AppNavLinkItem title="Docs" icon={<HiOutlineQuestionMarkCircle className="text-primary" size={18} />} href="docs" />
				<AppNavLinkItem title="Sign Out" icon={<HiOutlineLogout className="text-primary" size={18} />} href="auth/logout" />
			</>
		)}
	/>,
];
