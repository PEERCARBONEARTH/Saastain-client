"use client";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Avatar, Button, Chip, Link } from "@nextui-org/react";
import { BuildingIcon, ChevronLeftIcon } from "lucide-react";
import { HiCash, HiChartBar, HiChat, HiClock, HiLockOpen, HiSwitchHorizontal } from "react-icons/hi";
import { appConfigNavMenuItems } from "./appConfigNavMenuItems";
import { Fragment } from "react";

const AppConfigSidebar = () => {
	return (
		<div className="hidden md:flex flex-col w-[14rem] border-r border-gray-200 h-screen overflow-y-auto bg-white">
			<div className="py-6 px-4">
				<Button as={Link} href={AppEnumRoutes.APP_DASHBOARD} fullWidth={false} color="default" startContent={<ChevronLeftIcon className="w-5 h-5" />}>
					Go Back
				</Button>
				<div className="space-y-16 mt-8">
					<div className="">
						<p className="text-xs uppercase text-gray-500 font-medium">Account</p>
						<div className="flex gap-x-2 mt-2">
							<Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" size="lg" />
							<div className="">
								<h3 className="text-primary font-semibold">Peercarbon</h3>
								<div className="flex items-center gap-x-2">
									<Chip size="sm" color="primary" variant="flat">
										Nairobi
									</Chip>
									<Button size="sm" variant="light">
										Change
									</Button>
								</div>
							</div>
						</div>
					</div>
					{appConfigNavMenuItems.map((navItem, idx) => (
						<Fragment key={idx}>{navItem}</Fragment>
					))}
				</div>
			</div>
		</div>
	);
};

export default AppConfigSidebar;
