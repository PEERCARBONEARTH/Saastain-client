"use client";
import { Button, Checkbox, Tooltip } from "@nextui-org/react";
import { Row, Table } from "@tanstack/react-table";
import { CheckCircleIcon, Trash2Icon } from "lucide-react";
import { MouseEvent, useMemo } from "react";
import { FiEdit2 } from "react-icons/fi";

type AppEditableTableActionBtns<T extends object> = {
	table: Table<T>;
	row: Row<T>;
};

function checkIfRowIsValid<T>(table: Table<T>, row: Row<T>) {
	let validations: boolean[] = [];

	let keys = Object.keys(row._valuesCache);

	keys.forEach((itemCol) => {
		const itemVal = row.getValue(itemCol);

		const col = table.getColumn(itemCol);

		const colMeta = col.columnDef.meta!;

		if (colMeta?.data?.validate) {
			const { valid } = colMeta?.data?.validate(itemVal);

			validations.push(valid);
		} else {
			if (colMeta?.data?.isRequired && !itemVal) {
				validations.push(false);
			} else if (!colMeta?.data?.isRequired) {
				validations.push(true);
			} else {
				validations.push(true);
			}
		}
	});

	return validations;
}

const AppEditableTableActionBtns = <T extends object>({ table, row }: AppEditableTableActionBtns<T>) => {
	const meta = table.options.meta;

	const validations = useMemo(() => {
		return checkIfRowIsValid(table, row);
	}, [table, row]);

	const disableSave = !validations.every(Boolean);

	const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
		const elName = e.currentTarget.name;

		meta?.setEditedRows((old: any) => ({
			...old,
			[row.id]: !old[row.id],
		}));

		if (elName !== "edit") {
			meta?.revertData(row.index, e.currentTarget.name === "cancel");
		}
	};

	const removeRow = () => {
		meta?.removeRow(row.index);
	};
	return (
		<div className="flex items-center space-x-2">
			{meta?.editedRows[row.id] ? (
				<>
					{/* <Tooltip content="Cancel" placement="top">
						<Button isIconOnly color="warning" size="sm" onClick={setEditedRows} name="cancel" isDisabled={disableSave}>
							<XCircleIcon className="w-4 h-4" />
						</Button>
					</Tooltip> */}
					<Tooltip content="Remove" placement="top">
						<Button isIconOnly color="danger" size="sm" onClick={removeRow}>
							<Trash2Icon className="w-4 h-4" />
						</Button>
					</Tooltip>
					<Tooltip content="Save" placement="top">
						<Button isIconOnly color="success" size="sm" onClick={setEditedRows} name="done" isDisabled={disableSave} variant="bordered">
							<CheckCircleIcon className="w-4 h-4" />
						</Button>
					</Tooltip>
				</>
			) : (
				<>
					<Tooltip content="Edit" placement="top">
						<Button isIconOnly color="primary" size="sm" onClick={setEditedRows} name="edit">
							<FiEdit2 className="w-4 h-4" />
						</Button>
					</Tooltip>
					<Tooltip content="Remove" placement="top">
						<Button isIconOnly color="danger" size="sm" onClick={removeRow}>
							<Trash2Icon className="w-4 h-4" />
						</Button>
					</Tooltip>
				</>
			)}
			<Checkbox isSelected={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} color="primary" />
		</div>
	);
};

export default AppEditableTableActionBtns;
