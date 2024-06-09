"use client";

import UploadExcelSheetModal from "@/components/modals/UploadExcelSheetModal";
import AppEditableCell from "@/components/table/editable-table/AppEditableCell";
import AppEditableTable from "@/components/table/editable-table/AppEditableTable";
import AppEditableTableActionBtns from "@/components/table/editable-table/AppEditableTableActionBtns";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IOption } from "@/types/Forms";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

const formOptions: IOption[] = [
	{
		label: "Form 1",
		value: "form1",
	},
	{
		label: "Form 2",
		value: "form2",
	},
	{
		label: "Form 3",
		value: "form3",
	},
	{
		label: "Form 4",
		value: "form4",
	},
];

interface IStudent {
	name: string;
	age: string;
	stream: string;
	form: string;
	admno: string;
	admissionDate: Date;
}

const columnHelper = createColumnHelper<IStudent>();

const columns: ColumnDef<IStudent>[] = [
	columnHelper.accessor("name", {
		header: "Name",
		cell: AppEditableCell<IStudent>,
		meta: {
			data: {
				type: "text",
				validate(val) {
					if (!val || val === "") {
						return { valid: false, error: "Please enter name" };
					}

					return { valid: true, error: null };
				},
				placeholder: "e.g. John Doe",
			},
		},
	}),
	columnHelper.accessor("age", {
		header: "Age",
		cell: AppEditableCell<IStudent>,
		meta: {
			data: {
				type: "number",
				validate(val) {
					const age = typeof val === "string" ? parseInt(val) : parseInt(String(val));

					if (!age) {
						return { valid: false, error: "Age must be a number" };
					}

					return { valid: true, error: null };
				},
				placeholder: "e.g. 24",
			},
		},
	}),
	columnHelper.accessor("stream", {
		header: "Stream",
		cell: AppEditableCell<IStudent>,
		meta: {
			data: {
				type: "text",
				validate(val) {
					if (!val || val === "") {
						return { valid: false, error: "Please enter stream" };
					}

					return { valid: true, error: null };
				},
				placeholder: "e.g. Yellow",
			},
		},
	}),
	columnHelper.accessor("form", {
		header: "Form",
		cell: AppEditableCell<IStudent>,
		meta: {
			data: {
				type: "select",
				options: formOptions,
				validate(val) {
					if (!val || val === "") {
						return {
							valid: false,
							error: "Please select student's form",
						};
					}

					return { valid: true, error: null };
				},
				placeholder: "Choose form",
			},
		},
	}),
	columnHelper.accessor("admno", {
		header: "Admission",
		cell: AppEditableCell<IStudent>,
		meta: {
			data: {
				type: "number",
				validate(val) {
					const adm = typeof val === "string" ? parseInt(val) : parseInt(String(val));

					if (!adm) {
						return { valid: false, error: "Adm must be a number" };
					}

					return { valid: true, error: null };
				},
				placeholder: "e.g. 5425",
			},
		},
	}),
	columnHelper.accessor("admissionDate", {
		header: "Admission Date",
		// @ts-expect-error
		cell: AppEditableCell<IStudent>,
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
	columnHelper.display({
		id: "actions",
		header: "Actions",
		cell: AppEditableTableActionBtns<IStudent>,
	}),
];

const BulkAddElectricityData = () => {
	const [editedRows, setEditedRows] = useState<Record<string, IStudent>>({});
	const [validRows, setValidRows] = useState<Record<string, IStudent>>({});

	const [data, setData] = useState<IStudent[]>([]);

	console.log(data);
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Accounting</BreadcrumbItem>
				<BreadcrumbItem href={AppEnumRoutes.APP_ADD_DATA}>Add Data</BreadcrumbItem>
				<BreadcrumbItem>Eletricity Data</BreadcrumbItem>
			</Breadcrumbs>
			<div className="p-10 bg-green-50 mt-10 rounded-md">
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
									<p className="text-xs md:text-sm font-medium">If your organization uses renewable energy sources, be sure to document this to reflect the emission benefits of cleaner energy</p>
								</div>
							</div>
						</AccordionItem>
					</Accordion>
				</div>
				<div className="">
					<AppEditableTable<IStudent>
						columns={columns}
						defaultData={data}
						data={data}
						setData={setData}
						editedRows={editedRows}
						setEditedRows={setEditedRows}
						validRows={validRows}
						setValidRows={setValidRows}
					/>
				</div>
			</div>
		</>
	);
};

export default BulkAddElectricityData;
