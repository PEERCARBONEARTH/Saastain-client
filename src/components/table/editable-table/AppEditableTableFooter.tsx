import { Button } from "@nextui-org/react";
import { Table } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import { IoIosAddCircleOutline } from "react-icons/io";

type AppEditableTableFooterProps<T extends object> = {
	table: Table<T>;
};

const AppEditableTableFooter = <T extends object>({ table }: AppEditableTableFooterProps<T>) => {
	const meta = table.options.meta;

	const selectedRows = table.getSelectedRowModel().rows;

	const removeRows = () => {
		meta?.removeSelectedRows(table.getSelectedRowModel().rows.map((row) => row.index));
		table.resetRowSelection();
	};

	const onAddRow = () => {
		const rows = table.getRowModel().rows;

		let lastIndex: number;

		if (rows.length > 0) {
			const lastItem = rows[rows.length - 1];

			lastIndex = lastItem.index;

			meta?.addRow();

			meta?.onAddRow && meta?.onAddRow(table, `${lastIndex + 1}`);

			setTimeout(() => {
				meta?.setEditedRows((old: any) => ({
					...old,
					[`${lastIndex + 1}`]: !old[`${lastIndex + 1}`],
				}));
			}, 300);
		} else {
			lastIndex = 0;

			meta?.addRow();

			meta?.onAddRow && meta?.onAddRow(table, `${lastIndex}`);

			setTimeout(() => {
				meta?.setEditedRows((old: any) => ({
					...old,
					[`${lastIndex}`]: !old[`${lastIndex}`],
				}));
			}, 300);
		}
	};

	return (
		<div className="flex items-center space-x-2">
			<Button startContent={<IoIosAddCircleOutline className="w-5 h-5" />} onClick={onAddRow} size="md" color="primary">
				Add Row
			</Button>
			{selectedRows.length > 0 && (
				<Button onClick={removeRows} size="sm" color="danger" startContent={<TrashIcon className="w-4 h-4" />}>
					{selectedRows.length > 1 ? `Remove ${selectedRows.length} Rows` : "Remove Row"}
				</Button>
			)}
		</div>
	);
};

export default AppEditableTableFooter;
