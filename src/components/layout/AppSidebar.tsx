import { appNavbarMenuItems } from "./appNavbarMenuItems";

const AppSidebar = () => {
	return <div className="hidden md:flex flex-col w-[14rem] border-r border-gray-200 h-screen overflow-y-auto bg-white">{appNavbarMenuItems.map((item, index) => item)}</div>;
};

export default AppSidebar;
