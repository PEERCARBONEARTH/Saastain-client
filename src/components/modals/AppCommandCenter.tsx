import { BellIcon, HomeIcon, SearchIcon } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { cn, Button as NextBtn } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FiFilePlus } from "react-icons/fi";
import { HiBriefcase, HiDocumentReport, HiOutlineChartBar, HiOutlineChartPie, HiOutlineGlobeAlt, HiOutlineUserCircle, HiOutlineUserGroup } from "react-icons/hi";
import Image from "next/image";
import { useRouter } from "next/router";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { useMediaQuery } from "react-responsive";

function AppCommandCenter() {
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
				if ((e.target instanceof HTMLElement && e.target.isContentEditable) || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
					return;
				}

				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const runCommand = useCallback((command: () => unknown) => {
		setOpen(false);
		command();
	}, []);

	return (
		<>
			{!isMobile && (
				<Button
					variant="outline"
					className={cn("relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64")}
					onClick={() => setOpen(true)}>
					<span className="hidden lg:inline-flex">Type to Search ...</span>
					<span className="inline-flex lg:hidden">Search...</span>
					<kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
						<span className="text-xs">⌘</span>K
					</kbd>
				</Button>
			)}
			{isMobile && (
				<NextBtn isIconOnly color="primary" size="sm" variant="flat" onPress={() => setOpen(true)}>
					<SearchIcon size={18} />
				</NextBtn>
			)}
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList className="saastain" style={{fontFamily: "Nunito"}}>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_DASHBOARD));
							}}>
							<HomeIcon className="mr-2 h-4 w-4" />
							<span>Dashboard</span>
						</CommandItem>
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_ADD_DATA));
							}}>
							<FiFilePlus className="mr-2 h-4 w-4" />
							<span>Add Data</span>
						</CommandItem>
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_DATA_LIST));
							}}>
							<HiOutlineChartBar className="mr-2 h-4 w-4" />
							<span>Data List</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Overview">
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_DASHBOARD));
							}}>
							<HomeIcon className="mr-2 h-4 w-4" />
							<span>Dashboard</span>
						</CommandItem>
					</CommandGroup>
					<CommandGroup heading="Accounting">
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_ADD_DATA));
							}}>
							<FiFilePlus className="mr-2 h-4 w-4" />
							<span>Add Data</span>
						</CommandItem>
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_DATA_LIST));
							}}>
							<HiOutlineChartBar className="mr-2 h-4 w-4" />
							<span>Data List</span>
						</CommandItem>
					</CommandGroup>
					<CommandGroup heading="Analytics">
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_ANALYTICS_EMISSION_REPORTS));
							}}>
							<HiDocumentReport className="mr-2 h-4 w-4" />
							<span>Emission Reports</span>
						</CommandItem>
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_ANALYTICS_GHG_REPORTS));
							}}>
							<HiOutlineChartPie className="mr-2 h-4 w-4" />
							<span>GHG Reports</span>
						</CommandItem>
					</CommandGroup>
					<CommandGroup heading="Action Plan">
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_ACTION_PLAN_NET_ZERO));
							}}>
							<HiOutlineGlobeAlt className="mr-2 h-4 w-4" />
							<span>Net Zero</span>
						</CommandItem>
					</CommandGroup>
					<CommandGroup heading="Green Financing">
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_MARKETPLACE));
							}}>
							<Image src={"/images/greenhouse-effect-img1.png"} width={18} height={18} alt="Green" />
							<span>Marketplace</span>
						</CommandItem>
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_LOAN_REQUESTS));
							}}>
							<HiBriefcase className="mr-2 h-4 w-4" />
							<span>Loan Requests</span>
						</CommandItem>
					</CommandGroup>
					<CommandGroup heading="Company">
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_COMPANY));
							}}>
							<HiOutlineUserCircle className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</CommandItem>
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_USERS));
							}}>
							<HiOutlineUserGroup className="mr-2 h-4 w-4" />
							<span>Users</span>
						</CommandItem>
						<CommandItem
							onSelect={() => {
								runCommand(() => router.push(AppEnumRoutes.APP_NOTIFICATIONS));
							}}>
							<BellIcon className="mr-2 h-4 w-4" />
							<span>Notifications</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}

export default AppCommandCenter;
