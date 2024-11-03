"use client";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { getInitials } from "@/utils";
import { Navbar, NavbarBrand, NavbarContent, Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem, Link, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from "@nextui-org/react";
import { BellIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { appNavbarMenuItems } from "./appNavbarMenuItems";
import AppCommandCenter from "../modals/AppCommandCenter";
import { useCompanyConfigStore } from "@/hooks/store/useCompanyConfigStore";
import { defaultConfigForCompany } from "@/helpers/config";

const AppHeader = () => {
	const [isMenuOpened, setIsMenuOpened] = useState(false);

	const { data: session, status } = useSession();
	const router = useRouter();

	const account = useMemo(() => {
		if (status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [session, status]);

	const logout = async () => {
		await signOut({
			redirect: false,
		});
		router.push(AppEnumRoutes.AUTH_LOGIN);
	};

	const { config } = useCompanyConfigStore();

	return (
		<Navbar maxWidth="full" onMenuOpenChange={setIsMenuOpened} isMenuOpen={isMenuOpened}>
			<NavbarContent className="md:hidden" justify="start">
				<NavbarMenuToggle aria-label={isMenuOpened ? "Close menu" : "Open menu"} />
			</NavbarContent>
			<NavbarContent className="hidden md:flex pr-3" justify="center">
				<NavbarBrand>
					<img src="/images/logo1.png" width={120} className="mx-auto" />
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent className="md:hidden pr-3" justify="center">
				<NavbarBrand>
					<img src="/images/logo1.png" width={120} className="mx-auto" />
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent as="div" className="items-center" justify="start">
				<AppCommandCenter />
			</NavbarContent>

			<NavbarContent as="div" justify="end">
				<Button isIconOnly color="primary" size="sm" variant="flat">
					<BellIcon size={18} />
				</Button>
				<Dropdown placement="bottom-end">
					<DropdownTrigger>
						<Avatar isBordered as="button" className="transition-transform" color="primary" name={getInitials(account?.name ?? "Unknown") ?? "Unknown"} size="sm" src={account?.profilePicture} />
					</DropdownTrigger>
					<DropdownMenu aria-label="Profile Actions" variant="flat" className="saastain font-nunito">
						<DropdownItem key="signed as" className="h-14 gap-2">
							<p className="font-semibold">Signed in as</p>
							<p className="font-semibold">
								{account?.name} ({account?.email})
							</p>
						</DropdownItem>
						<DropdownItem key="profile" as={Link} href={AppEnumRoutes.APP_PROFILE}>
							My Profile
						</DropdownItem>
						<DropdownItem key="logout" color="danger" onClick={logout}>
							Log Out
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>
			<NavbarMenu className="saastain font-nunito">
				{appNavbarMenuItems(config ?? defaultConfigForCompany).map((item, index) => (
					<NavbarMenuItem key={index}>{item}</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
};

export default AppHeader;
