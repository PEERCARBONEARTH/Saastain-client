import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { BreadcrumbItem, Breadcrumbs, Button, Chip } from "@nextui-org/react";
import Head from "next/head";
import { useCallback } from "react";
import { Key } from "@react-types/shared";
import CustomText from "@/components/typography/CustomText";
import { annualReports } from "@/data/annual-reports-dummy";
import GenerateReportModal from "@/components/modals/GenerateReportModal";

const columns: IAppTableColumn[] = [
	{
		name: "ID",
		uid: "uniqueId",
	},
	{
		name: "Type of Report",
		uid: "typeOfReport",
	},
	{
		name: "Scope",
		uid: "scope",
	},
	{
		name: "Date",
		uid: "createdAt",
	},
	{
		name: "Who Generated",
		uid: "generatedBy",
	},
];

type ReportData = (typeof columns)[0] & (typeof columns)[1] & (typeof columns)[2] & (typeof columns)[3] & (typeof columns)[4] & { uniqueId: string };

const EmissionReports: NextPageWithLayout = () => {
	const renderCell = useCallback((item: ReportData, columnKey: Key) => {
		const value = item[columnKey];

		switch (columnKey) {
			case "uniqueId":
				return <CustomText>{value}</CustomText>;
			case "typeOfReport":
				return (
					<Chip color="primary">
						<CustomText>{value}</CustomText>
					</Chip>
				);
			case "scope":
				return (
					<Chip color="success">
						<CustomText>{value}</CustomText>
					</Chip>
				);
			case "createdAt":
				return <CustomText>{value}</CustomText>;
			case "generatedBy":
				return <CustomText>{value}</CustomText>;
			default:
				return null;
		}
	}, []);

	return (
		<>
			<Head>
				<title>Emission Reports - SaaStain</title>
			</Head>
			<Breadcrumbs>
				<BreadcrumbItem>Reports</BreadcrumbItem>
				<BreadcrumbItem>Annual Reports</BreadcrumbItem>
			</Breadcrumbs>
			<div className="my-8 flex items-center justify-between">
				<h1 className="text-xl font-bold">Annual Reports</h1>
				<GenerateReportModal />
			</div>
			<AppTable<ReportData> headerColumns={columns} data={annualReports as any} renderCell={renderCell} count={annualReports.length} title="Annual Reports" isLoading={false} />
		</>
	);
};

EmissionReports.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default EmissionReports;
