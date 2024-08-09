"use client";
import NewBtn from "@/components/btns/NewBtn";
import CustomText from "@/components/typography/CustomText";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { IUser } from "@/types/User";
import { getColorFromUserId, getInitials } from "@/utils";
import { BreadcrumbItem, Breadcrumbs, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User, Button } from "@nextui-org/react";
import { format } from "date-fns";
import { Home, UserCog, Users as UsersIcon, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import useSWR from "swr";
import { LuMoreVertical } from "react-icons/lu";
import CustomStack from "@/components/stack/CustomStack";
import RefreshBtn from "@/components/btns/RefreshBtn";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { useRouter } from "next/navigation";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppKey } from "@/types/Global";

const columns: IAppTableColumn[] = [
	{
		name: "Name",
		uid: "name",
		sortable: true,
	},
	{
		name: "Role",
		uid: "systemRole",
		sortable: true,
	},
	{
		name: "Email Verified",
		uid: "isEmailVerified",
	},
	{
		name: "Onboarded",
		uid: "createdAt",
		sortable: true,
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const UsersOverview = () => {
	const router = useRouter();
	const statusColorMap = {
		active: "success",
		inactive: "error",
		suspended: "warning",
		deleted: "error",
	};

	const rolesColorMap = {
		system_admin: "success",
		admin: "warning",
		company_admin: "primary",
		company_user: "secondary",
		guest: "default",
	};

	const renderCell = useCallback(
		(item: IUser, columnKey: AppKey) => {
			const value = item[columnKey as keyof IUser];
			switch (columnKey) {
				case "name":
					return (
						<User
							name={
								<Link href={`${AppEnumRoutes.APP_USER_PROFILE}/${item.id}`}>
									<CustomText className="text-teal-700 underline font-semibold">{value as string}</CustomText>
								</Link>
							}
							description={
								<div className="flex items-center">
									<CustomText className="text-gray-500">{item?.email ?? "None"}</CustomText>
									{" - "}{" "}
									<Chip size={"sm"} color={statusColorMap[item?.accountStatus ?? "active"] as "success" | "warning" | "default" | "primary" | "secondary" | "danger"}>
										<p className="text-white text-[10px]">{item?.accountStatus ?? "None"}</p>
									</Chip>
								</div>
							}
							avatarProps={{
								radius: "sm",
								name: value as string,
								getInitials: getInitials,
								color: getColorFromUserId(item.id) as "success" | "warning" | "default" | "primary" | "secondary" | "danger",
								size: "sm",
							}}>
							{item?.email ?? "None"}
						</User>
					);
				case "systemRole":
					return (
						<Chip color={rolesColorMap[value as string] as "success" | "warning" | "default" | "primary" | "secondary" | "danger"}>
							<CustomText className="capitalize">{String(value)?.split("_").join(" ")}</CustomText>
						</Chip>
					);
				case "isEmailVerified":
					return (
						<Chip color={value === true ? "success" : "warning"}>
							<CustomText>{value ? "Verified" : "Not Verified"}</CustomText>
						</Chip>
					);
				case "createdAt":
					return <CustomText>{format(new Date(value as string), "yyyy-MM-dd HH:mm")}</CustomText>;
				case "actions":
					return (
						<Dropdown>
							<DropdownTrigger>
								<Button variant="bordered" size="sm" isIconOnly color="primary">
									<LuMoreVertical />
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								variant="faded"
								aria-label="Actions Menu"
								itemClasses={{
									base: [
										"rounded-md",
										"text-default-500",
										"transition-opacity",
										"data-[hover=true]:text-foreground",
										"data-[hover=true]:bg-default-100",
										"dark:data-[hover=true]:bg-default-50",
										"data-[selectable=true]:focus:bg-default-50",
										"data-[pressed=true]:opacity-70",
										"data-[focus-visible=true]:ring-default-500",
									],
								}}>
								<DropdownItem key={"view"} className="text-sm" startContent={<UserIcon size={16} />} as={Link} href={`${AppEnumRoutes.APP_USER_PROFILE}/${item?.id}`}>
									View Profile
								</DropdownItem>
								<DropdownItem key={"edit"} startContent={<UserCog size={16} />}>
									Edit
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					);
				default:
					return null;
			}
		},
		[router]
	);
	const {
		data,
		isLoading,
		mutate,
		error: _,
	} = useSWR<IUser[]>([IApiEndpoint.GET_USERS], swrFetcher, {
		keepPreviousData: true,
	});

	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<UsersIcon size={16} />}>User Profiles</BreadcrumbItem>
			</Breadcrumbs>
			<div className="flex flex-col md:flex-row items-center justify-center md:justify-between mt-8 mb-8 md:mb-0">
				<h3 className="text-lg font-semibold">Users Overview</h3>
				<CustomStack direction="row" spacing={2}>
					<NewBtn text="New User" onClick={() => router.push(AppEnumRoutes.APP_USERS_NEW)} />
					<RefreshBtn isLoading={isLoading} refetch={mutate} />
				</CustomStack>
			</div>
			<AppTable<IUser> title="Users" data={data ?? []} count={data?.length ?? 0} headerColumns={columns} isLoading={isLoading} renderCell={renderCell} columnsToShowOnMobile={["name", "actions"]} />
		</AuthRedirectComponent>
	);
};

export default UsersOverview;
