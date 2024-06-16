"use client";
import UploadExcelSheetModal from "@/components/modals/UploadExcelSheetModal";
import AppEditableCell from "@/components/table/editable-table/AppEditableCell";
import AppEditableTable from "@/components/table/editable-table/AppEditableTable";
import AppEditableTableActionBtns from "@/components/table/editable-table/AppEditableTableActionBtns";
import { generateOptions } from "@/helpers";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IOption } from "@/types/Forms";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Tabs, Tab } from "@nextui-org/react";
import { Table } from "@tanstack/react-table";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { Key } from "@react-types/shared";
import toast from "react-hot-toast";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { format } from "date-fns";
import { FiEdit3 } from "react-icons/fi";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useRouter } from "next/navigation";

const isRenewableOptions = ["Yes", "No"];

interface IBulkElectricityData {
	date: Date;
	country: string;
	emissionSource: string;
	isRenewable: string;
	units: string;
	amount: number;
}

interface IBulkElectricityDataWithTotalEmissions extends IBulkElectricityData {
	totalEmissions: number;
	id: string;
}

const eastAfricanCountries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia", "Burundi"];

const previewDataColumns: IAppTableColumn[] = [
	{
		name: "Date",
		uid: "date",
		sortable: true,
	},
	{
		name: "Country",
		uid: "country",
		sortable: true,
	},
	{
		name: "Emission Source",
		uid: "emissionSource",
		sortable: true,
	},
	{
		name: "Is Renewable",
		uid: "isRenewable",
		sortable: true,
	},
	{
		name: "Units",
		uid: "units",
		sortable: true,
	},
	{
		name: "Amount",
		uid: "amount",
		sortable: true,
	},
	{
		name: "Total Emissions",
		uid: "totalEmissions",
		sortable: true,
	},
];

