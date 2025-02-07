"use client";
import { Breadcrumbs, BreadcrumbItem, Chip, Divider, Card, CardHeader, CardBody, CardFooter, Button, Spinner, Tabs, Tab, User } from "@heroui/react";
import { AlertTriangleIcon, ChevronRight, CloudIcon, Home, ScrollTextIcon, SettingsIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { FiEdit3 } from "react-icons/fi";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { useCallback, useMemo, useState } from "react";
import { loansData } from "@/data/loans";
import { Key } from "@react-types/shared";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import { CompanyStatus, ICompany } from "@/types/Company";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import RefreshBtn from "@/components/btns/RefreshBtn";
import { getColorFromUserId, getInitials } from "@/utils";
import { AccountStatus, IUser } from "@/types/User";
import Link from "next/link";
import CustomText from "@/components/typography/CustomText";
import AppBtn from "@/components/btns/AppBtn";
import AddNewCompanyUser from "@/components/modals/AddNewCompanyUser";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { useRouter } from "next/navigation";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { ScopeDataKeys, TScopeOneDataTotals, TScopeTwoDataTotals } from "@/types/AccoutingAnalytics";
import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/helpers";
import { HiBriefcase, HiOutlineUserGroup } from "react-icons/hi";
import CompanyConfigTab from "./CompanyConfigTab";
import CompanyAuthLogsTab from "./CompanyAuthLogsTab";
import RemoveCompanyDialog from "./RemoveCompanyDialog";
import ActivateCompanyDialog from "./ActivateCompanyDialog";

const DonutChart = dynamic(() => import("./CompanyScopeDonutChart"), { ssr: false });

interface ProfileContentTextProps {
	title: string;
	description: string;
}

const columns: IAppTableColumn[] = [
	{
		name: "ID",
		uid: "loanId",
		sortable: true,
	},
	{
		name: "Title",
		uid: "loanTitle",
		sortable: true,
	},
	{
		name: "Description",
		uid: "description",
	},
	{
		name: "Date",
		uid: "date",
		sortable: true,
	},
];

const userColumns: IAppTableColumn[] = [
	{
		name: "Name",
		uid: "name",
		sortable: true,
	},
	{
		name: "Account Status",
		uid: "accountStatus",
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

const generateTags = (tagString: string) => {
	return tagString.split(",").map((tag) => tag.trim());
};

const statusColorMap = {
	active: "success",
	inactive: "error",
	suspended: "warning",
	deleted: "error",
};

const accountStatusColorMap = {
	[AccountStatus.ACTIVE]: "success",
	[AccountStatus.INACTIVE]: "default",
	[AccountStatus.SUSPENDED]: "warning",
	[AccountStatus.DELETED]: "danger",
};

interface CompanyProfileProps {
	id: string;
}

const CompanyProfile = ({ id }: CompanyProfileProps) => {
	const router = useRouter();
	const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

	const { data: scopeOneTotals } = useSWR<TScopeOneDataTotals>(!id ? null : [IApiEndpoint.GET_TOTAL_SCOPE_ONE_DATA_BY_YEAR_BY_ADMIN, { year: selectedYear, companyId: id }], swrFetcher, { keepPreviousData: true });
	const { data: scopeTwoTotals } = useSWR<TScopeTwoDataTotals>(!id ? null : [IApiEndpoint.GET_TOTAL_SCOPE_TWO_DATA_BY_YEAR_BY_ADMIN, { year: selectedYear, companyId: id }], swrFetcher, { keepPreviousData: true });

	const totalScopeOne = useMemo(() => {
		if (scopeOneTotals === undefined) return 0;

		const { bioEnergy, fuels, fugitive, processEmission, fleet } = scopeOneTotals[ScopeDataKeys.CURRENT_YEAR];

		let total = Number(bioEnergy) + Number(fuels) + Number(fugitive) + Number(processEmission) + Number(fleet);

		// ensure to  3 decimal places
		return Number(total.toFixed(3));
	}, [scopeOneTotals]);

	const totalScopeTwo = useMemo(() => {
		if (scopeTwoTotals === undefined) return 0;
		const { electricityTotal, heatAndSteamTotal } = scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR];

		let total = electricityTotal + heatAndSteamTotal;

		// ensure to  3 decimal places
		return Number(total.toFixed(3));
	}, [scopeTwoTotals]);

	const renderCell = useCallback((item: any, columnKey: Key) => {
		const value = item[columnKey as keyof any];

		switch (columnKey) {
			case "loanId":
				return <span className="text-sm text-gray-600">{value}</span>;
			case "loanTitle":
				return <span className="text-sm text-gray-600">{value}</span>;
			case "description":
				return <span className="text-sm text-gray-600">{value}</span>;
			case "date":
				return <span className="text-sm text-gray-600">{value}</span>;
			default:
				return null;
		}
	}, []);

	const renderUserCell = useCallback((item: IUser, columnKey: Key) => {
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
			case "accountStatus":
				return (
					<Chip className="capitalize" color={accountStatusColorMap[value as AccountStatus] as "success" | "warning" | "default" | "primary" | "secondary" | "danger"}>
						{(value as string) ?? "None"}
					</Chip>
				);
			case "createdAt":
				return (
					<CustomText>
						{new Date(value as string).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</CustomText>
				);
			case "actions":
				return <AppBtn text="View" endContent={<ChevronRight className="w-4 h-5" />} onPress={() => router.push(`${AppEnumRoutes.APP_USER_PROFILE}/${item?.id}`)} />;
			default:
				return null;
		}
	}, []);

	const { data, isLoading, error, mutate } = useSWR<ICompany>(!id ? null : [IApiEndpoint.GET_COMPANY, { id }], swrFetcher, { keepPreviousData: true });

	const { data: users, isLoading: loadingUsers, mutate: refetchUsers } = useSWR<IUser[]>(!id ? null : [IApiEndpoint.GET_COMPANY_USERS, { id }], swrFetcher, { keepPreviousData: true });

	return (
		<AuthRedirectComponent>
			{isLoading && (
				<div className="h-96 flex items-center justify-center">
					<Spinner />
					<span className="ml-2">Loading Profile Information...</span>
				</div>
			)}
			{error && (
				<Alert variant="destructive">
					<AlertTriangleIcon className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						<p>There was an error fetching the company details. Please try again later.</p>
					</AlertDescription>
				</Alert>
			)}
			{data && (
				<>
					<div className="flex items-center justify-between">
						<Breadcrumbs>
							<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
								Home
							</BreadcrumbItem>
							<BreadcrumbItem>Company Details</BreadcrumbItem>
						</Breadcrumbs>
						<RefreshBtn isLoading={isLoading} refetch={() => mutate()} />
					</div>
					<div className="container mt-4 md:mt-12 mb-8">
						<div className="w-full flex items-center justify-between">
							<div className="flex gap-2 md:gap-4 flex-wrap">
								{generateTags(data?.industry ?? "Agriculture, Education, Mining, Finance").map((tag, index) => (
									<Chip key={index} color={getColorFromUserId(tag) as any}>
										{tag}
									</Chip>
								))}
							</div>
							<AppSelect
								label="Choose a year"
								options={generateOptions(["2021", "2022", "2023", "2024", "2025"].reverse())}
								baseClassName="md:max-w-[300px]"
								placeholder="FY2024"
								value={selectedYear}
								onChange={(e) => setSelectedYear(e.target.value)}
							/>
						</div>
						<div className="my-6">
							<h1 className="text-3xl font-bold mt-4">
								{data?.companyName ?? "Indiana Tech"} <span className="text-xl font-normal">- Company Profile</span>
							</h1>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-8 gap-2">
							<div className="md:col-span-6">
								<div className="flex w-full justify-between">
									<div>
										<h4 className="md:hidden text-xl font-semibold mb-2">Description</h4>
										<p>
											{data?.description ??
												"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
										</p>
										<h1 className="text-2xl font-semibold mt-4">Scope Break Down</h1>
										<div className="flex flex-col md:flex-row mt-6">
											{!scopeOneTotals || !scopeTwoTotals ? <p>Loading...</p> : <DonutChart dataSeries={[Number(totalScopeOne) ?? 0, Number(totalScopeTwo) ?? 0, 0]} />}
											<div className="space-y-8">
												<div className="flex space-x-8">
													<Divider orientation="vertical" className="h-auto bg-[#5E896E] w-2" />
													<div className="space-y-4">
														<p className="text-[#A7B3A7] text-[14px]">Scope 1 - Direct Emissions</p>
														<p className="text-[#374151] font-bold text-[30px]">
															{totalScopeOne} <span className="text-sm">kgCO2</span>
														</p>
													</div>
												</div>
												<div className="flex space-x-8">
													<Divider orientation="vertical" className="h-auto bg-[#CFA16C] w-2" />
													<div className="space-y-4">
														<p className="text-[#A7B3A7] text-[14px]">Scope 2 - Indirect Emissions</p>
														<p className="text-[#374151] font-bold text-[30px]">
															{totalScopeTwo} <span className="text-sm">kgCO2</span>
														</p>
													</div>
												</div>
												<div className="flex space-x-8">
													<Divider orientation="vertical" className="h-auto bg-[#014737] w-2" />
													<div className="space-y-4">
														<p className="text-[#014737] text-[14px]">Scope 3 - Other Indirect Emissions</p>
														<p className="text-[#374151] font-bold text-[30px]">
															0 <span className="text-sm">kgCO2</span>
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
									<Divider orientation="vertical" className="h-auto bg-gray-900" />
								</div>
							</div>

							<div className="order-first md:order-last md:col-span-2 md:px-2">
								<Card className="px-4 py-2 shadow-md bg-inherit">
									<CardHeader>
										<h3 className="text-xl font-semibold">Company Summary</h3>
									</CardHeader>
									<CardBody>
										<ProfileContentText title="Company Name" description={data?.companyName ?? "Indiana Tech"} />
										<ProfileContentText title="Company Email" description={data?.primaryEmail ?? "indianatech@gmail.com"} />
										<ProfileContentText title="Company Phone" description={data?.phoneNo ?? "+254 712 345 678"} />
										<ProfileContentText title="Location" description={data?.location ?? "Nairobi, Kenya"} />
										<ProfileContentText title="Website" description={data?.website ?? "https://indianatech.com"} />
										<ProfileContentText title="Subscription Status" description="Active" />
										<ProfileContentText title="Company Status" description={data?.companyStatus ?? "Active"} />
									</CardBody>
									<CardFooter className="space-x-3">
										<Button color="primary" endContent={<FiEdit3 />} as={Link} href={`${AppEnumRoutes.APP_COMPANY_EDIT_PROFILE}/${id}`}>
											Edit
										</Button>
										{data?.companyStatus === CompanyStatus.ACTIVE && <RemoveCompanyDialog companyId={id} companyName={data?.companyName} mutate={mutate} />}
									</CardFooter>
								</Card>
							</div>
						</div>
						{data?.companyStatus !== CompanyStatus.ACTIVE && (
							<div className="mt-5">
								<Alert variant="destructive">
									<AlertTriangleIcon className="h-4 w-4" />
									<AlertTitle className="font-bold">Company Action</AlertTitle>
									<AlertDescription className="space-y-2">
										<p>
											This company has been marked as <span className="font-bold text-danger">{data?.companyStatus}</span> and cannot be accessed by users on SaaStain Platform.
										</p>
										<div className="flex items-center gap-2">
											<p>To make it accessible, click</p>
											<ActivateCompanyDialog companyId={id} companyName={data?.companyName} mutate={mutate} />
										</div>
										<div className="flex items-center gap-2">
											<p>Or to permanently remove it, click</p>
											<Button size="sm" color="danger">
												Remove Permanently
											</Button>
										</div>
									</AlertDescription>
								</Alert>
							</div>
						)}

						<div className="my-10">
							<Tabs aria-label="Company Profile Tabs" variant="bordered" color="primary">
								<Tab
									key={"users"}
									title={
										<div className="flex items-center gap-x-2">
											<HiOutlineUserGroup className="w-5 h-5" />
											<span>Users</span>
										</div>
									}>
									<div className="flex items-center justify-between">
										<h1 className="text-xl font-semibold mt-4">Company Users</h1>
										<AddNewCompanyUser companyId={id} refreshData={refetchUsers} />
									</div>
									<div className="mt-4">
										<AppTable<IUser>
											title="Company Users"
											headerColumns={userColumns}
											data={users ?? []}
											renderCell={renderUserCell}
											count={users?.length ?? 0}
											isLoading={loadingUsers}
											showTopContent={false}
											showBottomContent={false}
											columnsToShowOnMobile={["name", "actions"]}
										/>
									</div>
								</Tab>
								<Tab
									key={"config"}
									title={
										<div className="flex items-center gap-x-2">
											<SettingsIcon className="w-5 h-5" />
											<span>Configuration</span>
										</div>
									}>
									<CompanyConfigTab companyId={id} />
								</Tab>
								<Tab
									key={"auth-logs"}
									title={
										<div className="flex items-center gap-x-2">
											<ScrollTextIcon className="w-5 h-5" />
											<span>Auth Logs</span>
										</div>
									}>
									<CompanyAuthLogsTab companyId={id} />
								</Tab>
								<Tab
									key={"vehicle-emissions"}
									title={
										<div className="flex items-center gap-x-2">
											<CloudIcon className="w-5 h-5" />
											<span>Upload Vehicle Emissions</span>
										</div>
									}>
									<h1 className="text-2xl font-semibold mt-4">Upload Vehicle Emissions</h1>
									<div className="mt-4">
										<AppTable<any>
											title="Loan Requests"
											headerColumns={columns}
											data={loansData}
											renderCell={renderCell}
											count={loansData.length}
											isLoading={false}
											showTopContent={false}
											showBottomContent={false}
											columnsToShowOnMobile={["loanTitle", "date"]}
										/>
									</div>
								</Tab>
								<Tab
									key={"loans"}
									title={
										<div className="flex items-center gap-x-2">
											<HiBriefcase className="w-5 h-5" />
											<span>Loans</span>
										</div>
									}>
									<h1 className="text-2xl font-semibold mt-4">Loan Request Applications</h1>
									<div className="mt-4">
										<AppTable<any>
											title="Loan Requests"
											headerColumns={columns}
											data={loansData}
											renderCell={renderCell}
											count={loansData.length}
											isLoading={false}
											showTopContent={false}
											showBottomContent={false}
											columnsToShowOnMobile={["loanTitle", "date"]}
										/>
									</div>
								</Tab>
							</Tabs>
						</div>
					</div>
				</>
			)}
		</AuthRedirectComponent>
	);
};

const ProfileContentText = ({ title, description }: ProfileContentTextProps) => {
	return (
		<div className="flex flex-col my-1 space-y-1">
			<h3 className="text-md font-medium">{title}:</h3>
			<p className="text-sm text-gray-600">{description}</p>
		</div>
	);
};

export default CompanyProfile;
