"use client";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import { appConfigNavMenuItems } from "./appConfigNavMenuItems";

const AppConfigHeader = () => {
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

	return (
		<Navbar maxWidth="full" onMenuOpenChange={setIsMenuOpened} isMenuOpen={isMenuOpened}>
			<NavbarContent justify="start">
				<Button size="sm" as={Link} href={AppEnumRoutes.APP_DASHBOARD} fullWidth={false} color="default" startContent={<ChevronLeftIcon className="w-5 h-5" />}>
					Go Back
				</Button>
			</NavbarContent>
			<NavbarContent justify="center">
				<NavbarBrand>
					<img src="/images/logo1.png" width={120} className="mx-auto" />
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarMenuToggle aria-label={isMenuOpened ? "Close menu" : "Open menu"} />
			</NavbarContent>
			<NavbarMenu className="saastain font-nunito">
				{appConfigNavMenuItems.map((navItem, idx) => (
					<NavbarMenuItem key={idx}>{navItem}</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
};

export default AppConfigHeader;