const BulkAddElectricityData = () => {
	const [editedRows, setEditedRows] = useState<Record<string, IBulkElectricityData>>({}); // { [rowId]: boolean }
	const [validRows, setValidRows] = useState<Record<string, IBulkElectricityData>>({}); // { [rowId]: [x: string]: boolean }
	const [data, setData] = useState<IBulkElectricityData[]>([]);
	const [customOptions, setCustomOptions] = useState<Record<string, Record<string, IOption[]>>>({});
	const [selectedTab, setSelectedTab] = useState<Key>("add-data");
	const [dataWithEmissions, setDataWithEmissions] = useState<IBulkElectricityDataWithTotalEmissions[]>([]);
	const [loadingComputeBtn, setLoadingComputeBtn] = useState<boolean>(false);
	const [computedEmissions, setComputedEmissions] = useState<number>(0);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const { queryElectricityInfo, saveBulkElectricityData } = useAccountingDataUtils();

	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();
	const router = useRouter();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	async function loadEmissionSources<T = any>(table: Table<T>, rowId: string) {
		const tableMeta = table.options.meta;
		try {
			const resp = await queryElectricityInfo({});
			if (resp.status === "success") {
				const info = resp.data as string[];
				if (Array.isArray(info)) {
					const options = generateOptions(info);

					tableMeta?.updateCustomOptions(rowId, "emissionSource", options);
				}
			}
		} catch (error) {
			console.error("Error loading emission sources", error);
		}
	}

	const bulkElectricityColumnHelper = createColumnHelper<IBulkElectricityData>();

	const bulkColumns: ColumnDef<IBulkElectricityData, any>[] = [
		bulkElectricityColumnHelper.accessor("date", {
			header: "Date",
			// @ts-expect-error
			cell: AppEditableCell<IBulkElectricityData>,
			meta: {
				data: {
					type: "datepicker",
					validate(val) {
						if (!val) {
							return { valid: false, error: "Pick a Date" };
						}

						return { valid: true, error: null };
					},
				},
			},
		}),
		bulkElectricityColumnHelper.accessor("country", {
			header: "Country",
			cell: AppEditableCell<IBulkElectricityData>,
			meta: {
				data: {
					type: "select",
					options: generateOptions(eastAfricanCountries),
					validate(val) {
						if (!val || val === "") {
							return {
								valid: false,
								error: "Please select country",
							};
						}

						return { valid: true, error: null };
					},
					placeholder: "Choose country",
					async onActionSelect(table, row, ...args) {
						const tableMeta = table?.options?.meta!;

						const currentCountry = row.getValue("country");
						const currentEmissionSource = row.getValue("emissionSource");

						if (!currentCountry || !currentEmissionSource) return;

						try {
							const resp = await queryElectricityInfo({ country: currentCountry, EmissionSource: currentEmissionSource });

							if (resp.status === "success") {
								const info = resp.data as {
									EmissionSource: string;
									country: string;
									factors: number;
									isRenewable: boolean;
									unit: string;
								}[];

								// load a unique list of units
								const units = info.map((item) => item.unit);
								const uniqueUnits = [...new Set(units)];
								const options = generateOptions(uniqueUnits);

								tableMeta?.updateCustomOptions(row.id, "units", options);
							}
						} catch (err) {}
					},
				},
			},
		}),
		bulkElectricityColumnHelper.accessor("emissionSource", {
			header: "Emission Source",
			cell: AppEditableCell<IBulkElectricityData>,
			meta: {
				data: {
					type: "select",
					options: [],
					validate(val) {
						if (!val || val === "") {
							return {
								valid: false,
								error: "Choose emission source",
							};
						}

						return { valid: true, error: null };
					},
					placeholder: "Choose Source of Emission",
					async onActionSelect(table, row, ...args) {
						const tableMeta = table?.options?.meta!;

						const currentCountry = row.getValue("country");
						const currentEmissionSource = row.getValue("emissionSource");

						if (!currentCountry || !currentEmissionSource) return;

						try {
							const resp = await queryElectricityInfo({ country: currentCountry, EmissionSource: currentEmissionSource });

							if (resp.status === "success") {
								const info = resp.data as {
									EmissionSource: string;
									country: string;
									factors: number;
									isRenewable: boolean;
									unit: string;
								}[];

								// load a unique list of units
								const units = info.map((item) => item.unit);
								const uniqueUnits = [...new Set(units)];
								const options = generateOptions(uniqueUnits);

								tableMeta?.updateCustomOptions(row.id, "units", options);
							}
						} catch (err) {}
					},
				},
			},
		}),
		bulkElectricityColumnHelper.accessor("isRenewable", {
			header: "Is Source Renewable",
			cell: AppEditableCell<IBulkElectricityData>,
			meta: {
				data: {
					type: "select",
					options: generateOptions(isRenewableOptions),
					validate(val) {
						if (!val || val === "") {
							return {
								valid: false,
								error: "Choose if its renewable or not",
							};
						}

						return { valid: true, error: null };
					},
					placeholder: "Choose ...",
				},
			},
		}),
		bulkElectricityColumnHelper.accessor("units", {
			header: "Units",
			cell: AppEditableCell<IBulkElectricityData>,
			meta: {
				data: {
					type: "select",
					options: [],
					validate(val) {
						if (!val || val === "") {
							return {
								valid: false,
								error: "Please select a unit",
							};
						}

						return { valid: true, error: null };
					},
					placeholder: "Choose ...",
				},
			},
		}),
		bulkElectricityColumnHelper.accessor("amount", {
			header: "Amount of Emissions",
			// @ts-expect-error
			cell: AppEditableCell<IBulkElectricityData>,
			meta: {
				data: {
					type: "number",
					validate(val) {
						const adm = typeof val === "string" ? parseInt(val) : parseInt(String(val));

						if (!adm) {
							return { valid: false, error: "Please enter the amount of emissions" };
						}

						return { valid: true, error: null };
					},
					placeholder: "e.g. 5425",
				},
			},
		}),
		bulkElectricityColumnHelper.display({
			id: "actions",
			header: "Actions",
			cell: AppEditableTableActionBtns<IBulkElectricityData>,
		}),
	];

	const onTabChange = (keys: Set<Key>) => {
		setSelectedTab(keys.values().next().value);
	};

	const getTotalEmissions = async ({ EmissionSource, country, unit, value, isRenewable }: { EmissionSource: string; country: string; unit: string; value: number; isRenewable: boolean }) => {
		try {
			const resp = await queryElectricityInfo({ EmissionSource, country, unit, value, isRenewable });

			if (resp.status === "success") {
				const info = resp.data as { totalEmissions: number; _id: null }[];
				const zeroArr = info?.[0];

				if (zeroArr) {
					const c02Value = zeroArr?.totalEmissions;
					return c02Value;
				}

				return 0;
			}

			return 0;
		} catch (err) {
			console.error("Error getting total emissions", err);
			return 0;
		}
	};

	const onClickCalculateTotalEmissions = () => {
		// compare valid rows and data to alert user only valid rows will be calculated
		const validRowsKeys = Object.keys(validRows);

		if (validRowsKeys.length === 0) {
			toast.error("No valid rows to calculate emissions");
			return;
		}

		// if the size of valid rows is equal to the size of data, then all rows are valid
		// if the size of valid rows is less than the size of data, then some rows are valid - tell user

		if (validRowsKeys.length < data.length) {
			toast.error("Some rows are invalid and will not be calculated");
		}

		setLoadingComputeBtn(true);

		// pick only valid rows and remove object keys that are not in the validRows object
		const validData = data
			.filter((row, idx) => validRows[`${idx}`])
			.map((row) => {
				const { date, country, emissionSource, isRenewable, units, amount } = row;

				return {
					date,
					country,
					emissionSource,
					isRenewable,
					units,
					amount,
				};
			});

		// calculate total emissions for each row
		const emissionsPromises = validData.map((row) => getTotalEmissions({ EmissionSource: row.emissionSource, country: row.country, unit: row.units, value: row.amount, isRenewable: row.isRenewable === "Yes" }));

		Promise.all(emissionsPromises)
			.then((emissions) => {
				const dataWithEmissions = validData.map((row, idx) => {
					return {
						...row,
						totalEmissions: emissions[idx],
						id: `${idx}`,
					};
				});

				// set computed emissions
				const totalEmissions = dataWithEmissions.reduce((acc, item) => acc + item.totalEmissions, 0);

				setDataWithEmissions(dataWithEmissions);
				setComputedEmissions(totalEmissions);

				setLoadingComputeBtn(false);

				// set selected tab to preview
				onTabChange(new Set(["preview"]));
			})
			.catch((err) => {
				toast.error("Error calculating emissions");
				setLoadingComputeBtn(false);
			});
	};

	const renderPreviewCell = useCallback((item: IBulkElectricityDataWithTotalEmissions, columnKey: Key) => {
		const value = item[columnKey as keyof IBulkElectricityDataWithTotalEmissions] as string | number;

		switch (columnKey) {
			case "isRenewable":
				return value === "Yes" ? "Yes" : "No";
			case "totalEmissions":
				return `${Number(value).toFixed(5)} kgCO2e`;
			case "date":
				return format(new Date(value), "MMM, yyyy");
			default:
				return value;
		}
	}, []);

	const onSaveData = async () => {
		setIsSaving(true);

		const dataToSave = dataWithEmissions.map((item) => {
			const { date, country, emissionSource, isRenewable, units, amount, totalEmissions } = item;

			return {
				date,
				country,
				emissionSource,
				isRenewable,
				units,
				amount,
				totalEmissions,
			};
		});

		try {
			const resp = await saveBulkElectricityData(account?.company?.id, dataToSave);

			if (resp.status === "success") {
				toast.success("Data saved successfully");
				setIsSaving(false);
				router.push(AppEnumRoutes.APP_DATA_LIST);
			} else {
				toast.error("Error saving data");
				setIsSaving(false);
			}
		} catch (err) {
			toast.error("Error saving data");
			setIsSaving(false);
		}
	};

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Accounting</BreadcrumbItem>
				<BreadcrumbItem href={AppEnumRoutes.APP_ADD_DATA}>Add Data</BreadcrumbItem>
				<BreadcrumbItem>Eletricity Data</BreadcrumbItem>
			</Breadcrumbs>
			<div className="p-10 bg-green-50 mt-10 rounded-md">
				<Tabs selectedKey={selectedTab} disabledKeys={["preview"]} color="primary" onSelectionChange={(key) => onTabChange(new Set([key]))}>
					<Tab key={"add-data"} title={"Add Data"}>
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-semibold">Electricity Consumption</h1>
							<UploadExcelSheetModal />
						</div>
						<div className="my-7">
							<p className="text-[#374151]">In this section please enter the details on electricity consumption from owned or controlled sources.</p>
						</div>
						<div className="w-full">
							<Accordion>
								<AccordionItem
									key="anchor"
									aria-label=">> Learn More"
									indicator={({ isOpen }) => (isOpen ? <FaAnglesLeft /> : <FaAnglesRight />)}
									title={<span className="text-base text-primary-600 font-semibold"> {">>"} Learn More</span>}>
									<div className="space-y-4">
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">Providing specific usage data for different facilities and equipment can lead to more accurate calculations</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">If available, integrate vertical data from smart meters for more frequent consumption insights</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">Consider accounting for electricity generated</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">
												If your organization uses renewable energy sources, be sure to document this to reflect the emission benefits of cleaner energy
											</p>
										</div>
									</div>
								</AccordionItem>
							</Accordion>
						</div>
						<div className="">
							<AppEditableTable<IBulkElectricityData>
								columns={bulkColumns}
								defaultData={data}
								data={data}
								setData={setData}
								editedRows={editedRows}
								setEditedRows={setEditedRows}
								validRows={validRows}
								setValidRows={setValidRows}
								customOptions={customOptions}
								setCustomOptions={setCustomOptions}
								onAddRow={loadEmissionSources}
								otherFooterItems={
									<>
										<Button isDisabled={loadingComputeBtn} onPress={onClickCalculateTotalEmissions} isLoading={loadingComputeBtn}>
											Calculate Total Emissions
										</Button>
									</>
								}
							/>
						</div>
					</Tab>
					<Tab key={"preview"} title={"Preview"}>
						<div className="flex items-center justify-between">
							<div className="my-5">
								<h2 className="text-lg font-bold">Total Emissions Preview</h2>
								<p className="text-sm">Total emissions calculated for the data entered</p>
								<div className="mt-5">
									<p className="text-lg font-semibold">Total Emissions: {computedEmissions.toFixed(5)} kgCO2e</p>
								</div>
							</div>
							<Button color="primary" startContent={<FiEdit3 />} onPress={onSaveData} isDisabled={isSaving} isLoading={isSaving}>
								Save Data
							</Button>
						</div>
						<AppTable<IBulkElectricityDataWithTotalEmissions>
							headerColumns={previewDataColumns}
							title="Electricity Consumption"
							data={dataWithEmissions ?? []}
							count={dataWithEmissions?.length ?? 0}
							renderCell={renderPreviewCell}
							isLoading={loadingComputeBtn}
							columnsToShowOnMobile={["date", "totalEmissions"]}
							showBottomContent={false}
							showTopContent={false}
						/>
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

export default BulkAddElectricityData;
