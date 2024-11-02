"use client";
import AppEditableCell from "@/components/table/editable-table/AppEditableCell";
import { AppEditableValidator } from "@/helpers";
import { ColumnDef, createColumnHelper, Table } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Key } from "@react-types/shared";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useRouter } from "next/navigation";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import toast from "react-hot-toast";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react";
import UploadExcelSheetModal from "@/components/modals/UploadExcelSheetModal";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import AppEditableTable from "@/components/table/editable-table/AppEditableTable";
import ModalSectionDetail from "@/components/modal-sections/ModalSectionDetail";
import ModalSectionTitle from "@/components/modal-sections/ModalSectionTitle";
import AppEditableTableActionBtns from "@/components/table/editable-table/AppEditableTableActionBtns";
import { ProcessingEmissionAddVariant } from "@/types/ProcessingAndFugitive";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { IProcessingEquipment, ProcessingEquipmentCategory } from "@/types/EquipmentMobility";
import { swrFetcher } from "@/lib/api-client";
import { IOption } from "@/types/Forms";
import { IAddEquipmentModalInfo } from "@/types/Appliances";

interface IProps {
	variant: ProcessingEmissionAddVariant;
}

interface SaveModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	values: {
		totalEmissionReleased: number;
		totalRows: number;
	};
	isSaving: boolean;
	onConfirm?: VoidFunction;
	variant: ProcessingEmissionAddVariant;
}

interface IBulkAddProcessingEmissionsData {
	date: string;
	equipmentName?: string;
	wasteGas: string;
	unit: string;
	gasAmount: number;
	emissionName?: string;
}

interface IBulkAddProcessingEmissionsDataUpdated {
	date: string;
	equipment: string;
	gasAmount: number;
}

function generateAmountKg(unit: string, val: number) {
	let gasAmountInKg: number;

	switch (unit) {
		case "Tonnes":
			gasAmountInKg = val * 1000;
			break;
		case "Giga Tonnes":
			gasAmountInKg = val * 1e6;
			break;
		case "Litres":
			console.warn("Conversion from Litres to kg requires density information.");
			gasAmountInKg = val;
			break;
		default:
			gasAmountInKg = val;
	}

	return gasAmountInKg;
}

type TDataItemVariant = Record<ProcessingEmissionAddVariant, Omit<IAddEquipmentModalInfo, "tooltipText">>;

const dataItemAndDescription = {
	[ProcessingEmissionAddVariant.CHEMICAL_REACTIONS]: {
		title: "Chemical Reactions",
		description: "Record emissions data associated with processing activities and chemical reactions in your processes.",
	},
	[ProcessingEmissionAddVariant.INDUSTRIAL_EQUIPMENTS]: {
		title: "Industrial Equipments",
		description: "Record emissions data associated with industrial activities in your processes.",
	},
} satisfies TDataItemVariant;

const editableValidator = new AppEditableValidator();

const bulkColumnHelper = createColumnHelper<IBulkAddProcessingEmissionsDataUpdated>();

