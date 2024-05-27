import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { IDummyLoanRequest, LoanStatus } from "@/types/LoanRequest";
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Tab, Tabs } from "@nextui-org/react";
import Head from "next/head";
import { useCallback } from "react";
import { LuDownload } from "react-icons/lu";
import { Key } from "@react-types/shared";
import { format } from "date-fns";
import { dummyLoanRequestsData } from "@/data/loan-requests-data";
import { capitalize, capitalizeWords } from "@/utils";
import CustomText from "@/components/typography/CustomText";
import Link from "next/link";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { ChevronRight } from "lucide-react";

const columns: IAppTableColumn[] = [
	{
		name: "Loan Type",
		uid: "loanType",
	},
	{
		name: "Start Date",
		uid: "startDate",
	},
	{
		name: "End Date",
		uid: "endDate",
	},
	{
		name: "Total",
		uid: "total",
	},
	{
		name: "Status",
		uid: "status",
	},
];

const statusColorMap = {
	[LoanStatus.Cancelled]: "danger",
	[LoanStatus.Completed]: "success",
	[LoanStatus.InProgress]: "warning",
	[LoanStatus.Pending]: "primary",
};

const approvedColumns: IAppTableColumn[] = [
	{
		name: "Loan Type",
		uid: "loanType",
	},
	{
		name: "Start Date",
		uid: "startDate",
	},
	{
		name: "End Date",
		uid: "endDate",
	},
	{
		name: "Total",
		uid: "total",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const cancelledColumns: IAppTableColumn[] = [
	{
		name: "Loan Type",
		uid: "loanType",
	},
	{
		name: "Start Date",
		uid: "startDate",
	},
	{
		name: "End Date",
		uid: "endDate",
	},
	{
		name: "Total",
		uid: "total",
	},
];

const LoanRequests: NextPageWithLayout = () => {
	const renderLoanCell = useCallback((item: IDummyLoanRequest, columnKey: Key) => {
		const value = item[columnKey as keyof IDummyLoanRequest];

		switch (columnKey) {
			case "loanType":
				return <span className="text-gray-500">{capitalizeWords(String(value).split("-").join(" "))}</span>;
			case "startDate":
				return <span>{format(new Date((value as string) ?? 0), "dd/MM/yyyy") ?? "None"}</span>;
			case "endDate":
				return <span>{format(new Date((value as string) ?? 0), "dd/MM/yyyy") ?? "None"}</span>;
			case "total":
				return <span className="text-gray-500">$ {value}</span>;
			case "status":
				return (
					// @ts-ignore
					<Chip color={statusColorMap[value as LoanStatus]}>
						<CustomText>{capitalizeWords(String(value).split("-").join(" "))}</CustomText>
					</Chip>
				);
			default:
				return null;
		}
	}, []);

	const renderApprovedLoanCell = useCallback((item: IDummyLoanRequest, columnKey: Key) => {
		const value = item[columnKey as keyof IDummyLoanRequest];

		switch (columnKey) {
			case "loanType":
				return <span className="text-gray-500">{capitalizeWords(String(value).split("-").join(" "))}</span>;
			case "startDate":
				return <span>{format(new Date((value as string) ?? 0), "dd/MM/yyyy") ?? "None"}</span>;
			case "endDate":
				return <span>{format(new Date((value as string) ?? 0), "dd/MM/yyyy") ?? "None"}</span>;
			case "total":
				return <span className="text-gray-500">$ {value}</span>;
			case "actions":
				return (
					<Button as={Link} href={`${AppEnumRoutes.APP_LOAN_REQUESTS_VIEW}/${item.id}`} endContent={<ChevronRight />} color="primary" size="sm">
						View
					</Button>
				);
			default:
				return null;
		}
	}, []);

	const renderCancelledLoanCell = useCallback((item: IDummyLoanRequest, columnKey: Key) => {
		const value = item[columnKey as keyof IDummyLoanRequest];

		switch (columnKey) {
			case "loanType":
				return <span className="text-gray-500">{capitalizeWords(String(value).split("-").join(" "))}</span>;
			case "startDate":
				return <span>{format(new Date((value as string) ?? 0), "dd/MM/yyyy") ?? "None"}</span>;
			case "endDate":
				return <span>{format(new Date((value as string) ?? 0), "dd/MM/yyyy") ?? "None"}</span>;
			case "total":
				return <span className="text-gray-500">$ {value}</span>;
			default:
				return null;
		}
	}, []);

	return (
		<>
			<Head>
				<title>Loan Requests - SaaStain</title>
			</Head>
			<Breadcrumbs>
				<BreadcrumbItem>Loans</BreadcrumbItem>
				<BreadcrumbItem>Loan Requests</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-10 w-full">
				<Tabs aria-label="Loan Requests" color="primary" variant="underlined">
					<Tab key={"all"} title="All Your Loan Request">
						<div className="my-4 flex items-center justify-between">
							<h3 className="font-bold">Loan Requests</h3>
							<Button color="primary" startContent={<LuDownload />}>
								Download
							</Button>
						</div>
						<div className="">
							<AppTable<IDummyLoanRequest> title="Loans" data={dummyLoanRequestsData} headerColumns={columns} isLoading={false} count={dummyLoanRequestsData.length} renderCell={renderLoanCell} />
						</div>
					</Tab>
					<Tab key={"approved"} title="Approved Loans">
						<div className="my-4 flex items-center justify-between">
							<h3 className="font-bold">Approved Loans</h3>
							<Button color="primary" startContent={<LuDownload />}>
								Download
							</Button>
						</div>
						<div className="">
							<AppTable<IDummyLoanRequest>
								title="Loans"
								data={dummyLoanRequestsData}
								headerColumns={approvedColumns}
								isLoading={false}
								count={dummyLoanRequestsData.length}
								renderCell={renderApprovedLoanCell}
							/>
						</div>
					</Tab>
					<Tab key={"cancelled"} title="Cancelled Loans">
						<div className="my-4 flex items-center justify-between">
							<h3 className="font-bold">Cancelled Loans</h3>
							<Button color="primary" startContent={<LuDownload />}>
								Download
							</Button>
						</div>
						<div className="">
							<AppTable<IDummyLoanRequest>
								title="Loans"
								data={dummyLoanRequestsData}
								headerColumns={cancelledColumns}
								isLoading={false}
								count={dummyLoanRequestsData.length}
								renderCell={renderCancelledLoanCell}
							/>
						</div>
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

LoanRequests.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default LoanRequests;
