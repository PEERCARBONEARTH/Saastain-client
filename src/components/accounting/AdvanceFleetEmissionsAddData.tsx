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
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Tab, Tabs } from "@nextui-org/react";
import { ColumnDef, createColumnHelper, Table } from "@tanstack/react-table";
import { FC, useState } from "react";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import useSWR from "swr";

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

	const { data: vehiclesMakesData } = useSWR<{ makes: string[] }>([IApiEndpoint.MOBILITY_QUERY_MAKES], swrFetcher, { keepPreviousData: true });

	const { getVehicleModelsByMake } = useEquipmentMobilityUtils();

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

						if (!currentVehicleMake) return;

						// clear options array for the model to prevent outdate information
						tableMeta?.updateCustomOptions(row.id, "vehicle_model", []);
						try {
							const rawResp = await getVehicleModelsByMake(currentVehicleMake as string);

							if (rawResp.status === "success") {
								tableMeta?.updateData(row.index, "vehicle_model", "", false);
								const options = generateOptions(rawResp.data.models);
								tableMeta?.updateCustomOptions(row.id, "vehicle_model", options);
							}
						} catch (err) {}
					},
					placeholder: "Choose Make ..."
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
					placeholder: "Choose Model ..."
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
					placeholder: "100"
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
	return (
		<>
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
							/>
						</div>
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

export default AdvanceFleetEmissionsAddData;