const bulkColumns: ColumnDef<IBulkAddProcessingEmissionsDataUpdated, any>[] = [
	bulkColumnHelper.accessor("date", {
		header: "Accounting Period",
		cell: AppEditableCell<IBulkAddProcessingEmissionsDataUpdated>,
		meta: {
			data: {
				type: "datepicker",
				validate: (val) => editableValidator.validateDate(val, "Invalid date", true),
			},
		},
	}),
	bulkColumnHelper.accessor("equipment", {
		header: "Equipment",
		cell: AppEditableCell<IBulkAddProcessingEmissionsDataUpdated>,
		meta: {
			data: {
				type: "combobox",
				options: [],
				placeholder: "Choose equipment",
				validate: (val) => editableValidator.validateString(val, "Select equipment"),
			},
		},
	}),
	// bulkColumnHelper.accessor("equipmentName", {
	// 	header: "Name of Equipment",
	// 	cell: AppEditableCell<IBulkAddProcessingEmissionsData>,
	// 	meta: {
	// 		data: {
	// 			type: "text",
	// 			validate: (val) => editableValidator.validateString(val, "Invalid equipment name"),
	// 			placeholder: "Type Equipment Name",
	// 		},
	// 	},
	// }),
	// bulkColumnHelper.accessor("wasteGas", {
	// 	header: "Waste Gas",
	// 	cell: AppEditableCell<IBulkAddProcessingEmissionsData>,
	// 	meta: {
	// 		data: {
	// 			type: "select",
	// 			options: generateOptions(wasteGases),
	// 			placeholder: "Select Waste Gas",
	// 			validate: (val) => editableValidator.validateString(val, "Invalid waste gas"),
	// 		},
	// 	},
	// }),
	// bulkColumnHelper.accessor("unit", {
	// 	header: "Unit",
	// 	cell: AppEditableCell<IBulkAddProcessingEmissionsData>,
	// 	meta: {
	// 		data: {
	// 			type: "select",
	// 			options: generateOptions(wasteGasUnit),
	// 			placeholder: "Choose Unit",
	// 			validate: (val) => editableValidator.validateString(val, "Invalid unit"),
	// 		},
	// 	},
	// }),
	bulkColumnHelper.accessor("gasAmount", {
		header: "Gas Amount",
		// @ts-expect-error
		cell: AppEditableCell<IBulkAddProcessingEmissionsDataUpdated>,
		meta: {
			data: {
				type: "number",
				validate: (val) => editableValidator.validateNumber(val, "Invalid gas amount"),
				placeholder: "e.g. 450",
			},
		},
	}),
	bulkColumnHelper.display({
		id: "actions",
		header: "Actions",
		cell: AppEditableTableActionBtns<IBulkAddProcessingEmissionsDataUpdated>,
	}),
];

