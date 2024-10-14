"use client";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Avatar, Button, Chip, Link } from "@nextui-org/react";
import { BuildingIcon, ChevronLeftIcon } from "lucide-react";
import { HiCash, HiChartBar, HiChat, HiClock, HiLockOpen, HiSwitchHorizontal } from "react-icons/hi";

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
					<div className="">
						<p className="text-xs uppercase text-gray-500 font-medium">Company</p>
						<div className="mt-4 space-y-3">
							<Button startContent={<BuildingIcon className="w-5 h-5" />} color="default" variant={"light"}>
								General
							</Button>
							<Button startContent={<HiLockOpen className="w-5 h-5" />} color="default" variant={"light"}>
								Security
							</Button>
							<Button startContent={<HiCash className="w-5 h-5" />} color="default" variant={"light"}>
								Subscriptions
							</Button>
						</div>
					</div>
					<div className="">
						<p className="text-xs uppercase text-gray-500 font-medium">Team</p>
						<div className="mt-4 space-y-3">
							<Button startContent={<HiChartBar className="w-5 h-5" />} color="primary">
								Equipments
							</Button>
							<Button startContent={<HiClock className="w-5 h-5" />} color="default" variant={"light"}>
								Timezones
							</Button>
							<Button startContent={<HiSwitchHorizontal className="w-5 h-5" />} color="default" variant={"light"}>
								Integrations
							</Button>
						</div>
					</div>
					<div className="">
						<p className="text-xs uppercase text-gray-500 font-medium">Help</p>
						<div className="mt-4 space-y-3">
							<Button startContent={<HiChat className="w-5 h-5" />} color="default" variant={"light"}>
								Contact Support
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppConfigSidebar;
