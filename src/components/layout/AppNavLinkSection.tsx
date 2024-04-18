import { ReactNode } from "react";

interface AppNavLinkSectionProps {
	title: string;
	render: () => ReactNode;
	show?: boolean;
}

const AppNavLinkSection = ({ title, render, show = true }: AppNavLinkSectionProps) => {
	return show ? (
		<div className="px-4 py-5">
			<p className="font-medium text-sm text-gray-400">{title}</p>
			<div className="flex space-y-2 flex-col mt-2">{render()}</div>
		</div>
	) : null;
};

export default AppNavLinkSection;
