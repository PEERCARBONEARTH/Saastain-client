import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { FC, ReactNode } from "react";

interface AppLayoutProps {
	children: ReactNode | ReactNode[];
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
	return (
		<div className="flex flex-col flex-1 transition-all">
			<AppHeader />
			<div className="flex flex-1 flex-col md:flex-row">
				<AppSidebar />
				<div className="flex flex-1 flex-col px-2 md:px-[30px] py-5 overflow-y-auto h-screen">{children}</div>
			</div>
		</div>
	);
};

export default AppLayout;
