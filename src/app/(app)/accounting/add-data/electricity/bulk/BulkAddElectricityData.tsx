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
import { useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { Key } from "@react-types/shared";
import toast from "react-hot-toast";

const isRenewableOptions = ["Yes", "No"];

interface IBulkElectricityData {
	date: Date;
	country: string;
	emissionSource: string;
	isRenewable: string;
	units: string;
	amount: number;
}

const eastAfricanCountries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia", "Burundi"];

const BulkAddElectricityData = () => {
	const [editedRows, setEditedRows] = useState<Record<string, IBulkElectricityData>>({}); // { [rowId]: boolean }
	const [validRows, setValidRows] = useState<Record<string, IBulkElectricityData>>({}); // { [rowId]: [x: string]: boolean }
	const [data, setData] = useState<IBulkElectricityData[]>([]);
	const [customOptions, setCustomOptions] = useState<Record<string, Record<string, IOption[]>>>({});
	const [selectedTab, setSelectedTab] = useState<Key>("add-data");

	const { queryElectricityInfo } = useAccountingDataUtils();

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

	const onClickCalculateTotalEmissions = () => {
		// compare valid rows and data to alert user only valid rows will be calculated
		const validRowsKeys = Object.keys(validRows);

		if (validRowsKeys.length === 0) {
			toast.error("No valid rows to calculate emissions");
			return;
		}

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

		console.log(`Valid Data: ${JSON.stringify(validData)}`);

		// onTabChange(new Set(["preview"]));
	};

	// console.log(`Valid Rows: ${JSON.stringify(validRows)}`);
	// console.log(`Edited Rows: ${JSON.stringify(editedRows)}`);

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
										<Button onPress={onClickCalculateTotalEmissions}>Calcuate Total Emissions</Button>
									</>
								}
							/>
						</div>
					</Tab>
					<Tab key={"preview"} title={"Preview"}>
						<p>Preview</p>
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

export default BulkAddElectricityData;
