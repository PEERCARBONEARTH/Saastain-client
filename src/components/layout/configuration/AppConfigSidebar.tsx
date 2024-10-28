"use client";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Avatar, Button, Chip, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { appConfigNavMenuItems } from "./appConfigNavMenuItems";
import { Fragment, useMemo } from "react";
import { useSession } from "next-auth/react";
import { getInitials } from "@/utils";

const AppConfigSidebar = () => {
	const { data: session, status } = useSession();

	const account = useMemo(() => {
		if (status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [session, status]);

	return (
		<div className="hidden md:flex flex-col w-[14rem] border-r border-gray-200 h-screen overflow-y-auto bg-white">
			<div className="py-6 px-4">
				<div className="hidden md:block">
					<Button as={Link} href={AppEnumRoutes.APP_DASHBOARD} fullWidth={false} color="default" startContent={<ChevronLeftIcon className="w-5 h-5" />}>
						Go Back
					</Button>
				</div>
				<div className="space-y-16 mt-8">
					<div className="">
						<p className="text-xs uppercase text-gray-500 font-medium">Account</p>
						<div className="flex gap-x-2 mt-2">
							<Avatar showFallback getInitials={getInitials} size="lg" name={account?.company?.companyName} />
							<div className="">
								<h3 className="text-primary font-semibold">{account?.company?.companyName}</h3>
								<div className="flex items-center gap-x-2">
									<Chip size="sm" color="primary" variant="flat">
										{account?.company?.location}
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
