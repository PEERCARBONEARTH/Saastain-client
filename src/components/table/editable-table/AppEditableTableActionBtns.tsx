"use client";
import { Button, Checkbox, Tooltip } from "@nextui-org/react";
import { Row, Table } from "@tanstack/react-table";
import { CheckCircleIcon, Trash2Icon, XCircleIcon } from "lucide-react";
import { MouseEvent } from "react";
import { FiEdit2 } from "react-icons/fi";

type AppEditableTableActionBtns<T extends object> = {
	table: Table<T>;
	row: Row<T>;
};

const AppEditableTableActionBtns = <T extends object>({ table, row }: AppEditableTableActionBtns<T>) => {
	const meta = table.options.meta;
	const validRow = meta?.validRows[row?.index];

	const disableSave = validRow
		? Object.keys(validRow)
				.filter((item) => !["actions", "undefined"].includes(item))
				.some((item) => !validRow?.[item])
		: false;

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
					<Tooltip content="Cancel" placement="top">
						<Button isIconOnly color="warning" size="sm" onClick={setEditedRows} name="cancel">
							<XCircleIcon className="w-4 h-4" />
						</Button>
					</Tooltip>
					<Tooltip content="Save" placement="top">
						<Button isIconOnly color="success" size="sm" onClick={setEditedRows} name="done" disabled={disableSave} variant="bordered">
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
