import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { getInitials } from "@/utils";
import { Navbar, NavbarBrand, NavbarContent, Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem, Link, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Input, Button } from "@nextui-org/react";
import { BellIcon, SearchIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const menuItems = [
	{
		label: "Dashboard",
		href: AppEnumRoutes.APP_DASHBOARD,
	},
];

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

	return (
		<Navbar maxWidth="full" onMenuOpenChange={setIsMenuOpened} isMenuOpen={isMenuOpened}>
			<NavbarContent className="sm:hidden" justify="start">
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
			<NavbarContent as="div" className="items-center hidden md:flex" justify="start">
				<Input
					classNames={{
						base: "max-w-full sm:max-w-[20rem] h-10",
						mainWrapper: "h-full",
						input: "text-small",
						inputWrapper: "h-full font-normal text-default-600 rounded-2xl",
					}}
					placeholder="Type to search..."
					size="sm"
					startContent={<SearchIcon size={18} />}
					type="search"
					variant="bordered"
				/>
			</NavbarContent>

			<NavbarContent as="div" justify="end">
				<Button isIconOnly color="secondary" size="sm" variant="flat">
					<BellIcon size={18} />
				</Button>
				<Dropdown placement="bottom-end">
					<DropdownTrigger>
						<Avatar isBordered as="button" className="transition-transform" color="secondary" name={getInitials(account?.name ?? "Unknown") ?? "Unknown"} size="sm" src="" />
					</DropdownTrigger>
					<DropdownMenu aria-label="Profile Actions" variant="flat">
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
			<NavbarMenu>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item.href}-${index}`}>
						<Link className="w-full" color={index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"} href={item.href} size="lg">
							{item.label}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
};

export default AppHeader;
