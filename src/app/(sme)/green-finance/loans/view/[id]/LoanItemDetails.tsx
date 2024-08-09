"use client";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Spacer, Switch, Tab, Tabs } from "@nextui-org/react";
import { CheckCircle2Icon } from "lucide-react";
import dynamic from "next/dynamic";
import { LuDownload } from "react-icons/lu";
import CustomText from "@/components/typography/CustomText";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { FC, useCallback } from "react";
import { Key } from "@react-types/shared";
import { format } from "date-fns";
import { dummyLoanStatements } from "@/data/loan-statements-data";

const LoanReportDonutChart = dynamic(() => import("@/components/charts/LoanReportDonutChart"), { ssr: false });

const columns: IAppTableColumn[] = [
	{
		name: "Date",
		uid: "date",
	},
	{
		name: "Type",
		uid: "type",
	},
	{
		name: "Credit",
		uid: "total",
	},
];

interface IDummyLoanStatement {

}

interface IProps {
	id: string;
}

const LoanItemDetails: FC<IProps> = ({ id }) => {
	const renderLoanStatementCell = useCallback((item: IDummyLoanStatement, columnKey: Key) => {
		const value = item[columnKey as keyof IDummyLoanStatement];

		switch (columnKey) {
			case "type":
				return <span className="text-gray-500">{value}</span>;
			case "date":
				return <span>{format(new Date((value as string) ?? 0), "dd/MM/yyyy") ?? "None"}</span>;
			case "total":
				return <span className="text-gray-500">$ {value}</span>;
			default:
				return null;
		}
	}, []);
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_LOAN_REQUESTS}>Loans</BreadcrumbItem>
				<BreadcrumbItem>Loan Report</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-10">
				<Tabs aria-label="Loan Reports" color="primary" variant="underlined">
					<Tab key="your-report" title={"Your Loan Report"}>
						<div className="container mt-5">
							<h3 className="text-lg font-bold">My Loan Report</h3>
							<Spacer y={4} />
							<div className="px-4 py-5 border border-gray-300 rounded-xl">
								<div className="flex justify-evenly">
									<div className="flex flex-col items-center space-y-2">
										<h3 className="text-sm font-semibold">Maturity</h3>
										<h1 className="text-2xl font-bold">$ 3191.64</h1>
										<div className="flex items-center space-x-2">
											<CheckCircle2Icon size={16} className="text-gray-500" />
											<p className="text-sm">Sufficient Balance</p>
										</div>
									</div>
									<Divider orientation="vertical" className="h-[100px]" />
									<div className="flex flex-col items-center space-y-2">
										<h3 className="text-sm font-semibold">Payment Due Date</h3>
										<h1 className="text-2xl font-bold">March 24th</h1>
										<div className="flex items-center space-x-2">
											<CheckCircle2Icon size={16} className="text-gray-500" />
											<p className="text-sm">in 10 days</p>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-12">
								<h3 className="text-lg font-bold">Reimbursement Tracking</h3>
								<div className="my-2">
									<div className="px-3 md:px-10 py-10 bg-[#DEF7EC] border-green-100 border rounded-xl">
										<div className="flex justify-evenly flex-col md:flex-row space-y-20 md:space-y-0">
											<div className="">
												<LoanReportDonutChart />
												<div className="flex items-center space-x-2 justify-center">
													<div className="flex items-center space-x-2">
														<div className="w-5 h-5 rounded-full bg-primary"></div>
														<p className="text-sm">Total Remaining</p>
													</div>
													<div className="flex items-center space-x-2">
														<div className="w-5 h-5 rounded-full bg-primary-grey"></div>
														<p className="text-sm">Total Refunded</p>
													</div>
												</div>
											</div>
											<Divider orientation="vertical" className="hidden md:block h-auto bg-primary" />
											<div className="w-full md:w-[50%] md:pl-10">
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<p className="text-sm text-gray-500 font-semibold">Amount Repaid</p>
														<p className="font-bold text-gray-600">$481.20</p>
													</div>
													<div className="space-y-2">
														<p className="text-sm text-gray-500 font-semibold">Amount Remaining to be paid</p>
														<p className="font-bold text-gray-600">$481.20</p>
													</div>
												</div>
												<Divider className="my-4 bg-gray-400" />
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<p className="text-sm text-gray-500 font-semibold">Interest Repaid</p>
														<p className="font-bold text-gray-600">$481.20</p>
													</div>
													<div className="space-y-2">
														<p className="text-sm text-gray-500 font-semibold">Interest Remaining to be paid</p>
														<p className="font-bold text-gray-600">$481.20</p>
													</div>
												</div>
												<Divider className="my-4 bg-gray-400" />
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<p className="text-sm text-gray-500 font-semibold">Months Paid</p>
														<p className="font-bold text-gray-600">10</p>
													</div>
													<div className="space-y-2">
														<p className="text-sm text-gray-500 font-semibold">Months Unpaid</p>
														<p className="font-bold text-gray-600">32</p>
													</div>
												</div>
												<Divider className="my-4 bg-gray-400" />
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-12">
								<h3 className="text-lg font-bold">Financing Details</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mt-5">
									<div className="">
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<p className="text-sm text-gray-500 font-semibold">Type of Financing</p>
												<p className="font-bold text-gray-600">Clean Cooking Finance</p>
											</div>
											<div className="space-y-2">
												<p className="text-sm text-gray-500 font-semibold">Amount Borrowed</p>
												<p className="font-bold text-gray-600">$481.20</p>
											</div>
										</div>
										<Divider className="my-4 bg-gray-400" />
									</div>
									<div className="">
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<p className="text-sm text-gray-500 font-semibold">Date of Signature</p>
												<p className="font-bold text-gray-600">Feb 24, 2024</p>
											</div>
											<div className="space-y-2">
												<p className="text-sm text-gray-500 font-semibold">Duration</p>
												<p className="font-bold text-gray-600">24 Months</p>
											</div>
										</div>
										<Divider className="my-4 bg-gray-400" />
									</div>
									<div className="">
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<p className="text-sm text-gray-500 font-semibold">Start Date</p>
												<p className="font-bold text-gray-600">Feb 14, 2024</p>
											</div>
											<div className="space-y-2">
												<p className="text-sm text-gray-500 font-semibold">End Date</p>
												<p className="font-bold text-gray-600">Feb 14, 2025</p>
											</div>
										</div>
										<Divider className="my-4 bg-gray-400" />
									</div>
									<div className="">
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<p className="text-sm text-gray-500 font-semibold">Loan Agreement</p>
												<Button size="sm" color="primary" variant={"flat"} endContent={<LuDownload />}>
													Download
												</Button>
											</div>
											<div className="space-y-2">
												<p className="text-sm text-gray-500 font-semibold">Status</p>
												<Chip size="sm" color="success" variant="flat">
													<CustomText className="text-gray-800">Ongoing (14%)</CustomText>
												</Chip>
											</div>
										</div>
										<Divider className="my-4 bg-gray-400" />
									</div>
								</div>
							</div>
						</div>
					</Tab>
					<Tab key={"loan-statement"} title={"Loan Statements"}>
						<div className="container mt-5">
							<div className="grid grid-cols-1 md:grid-cols-8 gap-4">
								<div className="col-auto md:col-span-6">
									<div className="flex items-center justify-between gap-x-10 gap-y-5">
										<h2 className="text-lg font-bold">Loan Statements</h2>
										<Button color="primary" startContent={<LuDownload className="w-5 h-5" />}>
											Download
										</Button>
									</div>
									<div className="mt-10 h-full">
										<AppTable<any>
											title="Loan Statements"
											data={dummyLoanStatements}
											headerColumns={columns}
											isLoading={false}
											count={0}
											renderCell={renderLoanStatementCell}
											columnsToShowOnMobile={["date", "total"]}
											showTopContent={false}
											showBottomContent={true}
										/>
									</div>
								</div>
								<div className="col-auto md:col-span-2">
									<div className="flex flex-col items-center justify-center space-y-10">
										<Card className="w-full px-5">
											<CardHeader className="text-primary font-bold text-xl">What's due ?</CardHeader>
											<CardBody className="space-y-6">
												<div className="space-x-4 flex items-center">
													<h3 className="text-primary font-medium">Next Payment:</h3>
													<span className="text-gray-500">$555.00</span>
												</div>
												<div className="space-x-4 flex items-center">
													<h3 className="text-primary font-medium">Due Date:</h3>
													<span className="text-gray-500">Dec 24, 2024</span>
												</div>
											</CardBody>
											<CardFooter>
												<Button className="w-full" color="primary">
													Pay Now
												</Button>
											</CardFooter>
										</Card>
										<Card className="w-full px-5">
											<CardHeader className="text-primary font-bold text-xl">Payment Method</CardHeader>
											<CardBody className="">
												<div className="space-y-4 border border-gray-300 text-center mb-4 px-4 py-5">
													<p className="font-medium">Sidian Bank</p>
													<h2 className="text-sm">****9312 Default</h2>
													<div className="flex items-center justify-between">
														<p className="font-light ">Recurring Payments</p>
														<Switch defaultSelected aria-label="Recurring Payments" />
													</div>
												</div>
												<div className="flex items-center justify-center">
													<Button color="primary" variant="light">
														Add Payment Method
													</Button>
												</div>
											</CardBody>
											<CardFooter>
												<Button className="w-full" color="primary">
													Pay Now
												</Button>
											</CardFooter>
										</Card>
									</div>
								</div>
							</div>
						</div>
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

export default LoanItemDetails;
