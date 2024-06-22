"use client";
import AppEditableCell from "@/components/table/editable-table/AppEditableCell";
import AppEditableTableActionBtns from "@/components/table/editable-table/AppEditableTableActionBtns";
import { AppEditableValidator, generateOptions } from "@/helpers";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { IOption } from "@/types/Forms";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { FC, useCallback, useMemo, useState } from "react";
import { Key } from "@react-types/shared";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { format } from "date-fns";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Tab, Tabs } from "@nextui-org/react";
import UploadExcelSheetModal from "@/components/modals/UploadExcelSheetModal";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import AppEditableTable from "@/components/table/editable-table/AppEditableTable";
import { FiEdit3 } from "react-icons/fi";

type IVariant = "boilers-and-furnaces" | "kitchen-appliances" | "generators" | "heater";

interface IProps {
	variant: IVariant;
}

const dataItemAndDescription: Record<
	IVariant,
	{
		title: string;
		description: string;
	}
> = {
	"boilers-and-furnaces": {
		title: "Boilers And Furnaces",
		description: "Record fuel consumption (e.g. natural gas, oil, propane) by your boilers and furnaces.",
	},
	"kitchen-appliances": {
		title: "Kitchen Appliances",
		description: "Record the emissions of appliances used in your kitchen.",
	},
	generators: {
		title: "Generators",
		description: "Track fuel consumption used by your backup generator.",
	},
	heater: {
		title: "Heater",
		description: "In this section, please enter details of the fuel combustion from heaters.",
	},
};

interface IStationaryCombustionNewAddDataItem {
	date: string;
	equipmentName: string;
	fuelType: string;
	fuelUnit: string;
	fuelAmount: number;
	fuelState: string;
}

interface IStationaryCombustionNewAddDataItemWithEmissions extends IStationaryCombustionNewAddDataItem {
	id: string;
	c02KgEmitted: number;
	emissionSource?: string;
}

const editableValidator = new AppEditableValidator();

const fuelStates = ["Gaseous fuels", "Solid fuels", "Liquid fuels"];

const previewDataColumns: IAppTableColumn[] = [
	{
		name: "Accounting Period",
		uid: "date",
	},
	{
		name: "Source of Emissions",
		uid: "emissionSource",
	},
	{
		name: "Equipment Name(s)",
		uid: "equipmentName",
	},
	{
		name: "Fuel Type",
		uid: "fuelType",
	},
	{
		name: "Fuel Unit",
		uid: "fuelUnit",
	},
	{
		name: "Fuel Amount",
		uid: "fuelAmount",
	},
	{
		name: "Fuel State",
		uid: "fuelState",
	},
	{
		name: "CO2 Kg Emitted",
		uid: "c02KgEmitted",
	},
];