const ChemicalReactionsEmissionsNewAddData = ({ variant }: IProps) => {
	const [editedRows, setEditedRows] = useState<Record<string, IBulkAddProcessingEmissionsDataUpdated>>({}); // { [rowId]: boolean }
	const [validRows, setValidRows] = useState<Record<string, IBulkAddProcessingEmissionsDataUpdated>>({}); // { [rowId]: [x: string]: boolean }
	const [data, setData] = useState<IBulkAddProcessingEmissionsDataUpdated[]>([]);
	const [selectedTab, setSelectedTab] = useState<Key>("add-data");
	const [modalValues, setModalValues] = useState<{
		totalEmissionReleased: number;
		totalRows: number;
	}>({
		totalEmissionReleased: 0,
		totalRows: 0,
	});
	const [isOpen, setIsOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [dataToBeSaved, setDataToBeSaved] = useState<IBulkAddProcessingEmissionsData[]>([]);
	const [customOptions, setCustomOptions] = useState<Record<string, Record<string, IOption[]>>>({});


	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();
	const router = useRouter();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const { saveBulkProcessEmission } = useAccountingDataUtils();

	const { data: loadedEquipments } = useSWR<IProcessingEquipment[]>(
		!account ? null : [`${IApiEndpoint.PROCESSING_EQUIPMENT_GET_BY_COMPANY_CAT_SUBCAT}/${account?.company?.id}/${ProcessingEquipmentCategory.PROCESSING}/${variant}`],
		swrFetcher,
		{ keepPreviousData: true }
	);

	async function onAddRowAction<T = any>(table: Table<T>, rowId: string) {
		const tableMeta = table.options.meta;

		if (loadedEquipments && loadedEquipments?.length) {
			const options = loadedEquipments.map((item) => {
				return {
					label: item.equipmentName,
					value: item.id,
				} satisfies IOption;
			});

			tableMeta?.updateCustomOptions(rowId, "equipment", options);
		}
	}

	const onTabChange = (keys: Set<Key>) => {
		setSelectedTab(keys.values().next().value);
	};

	const onClickSave = () => {
		const validRowKeys = Object.keys(validRows);

		if (validRowKeys.length === 0) {
			toast.error("No valid rows to calculate emissions");
			return;
		}

		if (validRowKeys.length < data.length) {
			toast.error("Some rows are invalid and will not be calculated");
		}

		const validData = data
			.filter((_, idx) => validRows[`${idx}`])
			.map((row) => {
				const { date, gasAmount, equipment } = row;

				const equipmentData = loadedEquipments.find((item) => item.id === equipment);

				return {
					date,
					emissionSource: "Chemical Reactions",
					emissionName: equipmentData?.equipmentName,
					wasteGas: equipmentData?.gasEmitted,
					unit: equipmentData?.emissionGasUnit,
					gasAmount: generateAmountKg(equipmentData?.emissionGasUnit, Number(gasAmount)),
				};
			});

		const totalEmissionReleased = validData.reduce((acc, curr) => acc + curr.gasAmount, 0);

		setModalValues({
			totalEmissionReleased,
			totalRows: validData.length,
		});

		setDataToBeSaved(validData);

		setIsOpen(true);
	};

	const onConfirm = async () => {
		setIsSaving(true);

		try {
			const id = toast.loading("Saving Fugitive Emission...");

			const resp = await saveBulkProcessEmission(account?.company.id, dataToBeSaved as any);

			if (resp?.status === "success") {
				toast.success("Data saved successfully", { id });
				setIsOpen(false);
				router.push(AppEnumRoutes.APP_DATA_LIST);
			} else {
				toast.error("An error occurred while saving data", { id });
			}
		} catch (err) {
			toast.error("An error occurred while saving data");
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
			<div className="p-6 bg-green-50 mt-10 rounded-md">
				<Tabs selectedKey={selectedTab} disabledKeys={["preview"]} color="primary" onSelectionChange={(key) => onTabChange(new Set([key]))}>
					<Tab key={"add-data"} title={"Add Data"}>
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-semibold">{dataItemAndDescription[variant].title} Emissions</h1>
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
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">By providing accurate information on the fuel types & consumption rates will help calculate the emissions</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">Consider integrating monitoring systems. Regularly updating operation data can lead to more accurate emission estimates</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">If you use a variety of fuels, enter each fuel separately</p>
										</div>
									</div>
								</AccordionItem>
							</Accordion>
						</div>
						<AppEditableTable<IBulkAddProcessingEmissionsDataUpdated>
							columns={bulkColumns}
							data={data}
							defaultData={[]}
							setData={setData}
							editedRows={editedRows}
							setEditedRows={setEditedRows}
							validRows={validRows}
							setValidRows={setValidRows}
							onAddRow={onAddRowAction}
							customOptions={customOptions}
							setCustomOptions={setCustomOptions}
							otherFooterItems={<Button onPress={onClickSave}>Calculate Emissions</Button>}
						/>
						<SaveModal isOpen={isOpen} setIsOpen={setIsOpen} values={modalValues} isSaving={isSaving} onConfirm={onConfirm} variant={variant} />
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

const SaveModal = ({ isOpen, setIsOpen, onConfirm, values, isSaving, variant }: SaveModalProps) => {
	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
			<ModalContent className="saastain font-nunito">
				{(onClose) => (
					<>
						<ModalHeader>
							<h2 className="text-xl font-bold">Confirm {dataItemAndDescription[variant].title} Emissions Data</h2>
						</ModalHeader>
						<ModalBody>
							<div className="">
								<div className="bg-primary px-4 py-4 rounded-t-lg">
									<div className="grid grid-cols-2">
										<div className="text-white">Field</div>
										<div className="text-white">Value</div>
									</div>
								</div>
								<div className="">
									<ModalSectionTitle title="Row Summary" />
									<ModalSectionDetail label="Total Rows" value={values.totalRows} />
									<ModalSectionDetail label="Total Gas Emission Released (kg)" value={values.totalEmissionReleased} />
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" variant="bordered" onPress={onClose}>
								Cancel
							</Button>
							<Button color="primary" onPress={onConfirm} isLoading={isSaving} isDisabled={isSaving}>
								Confirm
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ChemicalReactionsEmissionsNewAddData;
