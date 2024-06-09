"use client";
import { ColumnDef, flexRender, getCoreRowModel, RowData, useReactTable } from "@tanstack/react-table";
import { SetStateAction, useState } from "react";
import AppEditableTableFooter from "./AppEditableTableFooter";
import {
	ShadTable as Table,
	ShadTableHead as TableHead,
	ShadTableRow as TableRow,
	ShadTableHeader as TableHeader,
	ShadTableBody as TableBody,
	ShadTableCell as TableCell,
	ShadTableFooter as TableFooter,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
	interface TableMeta<TData extends RowData> {
		/**
		 * A fn that updates each row input item to new value
		 * @param rowIndex
		 * @param columnId
		 * @param value
		 * @param isValid
		 * @returns Void
		 */
		updateData: (rowIndex: number, columnId: string, value: any, isValid: boolean) => void;
		/**
		 * Method for reverting a row data to the previous known state (back time travel)
		 * @param rowIndex
		 * @param revert
		 * @returns
		 */
		revertData: (rowIndex: number, revert: boolean) => void;
		/**
		 * Adds a row to the table
		 * @returns
		 */
		addRow: () => void;
		/**
		 * Removes row from the table
		 * @param rowIndex
		 * @returns
		 */
		removeRow: (rowIndex: number) => void;
		/**
		 * Removes a set of selected rows from the table
		 * @param selectedRows Array
		 * @returns
		 */
		removeSelectedRows: (selectedRows: number[]) => void;
		/**
		 * Record for edited rows
		 */
		editedRows: Record<string, TData>;
		/**
		 * Updater fn for edited rows
		 * @param editedRows
		 * @returns
		 */
		setEditedRows: (editedRows: object) => void;
		/**
		 * Record for valid fows
		 */
		validRows: object;
		/**
		 * Updater fn for valid rows
		 * @param validRows
		 * @returns
		 */
		setValidRows: (validRows: Record<string, TData>) => void;
	}
}

type AppEditableTableProps<T extends object> = {
	/**
	 * Refer to the default to be included in the table if it exists
	 */
	defaultData: T[];
	/**
	 * Data to be stored
	 */
	data: T[];
	/**
	 * Updates data
	 * @param value - Dispatch action data fn to update data
	 * @returns
	 */
	setData: (value: SetStateAction<T[]>) => void;
	/**
	 * Tanstack declared tables for loading the various fields dynamically
	 */
	columns: ColumnDef<T>[];
	/**
	 * Captures the editted fields to keep track
	 */
	editedRows: Record<string, T>;
	/**
	 * Record for saving the valid rows stored
	 */
	validRows: Record<string, T>;
	setEditedRows: (value: SetStateAction<object>) => void;
	setValidRows: (value: SetStateAction<{ [key: string]: T }>) => void;
};

/**
 * A reusable Data Table for editting (sort of excel)
 * 
 * @example
 * 
 * ```tsx
 * 
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
    age: number;
    stream: string;
    form: string;
    admno: number;
}

const columnHelper = createColumnHelper<IStudent>();

const columns: ColumnDef<IStudent>[] = [
    columnHelper.accessor("name", {
        header: "Name",
        cell: EditableCell<IStudent>,
        meta: {
            data: {
                type: "text",
                validate(val) {
                    if (!val || val === "") {
                        return { valid: false, error: "Please enter name" };
                    }

                    return { valid: true, error: null };
                },
            },
        },
    }),
    columnHelper.accessor("age", {
        header: "Age",
        cell: EditableCell<IStudent>,
        meta: {
            data: {
                type: "number",
                validate(val) {
                    const age =
                        typeof val === "string"
                            ? parseInt(val)
                            : parseInt(String(val));

                    if (!age) {
                        return { valid: false, error: "Age must be a number" };
                    }

                    return { valid: true, error: null };
                },
            },
        },
    }),
    columnHelper.accessor("stream", {
        header: "Stream",
        cell: EditableCell<IStudent>,
        meta: {
            data: {
                type: "text",
                validate(val) {
                    if (!val || val === "") {
                        return { valid: false, error: "Please enter stream" };
                    }

                    return { valid: true, error: null };
                },
            },
        },
    }),
    columnHelper.accessor("form", {
        header: "Form",
        cell: EditableCell<IStudent>,
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
            },
        },
    }),
    columnHelper.accessor("admno", {
        header: "Admission",
        cell: EditableCell<IStudent>,
        meta: {
            data: {
                type: "number",
                validate(val) {
                    const adm =
                        typeof val === "string"
                            ? parseInt(val)
                            : parseInt(String(val));

                    if (!adm) {
                        return { valid: false, error: "Adm must be a number" };
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

const [editedRows, setEditedRows] = useState<Record<string, IStudent>>({});
    const [validRows, setValidRows] = useState<Record<string, IStudent>>({});

    const [data, setData] = useState<IStudent[]>([]);


    return (
        <div>
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
    );
 * ```
 */
const AppEditableTable = <T extends object>({ defaultData, data, setData, columns, editedRows, setEditedRows, validRows, setValidRows }: AppEditableTableProps<T>) => {
	const [originalData, setOriginalData] = useState<T[]>([...defaultData]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel<T>(),
		enableRowSelection: true,
		meta: {
			editedRows,
			setEditedRows,
			validRows,
			setValidRows,
			revertData: (rowIndex: number, revert: boolean) => {
				if (revert) {
					setData((prev) => prev.map((row, idx) => (idx === rowIndex ? originalData[rowIndex] : row)));
				} else {
					setOriginalData((old) => old.map((row, idx) => (idx === rowIndex ? data[rowIndex] : row)));
				}
			},
			updateData: (rowIndx: number, columnId: string, value: any, isValid: boolean) => {
				setData((old) =>
					old.map((row, idx) => {
						if (idx === rowIndx) {
							return {
								...old[rowIndx],
								[columnId]: value,
							};
						}

						return row;
					})
				);

				setValidRows((old) => ({
					...old,
					[rowIndx]: { ...(old[rowIndx] || {}), [columnId]: isValid },
				}));
			},

			addRow() {
				const newRow = columns.reduce((acc, column) => {
					const colId = column.id as string;
					acc[colId] = "";
					return acc;
				}, {} as T);

				console.log('New Row', newRow)

				const setFn = (old: T[]) => [...old, newRow];

				setData(setFn);

				setOriginalData(setFn);
			},

			removeRow(rowIndex) {
				const setFilterFn = (old: T[]) => old.filter((_, idx) => idx !== rowIndex);

				setData(setFilterFn);
				setOriginalData(setFilterFn);
			},
			removeSelectedRows(selectedRows) {
				const setFilterFn = (old: T[]) => old.filter((_, idx) => !selectedRows.includes(idx));

				setData(setFilterFn);
				setOriginalData(setFilterFn);
			},
		},
	});

	return (
		<>
			<div className="bg-white rounded-2xl border container">
				<Table containerClassName="max-h-[60vh] overflow-y-scroll" className=" border-collapse border-spacing-0">
					<TableHeader className="sticky w-full top-0 h-10 z-10 bg-primary">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="">
								{headerGroup.headers.map((header) => (
									<TableHead className={cn("text-sm font-semibold text-white first:rounded-tl-2xl last:rounded-tr-2xl")} key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={table.getCenterLeafColumns().length} align="right">
								<AppEditableTableFooter table={table} />
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</div>
		</>
	);
};

export default AppEditableTable;
