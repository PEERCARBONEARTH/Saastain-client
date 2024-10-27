import AppConfigHeader from "@/components/layout/configuration/AppConfigHeader";
import AppConfigSidebar from "@/components/layout/configuration/AppConfigSidebar";
import { FC, ReactNode } from "react";

interface IProps {
	children: ReactNode | ReactNode[];
}

const AppConfigLayout: FC<IProps> = ({ children }) => {
	return (
		<div className="flex flex-col flex-1 transition-all">
			<div className="md:hidden">
				<AppConfigHeader />
			</div>
			<div className="flex flex-1 flex-col md:flex-row">
				<AppConfigSidebar />
				<div className="flex flex-1 flex-col px-2 md:px-[30px] py-8 overflow-y-auto h-screen">{children}</div>
			</div>
		</div>
	);
};

export default AppConfigLayout;
