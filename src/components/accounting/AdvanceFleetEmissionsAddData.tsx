"use client";

import UploadExcelSheetModal from "@/components/modals/UploadExcelSheetModal";
import AppEditableCell from "@/components/table/editable-table/AppEditableCell";
import AppEditableTable from "@/components/table/editable-table/AppEditableTable";
import AppEditableTableActionBtns from "@/components/table/editable-table/AppEditableTableActionBtns";
import { AppEditableValidator } from "@/helpers";
import useEquipmentMobilityUtils from "@/hooks/useEquipmentsMobilityUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { IOption } from "@/types/Forms";
import { AppKey } from "@/types/Global";
import { generateOptions } from "@/utils";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Tab, Tabs } from "@nextui-org/react";
import { ColumnDef, createColumnHelper, Table } from "@tanstack/react-table";
import { FC, useCallback, useMemo, useState } from "react";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import useSWR from "swr";
import AuthRedirectComponent from "../auth/AuthRedirectComponent";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import toast from "react-hot-toast";
import { ICarbonSutraVehicleEmissionsResp, IScopeOneFleetEmissionsMakeModel } from "@/types/Accounting";
import AppTable, { IAppTableColumn } from "../table/AppTable";
import { format } from "date-fns/format";
import { FiEdit3 } from "react-icons/fi";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useRouter } from "next/navigation";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";

type IVariant = "delivery-vehicles" | "passenger-vehicles";

interface IProps {
	variant: IVariant;
}

interface IFleetModelBasedEmissionsAddData {
	date: string;
	vehicle_make: string;
	vehicle_model: string;
	distance_value: string;
}

interface IFleetModelBasedEmissionsAddDataWithEmissions {
	id: string; // should be removed when we save to db to avoid conflict with db,
	vehicleMake: string;
	vehicleModel: string;
	distanceCovered: string;
	date: string;
	c02KgEmitted: number;
	metadata: ICarbonSutraVehicleEmissionsResp | object;
}

