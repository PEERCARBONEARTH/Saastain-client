"use client";
import AppEditableCell from "@/components/table/editable-table/AppEditableCell";
import AppEditableTableActionBtns from "@/components/table/editable-table/AppEditableTableActionBtns";
import { AppEditableValidator } from "@/helpers";
import { generateOptions } from "@/utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { FC, useMemo, useState } from "react";
import { Key } from "@react-types/shared";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useRouter } from "next/navigation";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import UploadExcelSheetModal from "@/components/modals/UploadExcelSheetModal";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import AppEditableTable from "@/components/table/editable-table/AppEditableTable";
import toast from "react-hot-toast";
import ModalSectionTitle from "@/components/modal-sections/ModalSectionTitle";
import ModalSectionDetail from "@/components/modal-sections/ModalSectionDetail";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";

type IVariant = "industrial-equipments" | "air-conditioning-systems" | "refrigeration-units" | "leak-detection";

interface SaveModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	values: {
		totalEmissionReleased: number;
		totalRows: number;
	};
	isSaving: boolean;
	onConfirm?: VoidFunction;
	variant: IVariant;
}

interface IProps {
	variant: IVariant;
}

const dataItemAndDescription: Record<
	IVariant,
	{
		item: string;
		description: string;
	}
> = {
	"industrial-equipments": {
		item: "Industrial Equipments",
		description: "Record emissions data associated with industrial activities in your processes",
	},
	"air-conditioning-systems": {
		item: "Air Conditioning Systems",
		description: "Track emissions arising from venting, or other air conditioning system.",
	},
	"refrigeration-units": {
		item: "Refrigeration Units",
		description: "Track emissions arising from other fugitive sources such as your refrigeration.",
	},
	"leak-detection": {
		item: "Leak Detection",
		description: "Track emissions arising from other fugitive sources such as your refrigeration.",
	},
};

interface IFugitiveEmissionsNewAddData {
	date: string;
	emissionName: string;
	emissionGas: string;
	unit: string;
	gasEmitted: number;
}

const gasesEmitted = ["Carbon", "Methane", "Sulphide OX"];
const units = ["Tonnes", "Litres", "Giga Tonnes"];

const editableValidator = new AppEditableValidator();

const bulkColumnHelper = createColumnHelper<IFugitiveEmissionsNewAddData>();

const bulkColumns: ColumnDef<IFugitiveEmissionsNewAddData, any>[] = [
	bulkColumnHelper.accessor("date", {
		header: "Accounting Period",
		cell: AppEditableCell<IFugitiveEmissionsNewAddData>,
		meta: {
			data: {
				type: "datepicker",
				validate: (val) => editableValidator.validateDate(val, "Invalid Date", true),
			},
		},
	}),
	bulkColumnHelper.accessor("emissionName", {
		header: "Equipment Name",
		cell: AppEditableCell<IFugitiveEmissionsNewAddData>,
		meta: {
			data: {
				type: "text",
				validate: (val) => editableValidator.validateString(val, "Invalid Equipment Name"),
				placeholder: "e.g. Fans, Pumps, etc.",
			},
		},
	}),
	bulkColumnHelper.accessor("emissionGas", {
		header: "Emission Gas",
		cell: AppEditableCell<IFugitiveEmissionsNewAddData>,
		meta: {
			data: {
				type: "select",
				options: generateOptions(gasesEmitted),
				validate: (val) => editableValidator.validateString(val, "Invalid Emission Gas"),
				placeholder: "Choose an emission gas",
			},
		},
	}),
	bulkColumnHelper.accessor("unit", {
		header: "Unit",
		cell: AppEditableCell<IFugitiveEmissionsNewAddData>,
		meta: {
			data: {
				type: "select",
				options: generateOptions(units),
				validate: (val) => editableValidator.validateString(val, "Invalid Unit"),
			},
		},
	}),
	bulkColumnHelper.accessor("gasEmitted", {
		header: "Amount of Gas Emitted",
		// @ts-expect-error
		cell: AppEditableCell<IFugitiveEmissionsNewAddData>,
		meta: {
			data: {
				type: "number",
				validate: (val) => editableValidator.validateNumber(val, "Invalid Gas Emitted"),
				placeholder: "e.g. 1000",
			},
		},
	}),
	bulkColumnHelper.display({
		id: "actions",
		header: "Actions",
		cell: AppEditableTableActionBtns<IFugitiveEmissionsNewAddData>,
	}),
];

const FugitiveEmissionsNewAddData: FC<IProps> = ({ variant }) => {
	const [editedRows, setEditedRows] = useState<Record<string, IFugitiveEmissionsNewAddData>>({}); // { [rowId]: boolean }
	const [validRows, setValidRows] = useState<Record<string, IFugitiveEmissionsNewAddData>>({}); // { [rowId]: [x: string]: boolean }
	const [data, setData] = useState<IFugitiveEmissionsNewAddData[]>([]);
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
	const [dataToBeSaved, setDataToBeSaved] = useState<IFugitiveEmissionsNewAddData[]>([]);

	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();
	const router = useRouter();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const { saveBulkFugitiveEmission } = useAccountingDataUtils();

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
				const { date, emissionGas, emissionName, unit, gasEmitted } = row;

				return {
					date,
					emissionGas,
					emissionName,
					emissionSource: dataItemAndDescription[variant].item,
					unit,
					gasEmitted: Number(gasEmitted),
				};
			});

		const totalEmissionReleased = validData.reduce((acc, curr) => acc + curr.gasEmitted, 0);

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

			const resp = await saveBulkFugitiveEmission(account?.company.id, dataToBeSaved as any, account?.id, variant);

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
				<BreadcrumbItem>{dataItemAndDescription[variant].item}</BreadcrumbItem>
			</Breadcrumbs>
			<div className="p-6 bg-green-50 mt-10 rounded-md">
				<Tabs selectedKey={selectedTab} disabledKeys={["preview"]} color="primary" onSelectionChange={(key) => onTabChange(new Set([key]))}>
					<Tab key={"add-data"} title={"Add Data"}>
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-semibold">{dataItemAndDescription[variant].item}</h1>
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
											<p className="text-xs md:text-sm font-medium">Please detail the fugitive sources, gas type and leakage rates</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">Implement leak detection programs to identify and address fugitive emissions</p>
										</div>
										<div className="flex space-x-2 items-center">
											<FaLeaf className="w-4 h-4" />
											<p className="text-xs md:text-sm font-medium">Maintain records of leak repairs and their impact on emissions</p>
										</div>
									</div>
								</AccordionItem>
							</Accordion>
						</div>
						<AppEditableTable<IFugitiveEmissionsNewAddData>
							columns={bulkColumns}
							data={data}
							defaultData={[]}
							setData={setData}
							editedRows={editedRows}
							setEditedRows={setEditedRows}
							validRows={validRows}
							setValidRows={setValidRows}
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
							<h2 className="text-xl font-bold">
								Confirm
								{dataItemAndDescription[variant].item}
								Emissions Data
							</h2>
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
									<ModalSectionDetail label="Total Gas Emission Released" value={values.totalEmissionReleased} />
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

export default FugitiveEmissionsNewAddData;
