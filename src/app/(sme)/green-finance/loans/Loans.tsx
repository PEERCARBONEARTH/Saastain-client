"use client";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { ILoanRequest, LoanStatus } from "@/types/LoanRequest";
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Tab, Tabs } from "@nextui-org/react";
import { useCallback, useMemo } from "react";
import { LuDownload } from "react-icons/lu";
import { Key } from "@react-types/shared";
import { format } from "date-fns";
import { capitalizeWords } from "@/utils";
import CustomText from "@/components/typography/CustomText";
import Link from "next/link";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { ChevronRight } from "lucide-react";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";


const columns: IAppTableColumn[] = [
	{
		name: "Product Name",
		uid: "product",
	},
	{
		name: "Loan ID",
		uid: "loanId",
	},
	{
		name: "Created At",
		uid: "createdAt",
	},
	{
		name: "Status",
		uid: "status",
	},
	{
		name: "Total",
		uid: "totalCost",
	},
];

const statusColorMap = {
	[LoanStatus.REJECTED]: "danger",
	[LoanStatus.APPLIED]: "success",
	[LoanStatus.IN_PROGRESS]: "warning",
	[LoanStatus.DRAFT]: "primary",
};

const approvedColumns: IAppTableColumn[] = [
	{
		name: "Product Name",
		uid: "product",
	},
	{
		name: "Loan ID",
		uid: "loanId",
	},
	{
		name: "Created At",
		uid: "createdAt",
	},
	{
		name: "Status",
		uid: "status",
	},
	{
		name: "Total",
		uid: "totalCost",
	},
];


const cancelledColumns: IAppTableColumn[] = [
	{
		name: "Product Name",
		uid: "productName",
	},
	{
		name: "Loan ID",
		uid: "loanId",
	},
	{
		name: "Created At",
		uid: "createdAt",
	},
	{
		name: "Status",
		uid: "status",
	},
	{
		name: "Total",
		uid: "totalCost",
	},
];

const Loans = () => {
	const { didHydrate } = useDidHydrate();
	const { data: session } = useSession();

	const account = useMemo(() => {
		if (didHydrate) {
			return session?.user;
		}

		return null;
	}, [session, didHydrate]);


	const { data: myloans, isLoading } = useSWR<ILoanRequest[]>([`${IApiEndpoint.GET_LOAN_APPLICATIONS}`], swrFetcher, { keepPreviousData: true });

	console.log(myloans)
	const approvedLoans = myloans ? myloans?.filter(loan => loan.status === LoanStatus.APPROVED ): []; 
	const rejectedLoans = myloans ? myloans?.filter(loan => loan.status === LoanStatus.REJECTED ): [];


	const renderLoanCell = useCallback((item: ILoanRequest, columnKey: Key) => {
		const value = item[columnKey as keyof ILoanRequest];

		switch (columnKey) {
			case "product":
				return <span className="text-gray-500">{capitalizeWords(String(item.product?.name).split("-").join(" "))}</span>;
			case "loanId":
				return <span className="text-gray-500">{capitalizeWords(String(item.id).split("-").join(" "))}</span>;
			case "createdAt":
				return <span>{format(new Date((item.createdAt) ?? 0), "dd/MM/yyyy") ?? "None"}</span>;
			case "totalCost":
				if (item.order && Array.isArray(item.order.quoteDetails)) {
					return (
						<span className="text-gray-500">
							${item.order.quoteDetails.map(detail => detail.totalCost).join(', ')}
						</span>
					);
				} else {
					return <span className="text-gray-500">N/A</span>;
				}
			case "status":
				return (
					// @ts-ignore
					<Chip color={statusColorMap[value as LoanStatus]}>
						<CustomText>{capitalizeWords(String(item.status).split("-").join(" "))}</CustomText>
					</Chip>
				);
			default:
				return null;
		}
	}, []);

	const renderApprovedLoanCell = useCallback((item: ILoanRequest, columnKey: Key) => {
		const value = item[columnKey as keyof ILoanRequest];

		switch (columnKey) {
			case "product":
				return <span className="text-gray-500">{capitalizeWords(String(item.product?.name).split("-").join(" "))}</span>;
			case "loanId":
				return <span className="text-gray-500">{capitalizeWords(String(item.id).split("-").join(" "))}</span>;
			case "createdAt":
				return <span>{format(new Date((item.createdAt) ?? 0), "dd/MM/yyyy") ?? "None"}</span>;
			case "totalCost":
				if (item.order && Array.isArray(item.order.quoteDetails)) {
					return (
						<span className="text-gray-500">
							${item.order.quoteDetails.map(detail => detail.totalCost).join(', ')}
						</span>
					);
				} else {
					return <span className="text-gray-500">N/A</span>;
				}
			case "status":
				return (
					// @ts-ignore
					<Chip color={statusColorMap[value as LoanStatus]}>
						<CustomText>{capitalizeWords(String(item.status).split("-").join(" "))}</CustomText>
					</Chip>
				);
			default:
				return null;
		}
	}, []);

	const renderCancelledLoanCell = useCallback((item: ILoanRequest, columnKey: Key) => {
		const value = item[columnKey as keyof ILoanRequest];

		switch (columnKey) {
			case "product":
				return <span className="text-gray-500">{capitalizeWords(String(item.product?.name).split("-").join(" "))}</span>;
			case "loanId":
				return <span className="text-gray-500">{capitalizeWords(String(item.id).split("-").join(" "))}</span>;
			case "createdAt":
				return <span>{format(new Date((item.createdAt) ?? 0), "dd/MM/yyyy") ?? "None"}</span>;
			case "totalCost":
				if (item.order && Array.isArray(item.order.quoteDetails)) {
					return (
						<span className="text-gray-500">
							${item.order.quoteDetails.map(detail => detail.totalCost).join(', ')}
						</span>
					);
				} else {
					return <span className="text-gray-500">N/A</span>;
				}
			case "status":
				return (
					// @ts-ignore
					<Chip color={statusColorMap[value as LoanStatus]}>
						<CustomText>{capitalizeWords(String(item.status).split("-").join(" "))}</CustomText>
					</Chip>
				);
			default:
				return null;
		}
	}, []);



	return (
		<AuthRedirectComponent>
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
							<AppTable<ILoanRequest> title="Loans" count={myloans?.length ?? 0} data={myloans ?? []} headerColumns={columns} isLoading={isLoading} renderCell={renderLoanCell} />
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
							<AppTable<ILoanRequest>
								title="Loans"
								data={approvedLoans}
								headerColumns={approvedColumns}
								isLoading={false}
								count={approvedLoans.length}
								renderCell={renderApprovedLoanCell}
							/>
						</div>
					</Tab>
					<Tab key={"rejected"} title="Rejected Loans">
						<div className="my-4 flex items-center justify-between">
							<h3 className="font-bold">Rejected Loans</h3>
							<Button color="primary" startContent={<LuDownload />}>
								Download
							</Button>
						</div>
						<div className="">
							<AppTable<ILoanRequest>
								title="Loans"
								data={rejectedLoans}
								headerColumns={cancelledColumns}
								isLoading={false}
								count={rejectedLoans.length}
								renderCell={renderCancelledLoanCell}
							/>
						</div>
					</Tab>
				</Tabs>
			</div>
		</AuthRedirectComponent>
	);
};

export default Loans;
