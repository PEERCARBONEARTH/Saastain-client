"use client";
import { Chip } from "@nextui-org/react";
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

declare module "@tanstack/react-table" {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: any, isValid: boolean) => void;
		revertData: (rowIndex: number, revert: boolean) => void;
		addRow: () => void;
		removeRow: (rowIndex: number) => void;
		removeSelectedRows: (selectedRows: number[]) => void;
		editedRows: Record<string, TData>;
		setEditedRows: (editedRows: object) => void;
		validRows: object;
		setValidRows: (validRows: Record<string, TData>) => void;
	}
}

type AppEditableTableProps<T extends object> = {
	title?: string;
	defaultData: T[];
	data: T[];
	setData: (value: SetStateAction<T[]>) => void;
	columns: ColumnDef<T>[];
	editedRows: Record<string, T>;
	validRows: Record<string, T>;
	setEditedRows: (value: SetStateAction<object>) => void;
	setValidRows: (value: SetStateAction<{ [key: string]: T }>) => void;
};

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
			<div className="bg-white p-4 rounded-2xl border container">
				<div className="flex items-center justify-between my-4">
					<div className="flex items-center space-x-4">
						<p className="text-xs lowercase">
							<span className="capitalize mr-2">Total</span>
							<strong>{table.getRowModel().rows.length}</strong> records
						</p>
						<Chip size="sm">
							{Object.keys(editedRows).length} {Object.keys(editedRows).length === 1 ? "row" : "rows"} edited
						</Chip>
						<Chip size="sm">
							{Object.keys(validRows).length} {Object.keys(validRows).length === 1 ? "row" : "rows"} valid
						</Chip>
					</div>
					<AppEditableTableFooter table={table} />
				</div>
				<Table containerClassName="max-h-[60vh] overflow-y-scroll">
					<TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md  bg-gray-100 z-10">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="rounded-2xl">
								{headerGroup.headers.map((header) => (
									<TableHead className="uppercase text-sm font-semibold" key={header.id}>
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
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
