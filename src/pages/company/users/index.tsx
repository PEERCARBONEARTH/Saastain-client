import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { IUser } from "@/types/User";
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Tab, Tabs, Tooltip, User } from "@nextui-org/react";
import { Trash2, UserCog, UserIcon, UserMinus, UserPlus } from "lucide-react";
import Head from "next/head";
import { Key } from "@react-types/shared";
import { useCallback } from "react";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import CustomText from "@/components/typography/CustomText";
import { getColorFromUserId, getInitials } from "@/utils";
import { format } from "date-fns";
import { LuMoreVertical } from "react-icons/lu";
import { dummyUserInvites, dummyUsers } from "@/data/dummy-users-list";
import InviteNewUserModal from "@/components/modals/InviteNewUserModal";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";

const columns: IAppTableColumn[] = [
	{
		name: "Name",
		uid: "name",
		sortable: true,
	},
	{
		name: "Date",
		uid: "createdAt",
	},
	{
		name: "Role",
		uid: "systemRole",
	},
	{
		name: "Status",
		uid: "accountStatus",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const invitesColumns: IAppTableColumn[] = [
	{
		name: "Name",
		uid: "name",
		sortable: true,
	},
	{
		name: "Date",
		uid: "createdAt",
		sortable: true,
	},
	{
		name: "Role",
		uid: "role",
	},
	{
		name: "Status",
		uid: "status",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

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

const inviteStatusColorMap = {
	pending: "warning",
	accepted: "success",
	rejected: "danger",
};

const inviteRoleColorMap = {
	data_entry: "warning",
	manager: "primary",
	admin: "success",
};

const Users: NextPageWithLayout = () => {
	const renderUserCell = useCallback((item: Partial<IUser>, columnKey: Key) => {
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
			case "createdAt":
				return <CustomText>{format(new Date((value as string) ?? 0), "yyyy-MM-dd HH:mm") ?? "None"}</CustomText>;
			case "systemRole":
				return (
					<Chip color={rolesColorMap[value as string] as "success" | "warning" | "default" | "primary" | "secondary" | "danger"}>
						<CustomText className="capitalize">{String(value)?.split("_").join(" ")}</CustomText>
					</Chip>
				);
			case "accountStatus":
				return (
					<Chip size={"sm"} color={statusColorMap[item?.accountStatus ?? "active"] as "success" | "warning" | "default" | "primary" | "secondary" | "danger"}>
						<p className="text-white text-[10px]">{item?.accountStatus ?? "None"}</p>
					</Chip>
				);
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
							<DropdownItem key={"edit"} startContent={<UserMinus size={16} />}>
								Remove
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				);
			default:
				return null;
		}
	}, []);

	const renderInviteCell = useCallback((item: any, columnKey: Key) => {
		const value = item[columnKey];

		switch (columnKey) {
			case "name":
				return (
					<User
						name={<CustomText className="font-semibold">{value as string}</CustomText>}
						description={
							<div className="flex items-center">
								<CustomText className="text-gray-500">{item?.email ?? "None"}</CustomText>
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
			case "createdAt":
				return <CustomText>{format(new Date((value as string) ?? 0), "yyyy-MM-dd HH:mm") ?? "None"}</CustomText>;
			case "role":
				return (
					<Chip color={inviteRoleColorMap[value as string] as "success" | "warning" | "default" | "primary" | "secondary" | "danger"}>
						<CustomText className="capitalize">{String(value)?.split("_").join(" ")}</CustomText>
					</Chip>
				);
			case "status":
				return (
					<Chip color={inviteStatusColorMap[value as string] as "success" | "warning" | "default" | "primary" | "secondary" | "danger"}>
						<CustomText className="capitalize">{String(value)?.split("_").join(" ")}</CustomText>
					</Chip>
				);
			case "actions":
				return (
					<Tooltip content="Revoke Invite" placement="right">
						<Button size="sm" color="danger" isIconOnly variant="bordered">
							<Trash2 size={16} />
						</Button>
					</Tooltip>
				);
			default:
				return null;
		}
	}, []);

	return (
		<AuthRedirectComponent>
			<Head>
				<title>Users - SaaStain</title>
			</Head>
			<Breadcrumbs>
				<BreadcrumbItem>Company</BreadcrumbItem>
				<BreadcrumbItem>Users</BreadcrumbItem>
			</Breadcrumbs>
			<Tabs variant="underlined" aria-label="Company Profile tabs" className="mt-8" color="primary">
				<Tab key={"company-users"} title={<h2 className="text-sm font-semibold">Company Users</h2>}>
					<div className="flex items-center justify-between my-5">
						<h2 className="text-lg font-bold">Team Members</h2>
						<InviteNewUserModal />
					</div>
					{/* @ts-ignore */}
					<AppTable<Partial<IUser>> data={dummyUsers} headerColumns={columns} count={dummyUsers.length} renderCell={renderUserCell} isLoading={false} title="Company Users" />
				</Tab>
				<Tab key={"invites"} title={<h2 className="text-sm font-semibold">Invites</h2>}>
					<h2 className="text-lg font-bold">Invites Sent</h2>
					<div className="my-4">
						<AppTable data={dummyUserInvites} headerColumns={invitesColumns} count={dummyUserInvites.length} renderCell={renderInviteCell} isLoading={false} title="Invites" />
					</div>
				</Tab>
			</Tabs>
		</AuthRedirectComponent>
	);
};

Users.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Users;
