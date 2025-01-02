"use client";
import { FC, useCallback, useMemo, useState } from "react";
import AppTable, { IAppTableColumn } from "../table/AppTable";
import { AppEditableValidator, generateOptions } from "@/helpers";
import { ColumnDef, createColumnHelper, Table } from "@tanstack/react-table";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import AppEditableCell from "../table/editable-table/AppEditableCell";
import AppEditableTableActionBtns from "../table/editable-table/AppEditableTableActionBtns";
import { IOption } from "@/types/Forms";
import { Key } from "@react-types/shared";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useRouter } from "next/navigation";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Tab, Tabs } from "@nextui-org/react";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import AppEditableTable from "../table/editable-table/AppEditableTable";
import Link from "next/link";
import UploadVehiclesEmissionsExcelSheetModal from "../modals/UploadVehiclesEmissionsExcelSheetModal";

type IVariant = "delivery-vehicles" | "passenger-vehicles";

interface IProps {
	variant: IVariant;
}

interface IFleetEmissionsAddData {
	date: string;
	fleetCategory: string;
	typeOfFuel: string;
	unitOfDistance: string;
	amountOfDistance: number;
}

interface IFleetEmissionsAddDataWithEmissions extends IFleetEmissionsAddData {
	fleetType?: string;
	id: string;
	c02KgEmitted: number;
}

const previewDataColumns: IAppTableColumn[] = [
	{
		name: "Accounting Period",
		uid: "date",
		sortable: true,
	},
	{
		name: "Fleet Type",
		uid: "fleetType",
		sortable: true,
	},
	{
		name: "Fleet Category",
		uid: "fleetCategory",
		sortable: true,
	},
	{
		name: "Type of Fuel",
		uid: "typeOfFuel",
		sortable: true,
	},
	{
		name: "Unit of Distance",
		uid: "unitOfDistance",
		sortable: true,
	},
	{
		name: "Amount of Distance",
		uid: "amountOfDistance",
		sortable: true,
	},
	{
		name: "CO2 Kg Emitted",
		uid: "c02KgEmitted",
		sortable: true,
	},
];

const editableValidator = new AppEditableValidator();

const mapVariantToFleetType = (variant: IVariant) => {
	if (variant === "delivery-vehicles") {
		return "Delivery vehicles";
	} else if (variant === "passenger-vehicles") {
		return "Passenger vehicles";
	}
};

