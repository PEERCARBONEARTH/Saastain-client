import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { BellIcon, Home } from "lucide-react";
import { cn } from "@nextui-org/react";
import { HiOutlineQuestionMarkCircle, HiOutlineLogout, HiOutlineChartBar, HiDocumentReport, HiOutlineChartPie, HiOutlineGlobeAlt, HiOutlineUserCircle, HiOutlineUserGroup } from "react-icons/hi";
import { HiBriefcase } from "react-icons/hi2";
import { useRouter } from "next/router";
import { FiFilePlus } from "react-icons/fi";
import Image from "next/image";

interface LinkSectionProps {
	title: string;
	render: () => ReactNode;
}

interface LinkItemProps {
	title: string;
	icon?: ReactNode;
	href?: string;
}

const LinkSection = ({ title, render }: LinkSectionProps) => {
	return (
		<div className="px-4 py-5">
			<p className="font-medium text-sm text-gray-400">{title}</p>
			<div className="flex space-y-2 flex-col mt-2">{render()}</div>
		</div>
	);
};

const LinkItem = ({ title, icon, href }: LinkItemProps) => {
	const router = useRouter();
	const pathname = router.pathname;

	const selected = useMemo(() => {
		if (href && pathname !== "/") {
			return pathname === `/${href}` ? true : false;
		}

		return false;
	}, [href, pathname]);
	return (
		<Link href={href ? `/${href}` : "/"}>
			<div className="flex flex-col mt-2">
				<div className={cn("text-sm text-gray-700 hover:text-gray-900 flex space-x-3", { "text-[#5E896E] font-bold": selected })}>
					<div className="mr-1">{icon}</div>
					<span className="text-[14px]">{title}</span>
				</div>
			</div>
		</Link>
	);
};

const AppSidebar = () => {
	return (
		<div className="hidden md:flex flex-col w-[14rem] border-r border-gray-200 h-screen overflow-y-auto bg-white">
			<LinkSection
				title="Overview"
				render={() => (
					<>
						<LinkItem title="Dashboard" icon={<Home className="text-teal-700" size={18} />} href="dashboard" />
					</>
				)}
			/>
			<LinkSection
				title="Accounting"
				render={() => (
					<>
						<LinkItem title="Add Data" icon={<FiFilePlus className="text-teal-700" size={18} />} href="accounting/add-data" />
						<LinkItem title="Data List" icon={<HiOutlineChartBar className="text-teal-700" size={18} />} href="accounting/data-list" />
					</>
				)}
			/>
			<LinkSection
				title="Analytics"
				render={() => (
					<>
						<LinkItem title="Emission Reports" icon={<HiDocumentReport className="text-teal-700" size={18} />} href="analytics/emission-reports" />
						<LinkItem title="GHG Reports" icon={<HiOutlineChartPie className="text-teal-700" size={18} />} href="analytics/ghg-reports" />
					</>
				)}
			/>
			<LinkSection
				title="Action Plan"
				render={() => (
					<>
						<LinkItem title="Net Zero" icon={<HiOutlineGlobeAlt className="text-teal-700" size={18} />} href="action-plan/net-zero" />
					</>
				)}
			/>
			<LinkSection
				title="Green Financing"
				render={() => (
					<>
						<LinkItem title="Marketplace" icon={<Image src={"/images/greenhouse-effect-img1.png"} width={18} height={18} alt="Green" />} href="green-financing/marketplace" />
						<LinkItem title="Loan Requests" icon={<HiBriefcase className="text-teal-700" size={18} />} href="green-financing/loans" />
					</>
				)}
			/>
			<LinkSection
				title="Company"
				render={() => (
					<>
						<LinkItem title="Profile" icon={<HiOutlineUserCircle className="text-teal-700" size={18} />} href="company/profile" />
						<LinkItem title="Users" icon={<HiOutlineUserGroup className="text-teal-700" size={18} />} href="company/users" />
						<LinkItem title="Notifications" icon={<BellIcon className="text-teal-700" size={18} />} href="notifications" />
					</>
				)}
			/>
			<LinkSection
				title="Others"
				render={() => (
					<>
						<LinkItem title="Docs" icon={<HiOutlineQuestionMarkCircle className="text-teal-700" size={18} />} href="docs" />
						<LinkItem title="Sign Out" icon={<HiOutlineLogout className="text-teal-700" size={18} />} href="#" />
					</>
				)}
			/>
		</div>
	);
};

export default AppSidebar;
