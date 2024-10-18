import { ReactNode } from "react";

interface AppConfigNavSectionProps {
	title: string;
	render: () => ReactNode;
	show?: boolean;
}

const AppConfigNavSection = ({ title, render, show = true }: AppConfigNavSectionProps) => {
	return show ? (
		<div className="">
			<p className="text-xs uppercase text-gray-500 font-medium">{title}</p>
			<div className="mt-4">{render()}</div>
		</div>
	) : null;
};

export default AppConfigNavSection;
