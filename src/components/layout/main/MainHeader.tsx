"use client";

import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { getInitials } from "@/utils";
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const MainHeader = () => {
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

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
			<NavbarContent as="div" justify="end">
				{account ? (
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Avatar isBordered as="button" className="transition-transform" color="primary" name={getInitials(account?.name ?? "Unknown") ?? "Unknown"} size="sm" src="" />
						</DropdownTrigger>
						<DropdownMenu aria-label="Profile Actions" variant="flat" className="saastain font-nunito">
							<DropdownItem key="signed as" className="h-14 gap-2">
								<p className="font-semibold">Signed in as</p>
								<p className="font-semibold">
									{account?.name} ({account?.email})
								</p>
							</DropdownItem>
							<DropdownItem key="dashboard" as={Link} href={AppEnumRoutes.APP_DASHBOARD}>
								Dashboard
							</DropdownItem>
							<DropdownItem key="logout" color="danger" onClick={logout}>
								Log Out
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				) : (
					<>
						<Button color="primary" variant="bordered" as={Link} href={AppEnumRoutes.AUTH_LOGIN}>
							Login
						</Button>
						<Button color="primary" as={Link} href={AppEnumRoutes.AUTH_REGISTER} >Get Started</Button>
					</>
				)}
			</NavbarContent>
		</Navbar>
	);
};

export default MainHeader;
