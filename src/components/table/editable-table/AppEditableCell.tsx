"use client";
import AppInput from "@/components/forms/AppInput";
import { IOption } from "@/types/Forms";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import {
	ShadSelect as Select,
	ShadSelectTrigger as SelectTrigger,
	ShadSelectValue as SelectValue,
	ShadSelectContent as SelectContent,
	ShadSelectGroup as SelectGroup,
	ShadSelectLabel as SelectLabel,
	ShadSelectItem as SelectItem,
} from "@/components/ui/select";
import AppDatePicker from "@/components/buttons/datepicker";

type AppEditableCellProps<T = any> = {
	getValue: Getter<T>;
	row: Row<T>;
	column: Column<T, string>;
	table: Table<T>;
};

/**
 * Return type for each validation of a field
 */
type ValidationResult = {
	/**
	 * Whether the field being validated is valid or not
	 */
	valid: boolean;
	/**
	 * Custom error message input validation
	 */
	error: string | undefined | null;
};

interface INonRequired<T = unknown> {
	/**
	 *
	 * @param val Value to be validated
	 * @returns ValidationResult
	 */
	validate: (val: T) => ValidationResult;
	placeholder: string;
	isRequired: boolean;
}

interface IOptionBased<T = any> extends Partial<INonRequired<T>> {
	type: "select" | "radio";
	options: IOption[];
}

interface ITextBased<T = any> extends Partial<INonRequired<T>> {
	type: "number" | "text";
}

interface IDatePicker<T = any> extends Partial<INonRequired<T>> {
	type: "datepicker";
}

/**
 * Custom metadata for each input field, not limited to just input and select but also can be extended to other fields
 */
type ExtendedColMeta<T = any> = ITextBased<T> | IOptionBased<T> | IDatePicker<T>;

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends unknown, TValue> {
		data: ExtendedColMeta<TValue>;
	}
}

/**
 * A reusable Editable Cell for input and showing data
 * 
 * @example
 * 
 * ```tsx
 * interface IStudent {
    name: string;
    age: number;
    stream: string;
    form: string;
    admno: number;
}

const columnHelper = createColumnHelper<IStudent>();

const columns: ColumnDef<IStudent>() = [
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
]
*
* ```
 */

const AppEditableCell = <T extends object>({ getValue, row, column, table }: AppEditableCellProps<T>) => {
	const initialValue = getValue();

	const columnMeta = column.columnDef.meta;
	const tableMeta = table.options.meta;

	const [value, setValue] = useState<T[keyof T]>(initialValue as T[keyof T]);
	const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);

	useEffect(() => {
		setValue(initialValue as T[keyof T]);
	}, [initialValue]);

	const onBlur = (e: FocusEvent<HTMLInputElement>) => {
		displayMessage(e);
		tableMeta?.updateData(row?.index, column?.id, value, !validationMessage);
	};

	const displayMessage = <T extends HTMLInputElement | HTMLSelectElement>(e: ChangeEvent<T>) => {
		if (columnMeta?.data?.validate) {
			const { valid: isValid, error } = columnMeta?.data?.validate(e.target?.value);

			if (isValid) {
				e.target?.setCustomValidity("");
				setValidationMessage(undefined);
			} else {
				setValidationMessage(error);
			}
		} else if (e.target?.validity?.valid) {
			setValidationMessage(undefined);
		} else {
			setValidationMessage(e.target?.validationMessage);
		}
	};

	const displaySelectValidationMessage = (val: string) => {
		if (columnMeta?.data?.validate) {
			const { valid: isValid, error } = columnMeta?.data?.validate(val);

			if (isValid) {
				setValidationMessage(undefined);
			} else {
				setValidationMessage(error);
			}
		} else {
			setValidationMessage(undefined);
		}
	};

	const onSelectChange = (val: string) => {
		displaySelectValidationMessage(val);
		setValue(val as any);
		tableMeta?.updateData(row?.index, column.id, val, !validationMessage);
	};
	const onInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
		displayMessage(e);
		setValue(e.target.value as T[keyof T]);
	};

	const onDatePickerChange = (val: T[keyof T]) => {
		displaySelectValidationMessage(val as any);
		setValue(val);
	};

	if (tableMeta?.editedRows[row?.id]) {
		switch (columnMeta?.data?.type) {
			case "select":
			case "radio":
				return (
					<>
						<Select onValueChange={onSelectChange}>
							<SelectTrigger>
								<SelectValue placeholder={columnMeta?.data?.placeholder ?? "Select an option"} />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Options</SelectLabel>
									{columnMeta?.data?.options?.map((opt: IOption) => (
										<SelectItem value={opt?.value as string}>{opt?.label}</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<p>{validationMessage && <span className="text-red-500 text-xs">{validationMessage}</span>}</p>
					</>
				);
			case "number":
			case "text":
				return (
					<>
						<AppInput value={value as string} onChange={(e) => onInputValueChange(e)} onBlur={onBlur} type={columnMeta?.data?.type} placeholder={columnMeta?.data?.placeholder} />
						{validationMessage && <span className="text-red-500 text-xs">{validationMessage}</span>}
					</>
				);
			case "datepicker":
				return (
					<>
						<AppDatePicker value={value as Date} onChange={(val) => onDatePickerChange(val as any)} />
						{validationMessage && <span className="text-red-500 text-xs">{validationMessage}</span>}
					</>
				);
		}
	}

	return (
		<div className="flex items-center space-x-2">
			{value as any}
			{columnMeta?.data?.validate && <span className="ml-2">{columnMeta?.data?.validate(value as any) ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-destructive" />}</span>}
		</div>
	);
};

export default AppEditableCell;
