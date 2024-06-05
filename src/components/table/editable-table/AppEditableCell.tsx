"use client";
import { IOption } from "@/types/Forms";
import { cn } from "@nextui-org/react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

type AppEditableCellProps<T = any> = {
	getValue: Getter<T>;
	row: Row<T>;
	column: Column<T, string>;
	table: Table<T>;
};

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends unknown, TValue> {
		type?: "number" | "text" | "email" | "tel" | "date" | "select";
		required?: boolean;
		pattern?: string;
		validate?: (val: TValue) => boolean;
		validationMessage?: string;
		options?: IOption[];
	}
}

const AppEditableCell = <T extends object>({ getValue, row, column, table }: AppEditableCellProps<T>) => {
	const initialValue = getValue();

	const columnMeta = column.columnDef.meta;
	const tableMeta = table.options.meta;

	const [value, setValue] = useState<T[keyof T]>(initialValue as T[keyof T]);
	const [validationMessage, setValidationMessage] = useState<string>(undefined);

	useEffect(() => {
		setValue(initialValue as T[keyof T]);
	}, [initialValue]);

	const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
		displayValidationMessage(e);
		tableMeta?.updateData(row?.index, column.id, value, e.target.validity.valid);
	};

	const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
		displayValidationMessage(e);
		setValue(e.target.value as any);
		tableMeta?.updateData(row?.index, column.id, e.target.value, e.target.validity.valid);
	};

	const displayValidationMessage = <P extends HTMLInputElement | HTMLSelectElement>(e: ChangeEvent<P>) => {
		if (columnMeta?.validate) {
			const isValid = columnMeta?.validate(e.target.value as any);
			if (isValid) {
				e.target.setCustomValidity("");
				setValidationMessage(null);
			} else {
				e.target.setCustomValidity(columnMeta.validationMessage || "Invalid input");
				setValidationMessage(columnMeta.validationMessage || "Invalid input");
			}
		} else if (e.target.validity.valid) {
			setValidationMessage(null);
		} else {
			setValidationMessage(e.target.validationMessage);
		}
	};

	if (tableMeta?.editedRows[row.id]) {
		return columnMeta?.type === "select" ? (
			<>
				<select onChange={onSelectChange} value={value as any} required={columnMeta?.required} title={validationMessage}>
					{columnMeta?.options?.map((option: IOption) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</>
		) : (
			<>
				<input
					className={cn("block w-full p-2 text-gray-900 border rounded-lg bg-gray-50 text-sm outline-none border-primary-300 focus:ring-primary-500 focus:border-primary-500")}
					value={value as any}
					onChange={(e) => setValue(e.target.value as any)}
					onBlur={onBlur}
					type={columnMeta?.type || "text"}
					required={columnMeta?.required}
					pattern={columnMeta?.pattern}
					title={validationMessage}
				/>
				{validationMessage && <span className="text-red-500 text-xs">{validationMessage}</span>}
			</>
		);
	}

	return (
		<div className="flex items-center space-x-2">
			<p>{value as any}</p>
			{/* Show if its valid */}
			{columnMeta?.validate && <span>{columnMeta?.validate(value as any) ? <CheckCircle className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-danger" />}</span>}
		</div>
	);
};

export default AppEditableCell;
