"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import AppBtn from "@/components/btns/AppBtn";
import NewBtn from "@/components/btns/NewBtn";
import RefreshBtn from "@/components/btns/RefreshBtn";
import CustomStack from "@/components/stack/CustomStack";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import CustomText from "@/components/typography/CustomText";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { ICompany } from "@/types/Company";
import { getColorFromUserId, getInitials } from "@/utils";
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Link, User } from "@nextui-org/react";
import { format } from "date-fns";
import { Home, Building2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Key, useCallback } from "react";
import useSWR from "swr";

const columns: IAppTableColumn[] = [
	{
		name: "Name",
		uid: "companyName",
		sortable: true,
	},
	{
		name: "Location",
		uid: "location",
		sortable: true,
	},
	{
		name: "Industry",
		uid: "industry",
		sortable: true,
	},
	{
		name: "Created On",
		uid: "createdAt",
		sortable: true,
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const Companies = () => {
	const router = useRouter();
	const renderCell = useCallback(
		(item: ICompany, columnKey: Key) => {
			const value = item[columnKey as keyof ICompany];
			switch (columnKey) {
				case "companyName":
					return (
						<User
							name={
								<Link href={`${AppEnumRoutes.APP_COMPANY_PROFILE}/${item.id}`}>
									<CustomText className="text-teal-700 underline font-semibold">{value as string}</CustomText>
								</Link>
							}
							description={
								<div className="flex items-center">
									<CustomText className="text-gray-500">{item?.primaryEmail ?? "None"}</CustomText>
								</div>
							}
							avatarProps={{
								radius: "sm",
								name: value as string,
								getInitials: getInitials,
								color: getColorFromUserId(item.id) as "success" | "warning" | "default" | "primary" | "secondary" | "danger",
								size: "sm",
							}}>
							{item?.primaryEmail ?? "None"}
						</User>
					);
				case "location":
					return (
						<Chip color={"default"}>
							<CustomText className="capitalize">{value as string}</CustomText>
						</Chip>
					);
				case "industry":
					return <CustomText className="capitalize">{(value as string) ?? "None"}</CustomText>;
				case "createdAt":
					return <CustomText>{format(new Date((value as string) ?? 0), "yyyy-MM-dd HH:mm") ?? "None"}</CustomText>;
				case "actions":
					return <AppBtn text="View" endIcon={<ChevronRight size={18} />} onClick={() => router.push(`${AppEnumRoutes.APP_COMPANY_PROFILE}/${item.id}`)} />;
				default:
					return null;
			}
		},
		[router]
	);

	const { data, isLoading, mutate, error: _ } = useSWR<ICompany[]>([IApiEndpoint.GET_COMPANIES], swrFetcher, { keepPreviousData: true });

	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<Building2 size={16} />}>Companies</BreadcrumbItem>
			</Breadcrumbs>
			<div className="flex flex-col my-8 space-y-2">
				<h3 className="text-lg font-semibold">All Companies</h3>
				<p className="text-gray-600">This is a list of all companies using SaaStain system</p>
			</div>
			<div className="flex items-center justify-center  md:justify-end mb-4 md:mb-0">
				<CustomStack direction="row" spacing={2}>
					<NewBtn text="New Company" onClick={() => router.push(AppEnumRoutes.APP_COMPANIES_NEW)} />
					<Button color="primary" size="sm" as={Link} href={"/companies/invite"}>
						Invite Company
					</Button>
					<RefreshBtn isLoading={isLoading} refetch={mutate} />
				</CustomStack>
			</div>
			<AppTable<ICompany> title="Companies" data={data ?? []} headerColumns={columns} isLoading={isLoading} renderCell={renderCell} count={data?.length ?? 0} columnsToShowOnMobile={["companyName", "actions"]} />
		</AuthRedirectComponent>
	);
};

export default Companies;
