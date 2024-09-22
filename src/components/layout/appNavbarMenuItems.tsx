import { Home, BellIcon, UsersIcon, UserIcon, CogIcon } from "lucide-react";
import { HiBriefcase, HiOutlineQuestionMarkCircle, HiOutlineLogout, HiOutlineOfficeBuilding, HiUserGroup, HiFolderOpen } from "react-icons/hi";
import AppNavLinkItem from "./AppNavLinkItem";
import AppNavLinkSection from "./AppNavLinkSection";
import { AiFillPieChart } from "react-icons/ai";
import { MdOutlineAssessment } from "react-icons/md";
import { SiHiveBlockchain } from "react-icons/si";

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
		title="Company"
		render={() => (
			<>
				<AppNavLinkItem title="Companies" icon={<HiOutlineOfficeBuilding className="text-primary-500" size={18} />} href="companies" />
				<AppNavLinkItem title="Subscriptions" icon={<HiBriefcase className="text-primary-500" size={18} />} href="subscriptions" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Marketplace"
		render={() => (
			<>
				<AppNavLinkItem title="Orders" icon={<HiFolderOpen className="text-primary-500" size={18} />} href="orders" />
				<AppNavLinkItem title="Projects" icon={<SiHiveBlockchain className="text-primary-500" size={18} />} href="projects" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Loan Management"
		render={() => (
			<>
				<AppNavLinkItem title="Climate Risk Assessment" icon={<MdOutlineAssessment className="text-primary-500" size={18} />} href="climate-risk-assessment" />
				<AppNavLinkItem title="Loan Requests" icon={<AiFillPieChart className="text-primary-500" size={18} />} href="loan-requests" />
				<AppNavLinkItem title="Loan Repayments" icon={<AiFillPieChart className="text-primary-500" size={18} />} href="loan-repayments" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Users"
		render={() => (
			<>
				<AppNavLinkItem title="Waitlist" icon={<HiOutlineOfficeBuilding className="text-primary-500" size={18} />} href="users/waitlist" />
				<AppNavLinkItem title="Profiles" icon={<UsersIcon className="text-primary-500" size={18} />} href="users" />
				<AppNavLinkItem title="Lenders" icon={<HiUserGroup className="text-primary-500" size={18} />} href="users/lenders" />
				<AppNavLinkItem title="Vendors" icon={<UsersIcon className="text-primary-500" size={18} />} href="users/vendors" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Account"
		render={() => (
			<>
				<AppNavLinkItem title="My Profile" icon={<UserIcon className="text-primary-500" size={18} />} href="profile" />
				<AppNavLinkItem title="Settings" icon={<CogIcon className="text-primary-500" size={18} />} href="settings" />
				<AppNavLinkItem title="Notifications" icon={<BellIcon className="text-primary-500" size={18} />} href="notifications" />
			</>
		)}
	/>,
	<AppNavLinkSection
		title="Others"
		render={() => (
			<>
				<AppNavLinkItem title="Docs" icon={<HiOutlineQuestionMarkCircle className="text-primary" size={18} />} href="docs" />
				<AppNavLinkItem title="Sign Out" icon={<HiOutlineLogout className="text-primary" size={18} />} href="auth/logout" />
			</>
		)}
	/>,
];