const StationaryCombustionNewAddData: FC<IProps> = ({ variant }) => {
	const [editedRows, setEditedRows] = useState<Record<string, IStationaryCombustionNewAddDataItem>>({}); // { [rowId]: boolean }
	const [validRows, setValidRows] = useState<Record<string, IStationaryCombustionNewAddDataItem>>({}); // { [rowId]: [x: string]: boolean }
	const [data, setData] = useState<IStationaryCombustionNewAddDataItem[]>([]);
	const [customOptions, setCustomOptions] = useState<Record<string, Record<string, IOption[]>>>({});
	const [selectedTab, setSelectedTab] = useState<Key>("add-data");
	const [loadingComputeBtn, setLoadingComputeBtn] = useState<boolean>(false);
	const [computedEmissions, setComputedEmissions] = useState<number>(0);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [dateToBeSaved, setDateToBeSaved] = useState<IStationaryCombustionNewAddDataItemWithEmissions[]>([]);
	const [tableLocalStore, setTableLocalStore] = useState<Record<string, any>>({});
	const { queryFuelsInfo, saveBulkFuelEmission } = useAccountingDataUtils();

	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();
	const router = useRouter();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const bulkColumnHelper = createColumnHelper<IStationaryCombustionNewAddDataItem>();

	const bulkColumns: ColumnDef<IStationaryCombustionNewAddDataItem, any>[] = [
		bulkColumnHelper.accessor("date", {
			header: "Accounting Date",
			cell: AppEditableCell<IStationaryCombustionNewAddDataItem>,
			meta: {
				data: {
					type: "datepicker",
					validate: (val) => editableValidator.validateDate(val, "Invalid Date", true),
				},
			},
		}),
		bulkColumnHelper.accessor("fuelState", {
			header: "Fuel State",
			cell: AppEditableCell<IStationaryCombustionNewAddDataItem>,
			meta: {
				data: {
					type: "select",
					options: generateOptions(fuelStates),
					validate: (val) => editableValidator.validateString(val, "Invalid Fuel State"),
					async onActionSelect(table, row, ...args) {
						const tableMeta = table.options.meta;

						const currentFuelState = row.getValue("fuelState");

						if (!currentFuelState) return;

						try {
							const resp = await queryFuelsInfo({ fuelState: currentFuelState });

							if (resp?.status === "success") {
								// we need to tell the table to clear the fuelType field
								tableMeta?.updateData(row.index, "fuelType", "", false);

								// set the new options
								const info = resp.data;

								if (Array.isArray(info)) {
									const mapped = info.map(({ __v, _id, ...rest }) => rest);

									const fuelTypes = mapped.map((item) => item.fuel);

									// save mapped data to local store
									tableMeta?.updateLocalStore(`fuelTypes-${row.id}`, mapped);

									tableMeta?.updateCustomOptions(row.id, "fuelType", generateOptions(fuelTypes));
								}
							}
						} catch (err) {}
					},
				},
			},
		}),
		bulkColumnHelper.accessor("fuelType", {
			header: "Fuel Type",
			cell: AppEditableCell<IStationaryCombustionNewAddDataItem>,
			meta: {
				data: {
					type: "select",
					options: [], // to be populated by the fuelState field
					validate: (val) => editableValidator.validateString(val, "Invalid Fuel Type"),
					onActionSelect(table, row, ...args) {
						const tableMeta = table.options.meta;
						const localStore = tableMeta?.tableLocalStore;

						const fuelTypes = localStore?.[`fuelTypes-${row.id}`];

						if (!fuelTypes) return;

						const currentFuelType = row.getValue("fuelType");

						if (!currentFuelType) return;

						const selectedFuelType = fuelTypes.find((item) => item.fuel === currentFuelType);

						if (!selectedFuelType) return;

						const fuelUnit = selectedFuelType?.unit;

						const options = generateOptions([fuelUnit]);

						// clear the current selected unit
						tableMeta?.updateData(row.index, "fuelUnit", "", false);

						tableMeta?.updateCustomOptions(row.id, "fuelUnit", options);
					},
				},
			},
		}),
		bulkColumnHelper.accessor("equipmentName", {
			header: "Equipment Name",
			cell: AppEditableCell<IStationaryCombustionNewAddDataItem>,
			meta: {
				data: {
					type: "text",
					validate: (val) => editableValidator.validateString(val, "Invalid Equipment Name"),
					placeholder: "Type Equipment Name",
				},
			},
		}),
		bulkColumnHelper.accessor("fuelUnit", {
			header: "Fuel Unit",
			cell: AppEditableCell<IStationaryCombustionNewAddDataItem>,
			meta: {
				data: {
					type: "select",
					options: [],
					validate: (val) => editableValidator.validateString(val, "Invalid Fuel Unit"),
				},
			},
		}),
		bulkColumnHelper.accessor("fuelAmount", {
			header: "Fuel Amount",
			// @ts-expect-error
			cell: AppEditableCell<IStationaryCombustionNewAddDataItem>,
			meta: {
				data: {
					type: "number",
					validate: (val) => editableValidator.validateNumber(val, "Invalid Fuel Amount"),
					placeholder: "e.g. 1000",
				},
			},
		}),
		bulkColumnHelper.display({
			id: "actions",
			header: "Actions",
			cell: AppEditableTableActionBtns<IStationaryCombustionNewAddDataItem>,
		}),
	];

	const onTabChange = (keys: Set<Key>) => {
		setSelectedTab(keys.values().next().value);
	};

	const getTotalEmission = async ({ fuelState, fuel, value, unit }: { fuelState: string; fuel: string; value: number; unit: string }) => {
		try {
			const resp = await queryFuelsInfo<{ co2Value: number; _id: null }>({ fuelState, fuel, value, unit });

			if (resp.status === "success") {
				const info = resp.data;
				const zeroArr = info[0];
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
				const { date, equipmentName, fuelType, fuelUnit, fuelAmount, fuelState } = row;

				return { date, emissionSource: "Boilers And Furnaces", equipmentName, fuelType, fuelUnit, fuelAmount, fuelState };
			});

		const emissionsPromises = validData.map((item) => {
			const { fuelState, fuelType, fuelAmount, fuelUnit } = item;

			return getTotalEmission({ fuelState, fuel: fuelType, value: fuelAmount, unit: fuelUnit }) as Promise<number>;
		});

		Promise.all(emissionsPromises)
			.then((emissions) => {
				const totalEmissions = emissions.reduce((acc, curr) => acc + curr, 0);

				const dataWithEmissions = validData.map((item, idx) => {
					return { ...item, c02KgEmitted: emissions[idx], id: `${idx}` };
				});

				setComputedEmissions(totalEmissions);

				setDateToBeSaved(dataWithEmissions);

				setLoadingComputeBtn(false);

				setSelectedTab("preview");
			})
			.catch((err) => {
				console.error(err);
				toast.error("An error occurred while calculating emissions");
			});
	};

	const renderPreviewCell = useCallback((item: IStationaryCombustionNewAddDataItemWithEmissions, columnKey: Key) => {
		const value = item[columnKey as keyof IStationaryCombustionNewAddDataItemWithEmissions] as string | number;

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
		setIsSaving(true);

		try {
			const resp = await saveBulkFuelEmission(account?.company?.id, dateToBeSaved as any);

			if (resp?.status === "success") {
				toast.success("Data saved successfully");
				router.push(AppEnumRoutes.APP_DATA_LIST);
			} else {
				toast.error("Failed to save data");
			}
		} catch (err) {
			toast.error("Failed to save the bulk data");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Accounting</BreadcrumbItem>
				<BreadcrumbItem href={AppEnumRoutes.APP_ADD_DATA}>Add Data</BreadcrumbItem>
				<BreadcrumbItem>{dataItemAndDescription[variant].title}</BreadcrumbItem>
			</Breadcrumbs>
			<div className="p-10 bg-green-50 mt-10 rounded-md">
				<Tabs selectedKey={selectedTab} disabledKeys={["preview"]} color="primary" onSelectionChange={(key) => onTabChange(new Set([key]))}>
					<Tab key={"add-data"} title={"Add Data"}>
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-semibold">{dataItemAndDescription[variant].title}</h1>
							<UploadExcelSheetModal />
						</div>
						<div className="my-7">
							<p className="text-[#374151]">{dataItemAndDescription[variant].description}</p>
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
											<FaLeaf className="w-6 h-6" />
											<p className="text-xs md:text-sm font-medium">By providing accurate information on the fuel types & consumption rates will help calculate the emissions</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-6 h-6" />
											<p className="text-xs md:text-sm font-medium">Consider integrating monitoring systems. Regularly updating operation data can lead to more accurate emission estimates</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-6 h-6" />
											<p className="text-xs md:text-sm font-medium">If you use a variety of fuels, enter each fuel separately</p>
										</div>
									</div>
								</AccordionItem>
							</Accordion>
						</div>
						<AppEditableTable<IStationaryCombustionNewAddDataItem>
							columns={bulkColumns}
							data={data}
							defaultData={[]}
							setData={setData}
							editedRows={editedRows}
							setEditedRows={setEditedRows}
							validRows={validRows}
							setValidRows={setValidRows}
							customOptions={customOptions}
							setCustomOptions={setCustomOptions}
							otherFooterItems={
								<Button isLoading={loadingComputeBtn} isDisabled={loadingComputeBtn} onPress={onClickCalculateTotalEmissions}>
									Compute Emissions
								</Button>
							}
							tableLocalStore={tableLocalStore}
							setTableLocalStore={setTableLocalStore}
						/>
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
						<AppTable<IStationaryCombustionNewAddDataItemWithEmissions>
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

export default StationaryCombustionNewAddData;
