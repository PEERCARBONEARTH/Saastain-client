"use client";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { BreadcrumbItem, Breadcrumbs, Button, Tab, Tabs } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import { FaRegFileLines } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import { Key } from "@react-types/shared";
import CustomText from "@/components/typography/CustomText";
import { FaRegEdit } from "react-icons/fa";
import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/helpers";
import { months } from "@/data/months";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { IScopeOne, IScopeOneFleet, IScopeOneFuels, IScopeOneFugitiveEmission, IScopeOneProcessEmission, IScopeTwo, ScopeOneComponentKeys, ScopeTwoCategory } from "@/types/Accounting";
import { swrFetcher } from "@/lib/api-client";
import { format } from "date-fns";
import { mapMonthToNumber } from "@/utils";
import { useRouter } from "next/navigation";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";

const scopeOneColumns: IAppTableColumn[] = [
	{
		name: "Sub Category",
		uid: "category",
	},
	{
		name: "Emission Amount (KgC02e)",
		uid: "emissionAmount",
		sortable: true,
	},
	{
		name: "Entry Date",
		uid: "entryDate",
	},
	{
		name: "Updated On",
		uid: "updatedAt",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const scopeTwoColumns: IAppTableColumn[] = [
	{
		name: "Category",
		uid: "category",
	},
	{
		name: "Total Emissions (KgC02e)",
		uid: "emissionAmount",
	},
	{
		name: "Entry Date",
		uid: "entryDate",
	},
	{
		name: "Updated At",
		uid: "updatedAt",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const prepareFilters = (year: string, month: number | string, subCategory: string) => {
	// "year:2020,month:1,scope:scopeOne,subCategory:electricity"

	const filters = [];

	if (year) {
		filters.push(`year:${year}`);
	}

	if (month) {
		filters.push(`month:${month}`);
	}

	if (subCategory) {
		filters.push(`subCategory:${encodeURIComponent(subCategory)}`);
	}

	return filters.join(",");
};

const prepareScopeTwoFilters = (year: string, month: number | string, category: string) => {
	const filters = [];

	if (year) {
		filters.push(`year:${year}`);
	}

	if (month) {
		filters.push(`month:${month}`);
	}

	if (category) {
		filters.push(`category:${category}`);
	}

	return filters.join(",");
};

const prepareScopeOneData = (data: IScopeOne) => {
	// using the scopeOneComponentKeys to get the data and check which key is not null

	const itemKeys = Object.keys(data);

	const scopeOneComponentKeys = Object.values(ScopeOneComponentKeys);

	const filteredKeys = itemKeys.filter((key) => scopeOneComponentKeys.includes(key as ScopeOneComponentKeys));

	const checkIfNull = (key: string) => {
		return data[key as ScopeOneComponentKeys] !== null;
	};

	const filteredData = filteredKeys.filter(checkIfNull);
	const nonNullKey = filteredData[0];

	// for ScopeOneComponentKeys.FUELS we need to get the c02KgEmitted
	// for ScopeOneComponentKeys.FLEET we need to get the c02KgEmitted
	// for ScopeOneComponentKeys.PROCESS_EMISSION we need to get the gasAmount
	// for ScopeOneComponentKeys.FUGITIVE_EMISSION we need to get the gasEmitted

	// so we can use the whichKey to create a new object with the data we need

	const info = data?.[nonNullKey as ScopeOneComponentKeys];

	let emissionAmount = 0;
	switch (nonNullKey) {
		case ScopeOneComponentKeys.FUELS:
		case ScopeOneComponentKeys.FLEET:
			emissionAmount = (info as IScopeOneFuels | IScopeOneFleet).c02KgEmitted;
			break;
		case ScopeOneComponentKeys.PROCESS_EMISSION:
			emissionAmount = (info as IScopeOneProcessEmission).gasAmount;
			break;
		case ScopeOneComponentKeys.FUGITIVE_EMISSION:
			emissionAmount = (info as IScopeOneFugitiveEmission).gasEmitted;
			break;
	}

	return {
		category: data?.category,
		entryDate: data?.date,
		emissionAmount,
		updatedAt: info?.updatedAt,
		scopeId: data?.id,
		itemId: info?.id,
		key: nonNullKey,
	};
};

const AppDataList = () => {
	const { status, data: session } = useSession();
	const { didHydrate } = useDidHydrate();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [year, setYear] = useState<string>("");
	const [month, setMonth] = useState<string>("");
	const [subCategory, setSubCategory] = useState<string>("");

	const [scopeTwoPage, setScopeTwoPage] = useState<number>(1);
	const [scopeTwoLimit, setScopeTwoLimit] = useState<number>(10);
	const [scopeTwoYear, setScopeTwoYear] = useState<string>("");
	const [scopeTwoMonth, setScopeTwoMonth] = useState<string>("");
	const [scopeTwoCategory, setScopeTwoCategory] = useState<string>("");

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const router = useRouter();

	const renderDataCell = useCallback((item: IScopeOne, columnKey: Key) => {
		const preparedValue = prepareScopeOneData(item);

		switch (columnKey) {
			case "category":
				return <CustomText>{preparedValue.category}</CustomText>;
			case "emissionAmount":
				return <CustomText>{preparedValue.emissionAmount}</CustomText>;
			case "entryDate":
				return <CustomText>{format(preparedValue.entryDate ? new Date(preparedValue.entryDate) : new Date(), "PP")}</CustomText>;
			case "updatedAt":
				return <CustomText>{format(preparedValue.updatedAt ? new Date(preparedValue.updatedAt) : new Date(), "PPpp")}</CustomText>;
			case "actions":
				return (
					<div className="flex space-x-2">
						<Button size="sm" color="primary" endContent={<FaRegEdit className="w-4 h-4" />}>
							Edit
						</Button>
					</div>
				);
			default:
				return null;
		}
	}, []);

	const renderScopeTwoDataCell = useCallback((item: IScopeTwo, columnKey: Key) => {
		switch (columnKey) {
			case "category":
				return <CustomText>{item.category}</CustomText>;
			case "emissionAmount":
				return <CustomText>{item.scopeTwoElectricity.totalEmissions}</CustomText>;
			case "entryDate":
				return <CustomText>{format(new Date(item?.date), "PP")}</CustomText>;
			case "updatedAt":
				return <CustomText>{format(new Date(item?.scopeTwoElectricity?.updatedAt), "PPpp")}</CustomText>;
			case "actions":
				return (
					<div className="flex space-x-2">
						<Button size="sm" color="primary" endContent={<FaRegEdit className="w-4 h-4" />}>
							Edit
						</Button>
					</div>
				);
			default:
				return null;
		}
	}, []);

	const resetFilters = () => {
		setYear("");
		setMonth("");
		setSubCategory("");
	};

	const { data, isLoading } = useSWR<{ results: IScopeOne[]; count: number }>(
		[IApiEndpoint.GET_SCOPE_ONE_DATA_COMPANY_WITH_FETCH_AND_PAGINATION, { companyId: account?.company?.id, page: page, limit: limit, filters: prepareFilters(year, mapMonthToNumber(month), "") }],
		swrFetcher,
		{ keepPreviousData: true }
	);

	const { data: scopeTwoData, isLoading: loadingScopeTwo } = useSWR<{ results: IScopeTwo[]; count: number }>(
		[
			IApiEndpoint.GET_SCOPE_TWO_DATA_COMPANY_WITH_FETCH_AND_PAGINATION,
			{ companyId: account?.company?.id, page: scopeTwoPage, limit: scopeTwoLimit, filters: prepareScopeTwoFilters(scopeTwoYear, mapMonthToNumber(scopeTwoMonth), scopeTwoCategory) },
		],
		swrFetcher,
		{ keepPreviousData: true }
	);

	console.log(prepareFilters(year, mapMonthToNumber(month), ""));

	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem>Accounting</BreadcrumbItem>
				<BreadcrumbItem>Data List</BreadcrumbItem>
			</Breadcrumbs>
			<div className="my-4 flex flex-col md:flex-row items-start md:items-center justify-between">
				<h1 className="text-xl font-bold">All Carbon Entries</h1>
				<div className="space-x-2">
					<Button color="primary" startContent={<MdAdd className="w-4 h-4" />} size="sm" onClick={() => router.push(AppEnumRoutes.APP_ADD_DATA)}>
						Add Data
					</Button>
					<Button color="primary" startContent={<FaRegFileLines className="w-4 h-4" />} size="sm">
						Export Data
					</Button>
				</div>
			</div>
			<div>
				<Tabs aria-label="Scopes Data List" color="primary" variant="underlined">
					<Tab key="scope-one" title="Scope 1">
						<div className="flex my-4 space-y-4 md:space-x-3">
							<AppSelect
								label="Choose Year"
								placeholder="FY2024"
								options={generateOptions(["2019", "2020", "2021", "2022", "2023", "2024"].reverse())}
								baseClassName="md:max-w-[300px]"
								value={year}
								onChange={(e) => setYear(e.target.value)}
							/>
							<AppSelect label="Choose Month" placeholder="Filter By Month" options={generateOptions(months)} baseClassName="md:max-w-[300px]" value={month} onChange={(e) => setMonth(e.target.value)} />
							{/* <AppSelect
								label="Sub Category"
								placeholder="Select Sub Category"
								options={generateOptions(Object.values(ScopeOneCategory))}
								baseClassName="md:max-w-[300px]"
								value={subCategory}
								onChange={(e) => setSubCategory(e.target.value)}
							/>
							<Button color="danger" onClick={resetFilters} variant="bordered" startContent={<TrashIcon className="w-5 h-5" />}>
								Reset Filters
							</Button> */}
						</div>
						<AppTable<IScopeOne>
							title="Scope Data"
							headerColumns={scopeOneColumns}
							data={data?.results ?? []}
							renderCell={renderDataCell}
							currentPage={page}
							onCurrentPageChange={setPage}
							rowsPerPage={limit}
							onRowsPerPageChange={setLimit}
							isLoading={isLoading}
							count={data?.count ?? 0}
							showTopContent={false}
							columnsToShowOnMobile={["category", "emissionAmount", "actions"]}
						/>
					</Tab>
					<Tab key="scope-to" title="Scope 2">
						<div className="flex my-4 space-y-4 md:space-x-3">
							<AppSelect
								label="Choose Year"
								placeholder="FY2024"
								options={generateOptions(["2019", "2020", "2021", "2022", "2023", "2024"].reverse())}
								baseClassName="md:max-w-[300px]"
								value={scopeTwoYear}
								onChange={(e) => setScopeTwoYear(e.target.value)}
							/>
							<AppSelect
								label="Choose Month"
								placeholder="Filter By Month"
								options={generateOptions(months)}
								baseClassName="md:max-w-[300px]"
								value={scopeTwoMonth}
								onChange={(e) => setScopeTwoMonth(e.target.value)}
							/>
							<AppSelect
								label="Category"
								placeholder="Select Category"
								options={generateOptions(Object.values(ScopeTwoCategory))}
								baseClassName="md:max-w-[300px]"
								value={scopeTwoCategory}
								onChange={(e) => setScopeTwoCategory(e.target.value)}
							/>
							{/* <Button color="danger" onClick={resetFilters} variant="bordered" startContent={<TrashIcon className="w-5 h-5" />}>
								Reset Filters
							</Button> */}
						</div>
						<AppTable<IScopeTwo>
							title="Scope Data"
							headerColumns={scopeTwoColumns}
							data={scopeTwoData?.results ?? []}
							renderCell={renderScopeTwoDataCell}
							currentPage={scopeTwoPage}
							onCurrentPageChange={setScopeTwoPage}
							rowsPerPage={scopeTwoLimit}
							onRowsPerPageChange={setScopeTwoLimit}
							isLoading={loadingScopeTwo}
							count={scopeTwoData?.count ?? 0}
							showTopContent={false}
							columnsToShowOnMobile={["category", "emissionAmount", "actions"]}
						/>
					</Tab>
				</Tabs>
			</div>
		</AuthRedirectComponent>
	);
};

export default AppDataList;