const previewDataColumns: IAppTableColumn[] = [
	{
		name: "Accounting Period",
		uid: "date",
		sortable: true,
	},
	{
		name: "Vehicle Make",
		uid: "vehicleMake",
		sortable: true,
	},
	{
		name: "Vehicle Model",
		uid: "vehicleModel",
		sortable: true,
	},
	{
		name: "Distance Covered",
		uid: "distanceCovered",
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

const AdvanceFleetEmissionsAddData: FC<IProps> = ({ variant }) => {
	const [selectedTab, setSelectedTab] = useState<AppKey>("add-data");
	const [editedRows, setEditedRows] = useState<Record<string, IFleetModelBasedEmissionsAddData>>({}); // { [rowId]: boolean }
	const [validRows, setValidRows] = useState<Record<string, IFleetModelBasedEmissionsAddData>>({}); // { [rowId]: [x: string]: boolean }
	const [data, setData] = useState<IFleetModelBasedEmissionsAddData[]>([]);
	const [customOptions, setCustomOptions] = useState<Record<string, Record<string, IOption[]>>>({});
	const [loadingComputeBtn, setLoadingComputeBtn] = useState<boolean>(false);
	const [computedEmissions, setComputedEmissions] = useState<number>(0);
	const [dataToBeSaved, setDataToBeSaved] = useState<IFleetModelBasedEmissionsAddDataWithEmissions[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const { data: vehiclesMakesData } = useSWR<{ makes: string[] }>([IApiEndpoint.MOBILITY_QUERY_MAKES], swrFetcher, { keepPreviousData: true });

	const { getVehicleModelsByMake } = useEquipmentMobilityUtils();

	const { queryFleetEmissionsByMakeAndModel, bulkSaveFleetEmissionsDataByMakeAndModel } = useAccountingDataUtils();

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

		if (vehiclesMakesData && Array.isArray(vehiclesMakesData.makes)) {
			const options = generateOptions(vehiclesMakesData.makes);

			tableMeta?.updateCustomOptions(rowId, "vehicle_make", options);
		}
	}

	const bulkColumnHelper = createColumnHelper<IFleetModelBasedEmissionsAddData>();

	const bulkColmns: ColumnDef<IFleetModelBasedEmissionsAddData, any>[] = [
		bulkColumnHelper.accessor("date", {
			header: "Accounting Period",
			cell: AppEditableCell<IFleetModelBasedEmissionsAddData>,
			meta: {
				data: {
					type: "datepicker",
					isRequired: true,
					validate: (val) => editableValidator.validateDate(val, "Invalid date", true),
				},
			},
		}),
		bulkColumnHelper.accessor("vehicle_make", {
			header: "Vehicle Make",
			cell: AppEditableCell<IFleetModelBasedEmissionsAddData>,
			meta: {
				data: {
					type: "combobox",
					isRequired: true,
					validate: (val) => editableValidator.validateString(val, "Please select vehicle make"),
					options: [], // will be auto updated by onAddRowAction fn
					async onActionSelect(table, row, ...args) {
						const tableMeta = table.options.meta;

						const currentVehicleMake = row.getValue("vehicle_make");
						const currentVehicleModel = row.getValue("vehicle_model");

						if (!currentVehicleMake) return;

						// clear options array for the model to prevent outdate information
						tableMeta?.updateCustomOptions(row.id, "vehicle_model", []);
						try {
							const rawResp = await getVehicleModelsByMake(currentVehicleMake as string);

							if (rawResp.status === "success") {
								tableMeta?.updateData(row.index, "vehicle_model", "", false);
								const options = generateOptions(rawResp.data.models);
								tableMeta?.updateCustomOptions(row.id, "vehicle_model", options);
								// select the first item
								setTimeout(() => {
									tableMeta?.updateData(row.index, "vehicle_model", currentVehicleModel ? currentVehicleModel : options[0].value, true);
								}, 200);
							}
						} catch (err) {}
					},
					placeholder: "Choose Make ...",
				},
			},
		}),
		bulkColumnHelper.accessor("vehicle_model", {
			header: "Vehicle Model",
			cell: AppEditableCell<IFleetModelBasedEmissionsAddData>,
			meta: {
				data: {
					type: "combobox",
					isRequired: true,
					validate: (val) => editableValidator.validateString(val, "Please select vehicle model"),
					options: [], // will be injected above onActionSelect,
					placeholder: "Choose Model ...",
				},
			},
		}),
		bulkColumnHelper.accessor("distance_value", {
			header: "Distance Covered",
			cell: AppEditableCell<IFleetModelBasedEmissionsAddData>,
			meta: {
				data: {
					type: "text",
					isRequired: true,
					validate: (val) => editableValidator.validateNumber(val, "Please enter distance covered"),
					placeholder: "100",
				},
			},
		}),
		bulkColumnHelper.display({
			id: "actions",
			header: "Actions",
			cell: AppEditableTableActionBtns<IFleetModelBasedEmissionsAddData>,
		}),
	];

	const onTabChange = (keys: Set<AppKey>) => {
		setSelectedTab(keys.values().next().value);
	};

	const getTotalEmissions = async ({ vehicleMake, vehicleModel, distanceCovered }: { vehicleMake: string; vehicleModel: string; distanceCovered: string }) => {
		try {
			const resp = await queryFleetEmissionsByMakeAndModel({ vehicleMake, vehicleModel, distanceCovered });

			if (resp?.status === "success") {
				return { emissions: resp?.data?.co2e_kg, metadata: resp?.data };
			}

			return { emissions: 0, metadata: {} };
		} catch (err) {
			console.error("err:getTotalEmissions", err);
			return { emissions: 0, metadata: {} };
		}
	};

	const onClickComputeTotalEmissions = async () => {
		// compare valid rows and data to alert user only valid rows will be calculated
		const validRowsKeys = Object.keys(validRows);

		if (validRowsKeys.length === 0) {
			toast.error("No valid rows to calculate emissions");
			return;
		}

		// ensure vehicleModel is present

		// if the size of valid rows is equal to the size of data, then all rows are valid
		// if the size of valid rows is less than the size of data, then some rows are valid - tell user

		if (validRowsKeys.length < data.length) {
			toast.error("Some rows are invalid and will not be calculated");
		}

		setLoadingComputeBtn(true);

		const validData = data
			.filter((_, idx) => validRows[`${idx}`])
			.map((row) => {
				const { distance_value, vehicle_make, vehicle_model, date } = row;

				return { vehicleMake: vehicle_make, vehicleModel: vehicle_model, distanceCovered: distance_value, date };
			});

		const emissionPromises = validData.map(getTotalEmissions);

		Promise.all(emissionPromises)
			.then((emissions) => {
				const totalEmissions = emissions.reduce((acc, curr) => acc + curr.emissions, 0);

				const dataWithEmissions = validData.map((row, idx) => {
					const c02KgEmitted = emissions[idx].emissions;
					const metadata = emissions[idx].metadata;
					const id = `${idx}`;
					return { id, ...row, c02KgEmitted, metadata };
				});

				setComputedEmissions(totalEmissions);
				setDataToBeSaved(dataWithEmissions);
				onTabChange(new Set(["preview"]));
			})
			.catch((err) => {
				console.error("err", err);
				toast.error("Unable to compute emissions at the moment");
			})
			.finally(() => {
				setLoadingComputeBtn(false);
			});
	};

	const renderPreviewCell = useCallback((item: IFleetModelBasedEmissionsAddDataWithEmissions, columnKey: AppKey) => {
		switch (columnKey) {
			case "date":
				return format(new Date(item?.date), "MMM, yyyy");
			case "vehicleMake":
				return item.vehicleMake;
			case "vehicleModel":
				return item.vehicleModel;
			case "distanceCovered":
				return item.distanceCovered;
			case "c02KgEmitted":
				return Number(item.c02KgEmitted).toFixed(5) + " kgCO2e";
			default:
				null;
		}
	}, []);

	const onSaveData = async () => {
		const finalDataToSave = dataToBeSaved.map((rowItem) => {
			// we just need to remove id field
			const { id, metadata, ...rest } = rowItem;

			return { ...rest, resultsMetadata: metadata as IScopeOneFleetEmissionsMakeModel["resultsMetadata"] };
		});

		const info = {
			companyId: account?.company?.id,
			dataItems: finalDataToSave,
			userId: account?.id,
			subCategory: variant,
		};

		setIsSaving(true);

		try {
			const resp = await bulkSaveFleetEmissionsDataByMakeAndModel(info);

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
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem>Add Data</BreadcrumbItem>
				<BreadcrumbItem>Advance Fleet Emissions</BreadcrumbItem>
			</Breadcrumbs>
			<div className="p-10 bg-green-50 mt-10 rounded-md">
				<Tabs selectedKey={selectedTab} disabledKeys={["preview"]} color="primary" onSelectionChange={(key) => onTabChange(new Set([key]))}>
					<Tab key={"add-data"} title={"Add Data"}>
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-semibold">{mapVariantToFleetType(variant)}</h1>
							<UploadExcelSheetModal />
						</div>
						<div className="my-7">
							<p className="text-[#374151]">
								{variant === "delivery-vehicles" && "Track emissions from vehicles used for company deliveries (e.g., company supplies , notebooks ,pens e.t.c ."}
								{variant === "passenger-vehicles" && "Track emissions from company-owned vehicles used for transporting staff/students."}
							</p>
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
							<AppEditableTable<IFleetModelBasedEmissionsAddData>
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
									<Button isLoading={loadingComputeBtn} isDisabled={loadingComputeBtn} onPress={onClickComputeTotalEmissions}>
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
						<AppTable<IFleetModelBasedEmissionsAddDataWithEmissions>
							headerColumns={previewDataColumns}
							title="Fleet Emissions"
							data={dataToBeSaved ?? []}
							count={dataToBeSaved?.length ?? 0}
							renderCell={renderPreviewCell}
							isLoading={loadingComputeBtn}
							columnsToShowOnMobile={["date", "c02KgEmitted"]}
							showBottomContent={false}
							showTopContent={false}
						/>
					</Tab>
				</Tabs>
			</div>
		</AuthRedirectComponent>
	);
};

export default AdvanceFleetEmissionsAddData;
