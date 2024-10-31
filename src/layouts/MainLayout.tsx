import MainFooter from "@/components/layout/main/MainFooter";
import MainHeader from "@/components/layout/main/MainHeader";
import { FC, ReactNode } from "react";

interface IProps {
	children: ReactNode;
}

const MainLayout: FC<IProps> = ({ children }) => {
	return (
		<div className="flex flex-col flex-1 transition-all">
			<MainHeader />
			<div className="flex flex-1 flex-col md:flex-row">
				<div className="flex flex-1 flex-col px-2 md:px-[30px] py-5 overflow-y-auto h-screen">
					{children}
					<MainFooter />
				</div>
			</div>
		</div>
	);
};

export default MainLayout;