const FleetEmissionsNewAddData: FC<IProps> = ({ variant }) => {
	const [editedRows, setEditedRows] = useState<Record<string, IFleetEmissionsAddData>>({}); // { [rowId]: boolean }
	const [validRows, setValidRows] = useState<Record<string, IFleetEmissionsAddData>>({}); // { [rowId]: [x: string]: boolean }
	const [data, setData] = useState<IFleetEmissionsAddData[]>([]);
	const [customOptions, setCustomOptions] = useState<Record<string, Record<string, IOption[]>>>({});
	const [selectedTab, setSelectedTab] = useState<Key>("add-data");
	const [loadingComputeBtn, setLoadingComputeBtn] = useState<boolean>(false);
	const [computedEmissions, setComputedEmissions] = useState<number>(0);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [dateToBeSaved, setDateToBeSaved] = useState<IFleetEmissionsAddDataWithEmissions[]>([]);

	const { queryFleetInfo, saveBulkFleetInfo } = useAccountingDataUtils();

	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();
	const router = useRouter();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	async function onAddRowAction<T = any>(table: Table<T>, rowId: string) {
		const tableMeta = table.options.meta;

		try {
			const resp = await queryFleetInfo<{ TypeLevel1: string; TypeLevel2: string; _id: string }[]>({ TypeLevel1: mapVariantToFleetType(variant) });

			if (resp?.status === "success") {
				const info = resp.data as { TypeLevel1: string; TypeLevel2: string; _id: string }[];
				if (Array.isArray(info)) {
					// const options = generateOptions(info as string[]);
					// access the TypeLevel2 property and ensure it's unique
					const types = info.map((item) => item.TypeLevel2);
					const uniqueTypes = [...new Set(types)];

					const options = generateOptions(uniqueTypes);

					tableMeta?.updateCustomOptions(rowId, "fleetCategory", options);
				}
			}
		} catch (err) {}
	}

	const bulkColumnHelper = createColumnHelper<IFleetEmissionsAddData>();

	const bulkColmns: ColumnDef<IFleetEmissionsAddData, any>[] = [
		bulkColumnHelper.accessor("date", {
			header: "Accounting Period",
			cell: AppEditableCell<IFleetEmissionsAddData>,
			meta: {
				data: {
					type: "datepicker",
					isRequired: true,
					validate: (val) => editableValidator.validateDate(val, "Invalid date", true),
				},
			},
		}),
		bulkColumnHelper.accessor("fleetCategory", {
			header: "Fleet Category",
			cell: AppEditableCell<IFleetEmissionsAddData>,
			meta: {
				data: {
					type: "select",
					isRequired: true,
					validate: (val) => editableValidator.validateString(val, "Invalid fleet category"),
					options: [],
					async onActionSelect(table, row, ...args) {
						const tableMeta = table.options.meta;

						const currentFleetCategory = row.getValue("fleetCategory");
						const currentFleetType = mapVariantToFleetType(variant);

						if (!currentFleetCategory) return;

						try {
							const resp = await queryFleetInfo<
								{
									TypeLevel1: string;
									TypeLevel2: string;
									_id: string;
									fuel: string;
								}[]
							>({ TypeLevel1: currentFleetType, TypeLevel2: currentFleetCategory });

							if (resp?.status === "success") {
								const info = resp.data as { TypeLevel1: string; TypeLevel2: string; _id: string; fuel: string }[];
								if (Array.isArray(info)) {
									// access the fuel property and ensure it's unique
									const types = info.map((item) => item.fuel);
									const uniqueTypes = [...new Set(types)];
									const options = generateOptions(uniqueTypes);
									tableMeta?.updateCustomOptions(row.id, "typeOfFuel", options);
								}
							}
						} catch (err) {
							console.error(err);
						}
					},
				},
			},
		}),
		bulkColumnHelper.accessor("typeOfFuel", {
			header: "Type of Fuel",
			cell: AppEditableCell<IFleetEmissionsAddData>,
			meta: {
				data: {
					type: "select",
					isRequired: true,
					validate: (val) => editableValidator.validateString(val, "Invalid fuel type"),
					options: [],
					async onActionSelect(table, row, ...args) {
						const tableMeta = table.options.meta;

						const currentFuelType = row.getValue("typeOfFuel");
						const currentFleetType = mapVariantToFleetType(variant);
						const currentFleetCategory = row.getValue("fleetCategory");

						if (!currentFuelType || !currentFleetType || !currentFleetCategory) return;

						try {
							const resp = await queryFleetInfo<
								{
									TypeLevel1: string;
									TypeLevel2: string;
									_id: string;
									fuel: string;
									unit: string;
								}[]
							>({ TypeLevel1: currentFleetType, TypeLevel2: currentFleetCategory, fuel: currentFuelType });

							if (resp?.status === "success") {
								const info = resp.data as { TypeLevel1: string; TypeLevel2: string; _id: string; fuel: string; unit: string }[];
								if (Array.isArray(info)) {
									const unitTypes = info.map((item) => item.unit);
									const uniqueUnitTypes = [...new Set(unitTypes)];
									const options = generateOptions(uniqueUnitTypes);
									tableMeta?.updateCustomOptions(row.id, "unitOfDistance", options);
								}
							}
						} catch (err) {
							console.error(err);
						}
					},
				},
			},
		}),
		bulkColumnHelper.accessor("unitOfDistance", {
			header: "Unit of Distance",
			cell: AppEditableCell<IFleetEmissionsAddData>,
			meta: {
				data: {
					type: "select",
					isRequired: true,
					validate: (val) => editableValidator.validateString(val, "Invalid unit of distance"),
					options: [], // will be loaded dynamically onActionSelect of typeOfFuel
				},
			},
		}),
		bulkColumnHelper.accessor("amountOfDistance", {
			header: "Amount of Distance",
			// @ts-expect-error
			cell: AppEditableCell<IFleetEmissionsAddData>,
			meta: {
				data: {
					type: "number",
					isRequired: true,
					validate: (val) => editableValidator.validateNumber(val, "Invalid amount of distance"),
					placeholder: "Enter amount of distance",
				},
			},
		}),
		bulkColumnHelper.display({
			id: "actions",
			header: "Actions",
			cell: AppEditableTableActionBtns<IFleetEmissionsAddData>,
		}),
	];

	const onTabChange = (keys: Set<Key>) => {
		setSelectedTab(keys.values().next().value);
	};

	const getTotalEmission = async ({ TypeLevel1, TypeLevel2, fuel, unit, value }) => {
		try {
			const resp = await queryFleetInfo<{ co2Value: number; _id: null }[]>({
				TypeLevel1,
				TypeLevel2,
				fuel,
				unit,
				value,
			});

			if (resp?.status === "success") {
				const info = resp.data as { co2Value: number; _id: null }[];
				const zeroArr = info?.[0];

				if (zeroArr) {
					const co2Value = zeroArr.co2Value;
					return co2Value;
				}

				return 0;
			}

			return 0;
		} catch (err) {
			console.error(err);

			return 0;
		}
	};

	const onClickCalculateTotalEmissions = async () => {
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

		const validData = data
			.filter((_, idx) => validRows[`${idx}`])
			.map((row) => {
				const { date, fleetCategory, typeOfFuel, unitOfDistance, amountOfDistance } = row;

				return { date, fleetType: mapVariantToFleetType(variant), fleetCategory, typeOfFuel, unitOfDistance, amountOfDistance };
			});

		const emissionsPromises = validData.map(async (row) =>
			getTotalEmission({
				TypeLevel1: row.fleetType,
				TypeLevel2: row.fleetCategory,
				fuel: row.typeOfFuel,
				unit: row.unitOfDistance,
				value: row.amountOfDistance,
			})
		);

		Promise.all(emissionsPromises)
			.then((emissions) => {
				const totalEmissions = emissions.reduce((acc, curr) => acc + curr, 0);

				const dataWithEmissions = validData.map((row, idx) => {
					const { date, fleetType, fleetCategory, typeOfFuel, unitOfDistance, amountOfDistance } = row;
					const c02KgEmitted = emissions[idx];
					const id = `${idx}`;

					return { date, fleetType, fleetCategory, typeOfFuel, unitOfDistance, amountOfDistance, c02KgEmitted, id };
				});

				setComputedEmissions(totalEmissions);
				setDateToBeSaved(dataWithEmissions);
				setLoadingComputeBtn(false);
				onTabChange(new Set(["preview"]));
			})
			.catch((err) => {
				console.error(err);
				toast.error("Failed to calculate emissions");
				setLoadingComputeBtn(false);
			});
	};

	const renderPreviewCell = useCallback((item: IFleetEmissionsAddDataWithEmissions, columnKey: Key) => {
		const value = item[columnKey as keyof IFleetEmissionsAddDataWithEmissions] as string | number;

		switch (columnKey) {
			case "date":
				return format(new Date(value), "MMM, yyyy");
			case "c02KgEmitted":
				return Number(value).toFixed(5) + " kgCO2e";
			default:
				return value;
		}
	}, []);

	const onSaveData = async () => {
		const finalDataToSave = dateToBeSaved?.map((row) => {
			const { date, fleetType, fleetCategory, typeOfFuel, unitOfDistance, amountOfDistance, c02KgEmitted } = row;

			return {
				date,
				typeLevel1: fleetType,
				typeLevel2: fleetCategory,
				fuelType: typeOfFuel,
				distanceCovered: amountOfDistance,
				c02KgEmitted,
				unitOfDistance: unitOfDistance,
			};
		});

		setIsSaving(true);

		try {
			const resp = await saveBulkFleetInfo(account?.company?.id, finalDataToSave as any, account?.id, variant);

			if (resp?.status === "success") {
				toast.success("Data saved successfully");
				router.push(AppEnumRoutes.APP_DATA_LIST);
			} else {
				toast.error("Failed to save data");
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to save data");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Accounting</BreadcrumbItem>
				<BreadcrumbItem href={AppEnumRoutes.APP_ADD_DATA}>Add Data</BreadcrumbItem>
				<BreadcrumbItem>{variant === "delivery-vehicles" ? "Delivery Vehicles" : "Passenger Vehicles"} - Emissions</BreadcrumbItem>
			</Breadcrumbs>
			<div className="py-10 px-4 md:px-10 bg-green-50 mt-10 rounded-md">
				<Tabs selectedKey={selectedTab} disabledKeys={["preview"]} color="primary" onSelectionChange={(key) => onTabChange(new Set([key]))}>
					<Tab key={"add-data"} title={"Add Data"}>
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-semibold">{mapVariantToFleetType(variant)}</h1>
							<UploadVehiclesEmissionsExcelSheetModal variant={variant} />
						</div>
						<div className="my-7 space-y-3">
							<p className="text-[#374151]">
								{variant === "delivery-vehicles" && "Track emissions from vehicles used for company deliveries (e.g., company supplies , notebooks ,pens e.t.c ."}
								{variant === "passenger-vehicles" && "Track emissions from company-owned vehicles used for transporting staff/students."}
							</p>
							<Button color="primary" variant="bordered" as={Link} href={`/accounting/add-data/${variant}/advance`}>
								Try Advance (By Vehicle Make)
							</Button>
						</div>
						<div className="w-full">
							<Accordion>
								<AccordionItem
									key="anchor"
									aria-label="Learn More"
									indicator={({ isOpen }) => (isOpen ? <FaAnglesLeft /> : <FaAnglesRight />)}
									title={<span className="text-base text-primary-600 font-semibold">Learn More</span>}>
									<div className="space-y-4">
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">Providing specific details like vehicle models, will lead to more accurate emission calculations</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">
												If your fleet use different types of fuels, ensure separate entries for each fuel type to capture the distinct emissions characteristics
											</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">Consider integrating monitoring systems using GPS fuel cards</p>
										</div>
									</div>
								</AccordionItem>
							</Accordion>
						</div>
						<div className="">
							<AppEditableTable<IFleetEmissionsAddData>
								columns={bulkColmns}
								data={data}
								defaultData={[]}
								setData={setData}
								editedRows={editedRows}
								setEditedRows={setEditedRows}
								validRows={validRows}
								setValidRows={setValidRows}
								customOptions={customOptions}
								setCustomOptions={setCustomOptions}
								onAddRow={onAddRowAction}
								otherFooterItems={
									<Button isLoading={loadingComputeBtn} isDisabled={loadingComputeBtn} onPress={onClickCalculateTotalEmissions}>
										Compute Emissions
									</Button>
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
						<AppTable<IFleetEmissionsAddDataWithEmissions>
							headerColumns={previewDataColumns}
							title="Fleet Emissions"
							data={dateToBeSaved ?? []}
							count={dateToBeSaved?.length ?? 0}
							renderCell={renderPreviewCell}
							isLoading={loadingComputeBtn}
							columnsToShowOnMobile={["date", "c02KgEmitted"]}
							showBottomContent={false}
							showTopContent={false}
						/>
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

export default FleetEmissionsNewAddData;
