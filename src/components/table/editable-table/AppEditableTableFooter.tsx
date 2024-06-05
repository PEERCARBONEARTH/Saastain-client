import { Button } from "@nextui-org/react";
import { Table } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";

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
	return (
		<div className="flex items-center space-x-2">
			<Button onClick={meta.addRow} size="sm" color="primary">
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
