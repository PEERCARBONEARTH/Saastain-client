import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import { FaRegFileLines } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import { Key } from "@react-types/shared";
import CustomText from "@/components/typography/CustomText";
import { dummyDataList } from "@/data/dummy-data-list";
import { FaRegEdit } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";
import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/helpers";
import { months } from "@/data/months";
import Head from "next/head";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { IScopeOne } from "@/types/Accounting";
import { swrFetcher } from "@/lib/api-client";

const columns: IAppTableColumn[] = [
	{
		name: "Scope Sub Category",
		uid: "scope_sub_category",
	},
	{
		name: "Emission Amount",
		uid: "emission_amount",
	},
	{
		name: "Emission Percentage",
		uid: "emission_percentage",
	},
	{
		name: "Updated At",
		uid: "updated_at",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const DataList: NextPageWithLayout = () => {
	const { status, data: session } = useSession();
	const { didHydrate } = useDidHydrate();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const renderCell = useCallback((item, columnKey: Key) => {
		const value = item[columnKey];

		if (columnKey === "actions") {
			return (
				<div className="flex space-x-2">
					<Button size="sm" color="primary" endContent={<FaRegEdit className="w-4 h-4" />}>
						Edit
					</Button>
					<Button size="sm" color="danger" variant="bordered" endContent={<BsCheck2Circle className="w-4 h-4" />}>
						Verify
					</Button>
				</div>
			);
		}

		return <CustomText>{value}</CustomText>;
	}, []);

	const renderDataCell = useCallback((item: IScopeOne, columnKey: Key) => {
		const value = item[columnKey as keyof IScopeOne];
	}, []);

	const { data, error } = useSWR<IScopeOne[]>([IApiEndpoint.GET_SCOPE_ONE_DATA_COMPANY_WITH_FETCH_AND_PAGINATION, { companyId: account?.company?.id, page: page, limit: limit }], swrFetcher, { keepPreviousData: true });

	console.log(data, error);

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Accounting</BreadcrumbItem>
				<BreadcrumbItem>Data List</BreadcrumbItem>
			</Breadcrumbs>
			<Head>
				<title>Data List - SaaStain</title>
			</Head>
			<div className="my-4 flex flex-col md:flex-row items-start md:items-center justify-between">
				<h1 className="text-xl font-bold">All Carbon Entries</h1>
				<div className="space-x-2">
					<Button color="primary" startContent={<MdAdd className="w-4 h-4" />} size="sm">
						Add Data
					</Button>
					<Button color="primary" startContent={<FaRegFileLines className="w-4 h-4" />} size="sm">
						Export Data
					</Button>
				</div>
			</div>
			<div>
				<div className="flex my-4 space-y-4 md:space-x-3">
					<AppSelect label="Branch" placeholder="Filter By Branch" options={generateOptions(["Branch 1", "Branch 2", "Branch 3"])} baseClassName="md:max-w-[300px]" />
					<AppSelect label="Choose Year" placeholder="FY2024" options={generateOptions(["2019", "2020", "2021", "2022", "2023", "2024"])} baseClassName="md:max-w-[300px]" />
					<AppSelect label="Choose Month" placeholder="Filter By Month" options={generateOptions(months)} baseClassName="md:max-w-[300px]" />
					<AppSelect label="Scope" placeholder="Filter By Scope" options={generateOptions(["Scope 1", "Scope 2", "Scope 3"])} baseClassName="md:max-w-[300px]" />
				</div>
				<AppTable headerColumns={columns} renderCell={renderCell} data={dummyDataList} count={dummyDataList.length} title="Emissions" isLoading={false} showTopContent={false} />
			</div>
		</>
	);
};

DataList.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default DataList;
