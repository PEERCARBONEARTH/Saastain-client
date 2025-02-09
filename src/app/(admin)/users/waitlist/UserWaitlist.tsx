"use client";
import RefreshBtn from "@/components/btns/RefreshBtn";
import AddToWaitlist from "@/components/modals/AddToWaitlist";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { IWaitlist } from "@/types/Waitlist";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { Home } from "lucide-react";
import Head from "next/head";
import { useCallback } from "react";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { Key } from "@react-types/shared";
import CustomText from "@/components/typography/CustomText";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import WaitlistDetailsModal from "@/components/modals/WaitlistDetailsModal";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";

const columns: IAppTableColumn[] = [
	{
		name: "Name",
		uid: "name",
		sortable: true,
	},
	{
		name: "Company",
		uid: "companyName",
		sortable: true,
	},
	{
		name: "Email",
		uid: "email",
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

const UserWaitlist = () => {
	const renderCell = useCallback((item: IWaitlist, columnKey: Key) => {
		const value = item[columnKey as keyof IWaitlist];

		switch (columnKey) {
			case "name":
				return <CustomText>{value as string}</CustomText>;
			case "companyName":
				return <CustomText>{value as string}</CustomText>;
			case "email":
				return <CustomText>{value as string}</CustomText>;
			case "createdAt":
				return (
					<CustomText>
						{new Date(value as string).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
						})}
					</CustomText>
				);
			case "actions":
				return <WaitlistDetailsModal waitlist={item} />;
			default:
				return null;
		}
	}, []);

	const { data, isLoading, mutate } = useSWR<IWaitlist[]>([IApiEndpoint.WAITLIST], swrFetcher, { keepPreviousData: true });

	return (
		<AuthRedirectComponent>
			<Head>
				<title>Waitlist - SaaStain</title>
			</Head>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<HiOutlineOfficeBuilding size={16} />}>Waitlist</BreadcrumbItem>
			</Breadcrumbs>
			<div className="flex flex-col md:flex-row md:items-center md:justify-between my-8">
				<div className="space-y-2">
					<h1 className="text-2xl font-bold">All Waitlist</h1>
					<p className="text-sm text-gray-500 ">Below are a list of interested participants who are interested in joining SaaStain </p>
				</div>
				<div className="flex space-x-2 mt-4 md:mt-0">
					<AddToWaitlist refreshData={mutate} />
					<RefreshBtn isLoading={false} refetch={() => mutate()} />
				</div>
			</div>
			<AppTable<IWaitlist>
				title="Waitlist"
				data={data ?? []}
				headerColumns={columns}
				isLoading={isLoading}
				renderCell={renderCell}
				count={data?.length ?? 0}
				columnsToShowOnMobile={["name", "companyName", "actions"]}
			/>
		</AuthRedirectComponent>
	);
};

export default UserWaitlist;
