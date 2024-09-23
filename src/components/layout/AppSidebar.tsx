"use client";
import { Fragment } from "react";
import { appNavbarMenuItems } from "./appNavbarMenuItems";
import { useCompanyConfigStore } from "@/hooks/store/useCompanyConfigStore";
import { defaultConfigForCompany } from "@/helpers/config";

const AppSidebar = () => {
	const { config } = useCompanyConfigStore();
	return (
		<div className="hidden md:flex flex-col w-[14rem] border-r border-gray-200 h-screen overflow-y-auto bg-white">
			{appNavbarMenuItems(config ?? defaultConfigForCompany).map((item, idx) => (
				<Fragment key={idx}>{item}</Fragment>
			))}
		</div>
	);
};

export default AppSidebar;
