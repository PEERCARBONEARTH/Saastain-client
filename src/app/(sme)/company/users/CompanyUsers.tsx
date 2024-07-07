"use client";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { IUser } from "@/types/User";
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Tab, Tabs, Tooltip, User } from "@nextui-org/react";
import { Trash2, UserCog, UserIcon, UserMinus } from "lucide-react";
import { Key } from "@react-types/shared";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import CustomText from "@/components/typography/CustomText";
import { getColorFromUserId, getInitials } from "@/utils";
import { format } from "date-fns";
import { LuMoreVertical } from "react-icons/lu";
import InviteNewUserModal from "@/components/modals/InviteNewUserModal";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { IInvite } from "@/types/Invite";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useSession } from "next-auth/react";
import AppIconCopyBtn from "@/components/buttons/AppIconCopyBtn";
import useInviteUtils from "@/hooks/useInviteUtils";
import toast from "react-hot-toast";

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

const CompanyUsers = () => {
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);

	const [userPage, setUserPage] = useState<number>(1);
	const [userLimit, setUserLimit] = useState<number>(10);
	const [search, setSearch] = useState<string>("");

	const { revokeInvite } = useInviteUtils();

	const deferredSearch = useDeferredValue(search);

	const { didHydrate } = useDidHydrate();
	const { data: session, status } = useSession();

	const userInfo = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const handleRevokeInvite = useCallback(async (inviteCode: string) => {
		try {
			const response = await revokeInvite(inviteCode);
			if (response.status === "success") {
				toast.success("Invite revoked successfully");
			} else {
				toast.error(response.msg);
			}
		} catch (error) {
			toast.error("An error occurred while revoking the invite", error);
		}
	}, []);

	const generateLink = (itemCode: string) => {
		const appDomain = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}`;

		return `${appDomain}/${AppEnumRoutes.APP_COMPANY_USER_ACCEPT_INVITE}?code=${itemCode}`;
	};

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

	const renderInviteCell = useCallback((item: IInvite, columnKey: Key) => {
		switch (columnKey) {
			case "name":
				return (
					<User
						name={<CustomText className="font-semibold">{item?.name ?? "None"}</CustomText>}
						description={
							<div className="flex items-center">
								<CustomText className="text-gray-500">{item?.email ?? "None"}</CustomText>
							</div>
						}
						avatarProps={{
							radius: "sm",
							name: item?.name ?? "None",
							getInitials: getInitials,
							color: getColorFromUserId(item.id) as "success" | "warning" | "default" | "primary" | "secondary" | "danger",
							size: "sm",
						}}>
						{item?.email ?? "None"}
					</User>
				);
			case "createdAt":
				return <CustomText>{format(new Date((item?.createdAt as string) ?? 0), "yyyy-MM-dd HH:mm") ?? "None"}</CustomText>;
			case "role":
				return (
					<Chip color={inviteRoleColorMap[item?.userRole as string] as "success" | "warning" | "default" | "primary" | "secondary" | "danger"}>
						<CustomText className="capitalize">{String(item?.userRole)?.split("_").join(" ")}</CustomText>
					</Chip>
				);
			case "status":
				return (
					<Chip color={inviteStatusColorMap[item?.status as string] as "success" | "warning" | "default" | "primary" | "secondary" | "danger"}>
						<CustomText className="capitalize">{String(item?.status)?.split("_").join(" ")}</CustomText>
					</Chip>
				);
			case "actions":
				return (
					<div className="flex items-center space-x-2">
						<Tooltip content="Copy Invite Link" placement="top">
							<AppIconCopyBtn link={generateLink(item?.inviteCode as string)} />
						</Tooltip>
						<Tooltip content="Revoke Invite" placement="right">
							<Button size="sm" color="danger" isIconOnly variant="bordered" onClick={() => handleRevokeInvite(item?.inviteCode as string)}>
								<Trash2 size={16} />
							</Button>
						</Tooltip>
					</div>
				);
			default:
				return null;
		}
	}, []);

	const { data, isLoading } = useSWR<{ results: IInvite[]; count: number }>([IApiEndpoint.INVITES_COMPANY_PAGINATED, { page, limit, id: userInfo?.company?.id }], swrFetcher, { keepPreviousData: true });

	const { data: usersData, isLoading: loadingUsers } = useSWR<{ results: IUser[]; count: number }>(
		[IApiEndpoint.GET_COMPANY_USERS_PAGINATED, { page: userPage, limit: userLimit, id: userInfo?.company?.id, search: deferredSearch }],
		swrFetcher,
		{
			keepPreviousData: true,
		}
	);

	return (
		<AuthRedirectComponent>
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
					<AppTable<IUser>
						title="Users"
						data={usersData?.results ?? []}
						count={usersData?.count ?? 0}
						renderCell={renderUserCell}
						headerColumns={columns}
						isLoading={loadingUsers}
						currentPage={userPage}
						onCurrentPageChange={setUserPage}
						rowsPerPage={userLimit}
						onRowsPerPageChange={setUserLimit}
						emptyContent="No users found."
						searchValue={search}
						onSearch={setSearch}
						searchPlaceholder="Search by name or email"
						columnsToShowOnMobile={["name", "actions"]}
					/>
				</Tab>
				<Tab key={"invites"} title={<h2 className="text-sm font-semibold">Invites</h2>}>
					<h2 className="text-lg font-bold">Invites Sent</h2>
					<div className="my-4">
						<AppTable<IInvite>
							title="Invites"
							data={data?.results ?? []}
							count={data?.count ?? 0}
							renderCell={renderInviteCell}
							headerColumns={invitesColumns}
							isLoading={isLoading}
							currentPage={page}
							onCurrentPageChange={setPage}
							rowsPerPage={limit}
							onRowsPerPageChange={setLimit}
							emptyContent="No invites sent yet."
						/>
					</div>
				</Tab>
			</Tabs>
		</AuthRedirectComponent>
	);
};

export default CompanyUsers;
