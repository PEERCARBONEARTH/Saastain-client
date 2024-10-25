import { BuildingIcon } from "lucide-react";
import AppConfigNavLinkItem from "./AppConfigNavLinkItem";
import AppConfigNavSection from "./AppConfigNavSection";
import { HiCash, HiChartBar, HiChat, HiClock, HiLockOpen, HiSwitchHorizontal } from "react-icons/hi";

export const appConfigNavMenuItems = [
	<AppConfigNavSection
		title="Account"
		render={() => (
			<div className="space-y-3">
				<AppConfigNavLinkItem title="General" icon={<BuildingIcon className="w-5 h-5" />} href="account" />
				<AppConfigNavLinkItem title="Security" icon={<HiLockOpen className="w-5 h-5" />} href="account/security" />
				<AppConfigNavLinkItem title="Subscriptions" icon={<HiCash className="w-5 h-5" />} href="account/subscriptions" />
			</div>
		)}
	/>,
	<AppConfigNavSection
		title="Team"
		render={() => (
			<div className="space-y-3">
				<AppConfigNavLinkItem title="Equipments" icon={<HiChartBar className="w-5 h-5" />} href="team/equipments" />
				<AppConfigNavLinkItem title="Timezones" icon={<HiClock className="w-5 h-5" />} href="team/timezones" />
				<AppConfigNavLinkItem title="Integrations" icon={<HiSwitchHorizontal className="w-5 h-5" />} href="team/integrations" />
			</div>
		)}
	/>,
	<AppConfigNavSection
		title="Help"
		render={() => (
			<div className="space-y-3">
				<AppConfigNavLinkItem title="Contact Support" icon={<HiChat className="w-5 h-5" />} href="help/support" />
			</div>
		)}
	/>,
];
