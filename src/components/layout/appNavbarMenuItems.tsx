import { Home } from "lucide-react";
import AppNavLinkSection from "./AppNavLinkSection";
import AppNavLinkItem from "./AppNavLinkItem";
import { HiOutlineNewspaper, HiOutlineClipboardList, HiFolderAdd, HiFolderOpen, HiCash, HiOutlineUserCircle, HiOutlineTemplate, HiOutlineQuestionMarkCircle, HiOutlineLogout, HiPlusCircle, HiDocumentReport } from "react-icons/hi";

export const appNavbarMenuItems = [
	<AppNavLinkSection
		title="Overview"
		render={() => (
			<>
				<AppNavLinkItem title="Dashboard" icon={<Home className="text-primary" size={18} />} href="dashboard" />
			</>
		)}
		key={"overview"}
	/>,
	<AppNavLinkSection
		title="Products"
		render={() => (
			<>
				<AppNavLinkItem title="New Product" icon={<HiPlusCircle className="text-primary" size={18} />} href="products/new" />
				<AppNavLinkItem title="All Products" icon={<HiOutlineNewspaper className="text-primary" size={18} />} href="products" />
				<AppNavLinkItem title="Draft Products" icon={<HiOutlineClipboardList className="text-primary" size={18} />} href="products/draft" />
			</>
		)}
		key={"products"}
	/>,
	<AppNavLinkSection
		title="Orders & Billing"
		render={() => (
			<>
				<AppNavLinkItem title="New Order" icon={<HiFolderAdd className="text-primary" size={18} />} href="orders/new" />
				<AppNavLinkItem title="Orders" icon={<HiFolderOpen className="text-primary" size={18} />} href="orders" />
				<AppNavLinkItem title="Quotations" icon={<HiDocumentReport className="text-primary" size={18} />} href="quotations" />
				<AppNavLinkItem title="Invoices" icon={<HiCash className="text-primary" size={18} />} href="billing/invoices" />
			</>
		)}
		key={"orders"}
	/>,
	<AppNavLinkSection
		title="Vendor"
		render={() => (
			<>
				<AppNavLinkItem title="Profile" icon={<HiOutlineUserCircle className="text-primary" size={18} />} href="profile" />
			</>
		)}
		key={"vendor"}
	/>,
	<AppNavLinkSection
		title="Others"
		render={() => (
			<>
				<AppNavLinkItem title="Templates" icon={<HiOutlineTemplate className="text-primary" size={18} />} href="templates" />
				<AppNavLinkItem title="Docs" icon={<HiOutlineQuestionMarkCircle className="text-primary" size={18} />} href="docs" />
				<AppNavLinkItem title="Logout" icon={<HiOutlineLogout className="text-primary" size={18} />} href="#" />
			</>
		)}
		key={"others"}
	/>,
];
