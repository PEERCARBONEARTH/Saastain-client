"use client";
import AppEditableCell from "@/components/table/editable-table/AppEditableCell";
import AppEditableTableActionBtns from "@/components/table/editable-table/AppEditableTableActionBtns";
import { AppEditableValidator, generateOptions } from "@/helpers";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Tabs, Tab, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import { Key } from "@react-types/shared";
import UploadExcelSheetModal from "@/components/modals/UploadExcelSheetModal";
import AppEditableTable from "@/components/table/editable-table/AppEditableTable";
import ModalSectionTitle from "@/components/modal-sections/ModalSectionTitle";
import ModalSectionDetail from "@/components/modal-sections/ModalSectionDetail";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useRouter } from "next/navigation";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";

interface SaveModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	values: {
		totalEmissionReleased: number;
		totalRows: number;
	};
	isSaving: boolean;
	onConfirm?: VoidFunction;
}

interface IBulkAddHeatAndCoolingData {
	date: string;
	units: string;
	amount: number;
}

const sourceUnits = ["kwh", "mwh"];

const bulkHeatColumnHelper = createColumnHelper<IBulkAddHeatAndCoolingData>();

const editableValidator = new AppEditableValidator();

const bulkColumns: ColumnDef<IBulkAddHeatAndCoolingData, any>[] = [
	bulkHeatColumnHelper.accessor("date", {
		header: "Accounting Date",
		cell: AppEditableCell<IBulkAddHeatAndCoolingData>,
		meta: {
			data: {
				type: "datepicker",
				validate: (val) => editableValidator.validateDate(val, "Invalid Date", true),
			},
		},
	}),
	bulkHeatColumnHelper.accessor("units", {
		header: "Units",
		cell: AppEditableCell<IBulkAddHeatAndCoolingData>,
		meta: {
			data: {
				type: "select",
				options: generateOptions(sourceUnits),
				validate: (val) => editableValidator.validateString(val, "Unit is required"),
				placeholder: "Select Unit",
			},
		},
	}),
	bulkHeatColumnHelper.accessor("amount", {
		header: "Amount",
		// @ts-expect-error
		cell: AppEditableCell<IBulkAddHeatAndCoolingData>,
		meta: {
			data: {
				type: "number",
				validate: (val) => editableValidator.validateNumber(val, "Amount is required"),
				placeholder: "Enter Amount",
			},
		},
	}),
	bulkHeatColumnHelper.display({
		id: "actions",
		header: "Actions",
		cell: AppEditableTableActionBtns<IBulkAddHeatAndCoolingData>,
	}),
];

const HeatAndSteamNewAddData = () => {
	const [editedRows, setEditedRows] = useState<Record<string, IBulkAddHeatAndCoolingData>>({}); // { [rowId]: boolean }
	const [validRows, setValidRows] = useState<Record<string, IBulkAddHeatAndCoolingData>>({}); // { [rowId]: [x: string]: boolean }
	const [data, setData] = useState<IBulkAddHeatAndCoolingData[]>([]);
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
	const [dataToBeSaved, setDataToBeSaved] = useState<IBulkAddHeatAndCoolingData[]>([]);

	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();
	const router = useRouter();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const { saveBulkHeatAndCoolingData } = useAccountingDataUtils();

	const onTabChange = (keys: Set<Key>) => {
		setSelectedTab(keys.values().next().value);
	};

	const onClickSave = () => {
		const validRowsKeys = Object.keys(validRows);

		if (validRowsKeys.length === 0) {
			toast.error("No valid rows to calculate emissions");
			return;
		}

		if (validRowsKeys.length < data.length) {
			toast.error("Some rows are invalid and will not be calculated");
		}

		const validData = data
			.filter((_, idx) => validRows[`${idx}`])
			.map((row) => {
				const { date, units, amount } = row;

				return {
					date,
					emissionSource: "Heat and steam",
					units,
					amount,
				};
			});

		const totalEmissionReleased = validData.reduce((acc, curr) => {
			// sum emissions
			const isNumber = typeof curr.amount === "number";
			const currentAmount = isNumber ? curr.amount : parseFloat(curr.amount as any);

			if (isNaN(currentAmount)) {
				return acc;
			}

			return acc + currentAmount;
		}, 0);
		setModalValues({
			totalEmissionReleased,
			totalRows: validRowsKeys.length,
		});

		setDataToBeSaved(validData);

		setIsOpen(true);
	};

	const onConfirm = async () => {
		setIsSaving(true);

		try {
			const id = toast.loading("Saving data...");

			const resp = await saveBulkHeatAndCoolingData(account?.company?.id, dataToBeSaved as any, account?.id, "heat-and-cooling");

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
				<BreadcrumbItem>Heat & Cooling</BreadcrumbItem>
			</Breadcrumbs>
			<div className="p-6 bg-green-50 mt-10 rounded-md">
				<Tabs selectedKey={selectedTab} disabledKeys={["preview"]} color="primary" onSelectionChange={(key) => onTabChange(new Set([key]))}>
					<Tab key={"add-data"} title={"Add Data"}>
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-semibold">Heat & Steam</h1>
							<UploadExcelSheetModal />
						</div>
						<div className="my-7">
							<p className="text-[#374151]">Record emissions related to your company's temperature control systems, including heating and cooling.</p>
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
						<AppEditableTable<IBulkAddHeatAndCoolingData>
							columns={bulkColumns}
							data={data}
							defaultData={[]}
							setData={setData}
							editedRows={editedRows}
							setEditedRows={setEditedRows}
							validRows={validRows}
							setValidRows={setValidRows}
							otherFooterItems={
								<>
									<Button onPress={onClickSave}>Save</Button>
								</>
							}
						/>
						<SaveModal isOpen={isOpen} setIsOpen={setIsOpen} values={modalValues} isSaving={isSaving} onConfirm={onConfirm} />
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

const SaveModal = ({ isOpen, setIsOpen, onConfirm, values, isSaving }: SaveModalProps) => {
	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
			<ModalContent className="saastain font-nunito">
				{(onClose) => (
					<>
						<ModalHeader>
							<h2 className="text-xl font-bold">Confirm Heat & Steam Data</h2>
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
									<ModalSectionDetail label="Total Emission Released" value={values.totalEmissionReleased} />
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

export default HeatAndSteamNewAddData;
