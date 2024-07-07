import AddNewVendorInterest from "@/components/modals/AddNewVendorInterest";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppKey } from "@/types/Global";
import { IVendorProfile } from "@/types/VendorProfile";
import { Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { format } from "date-fns";
import { useCallback } from "react";
import { LuMoreVertical } from "react-icons/lu";
import useSWR from "swr";

const statusColorMap = {
	active: "success",
	inactive: "error",
	suspended: "warning",
	deleted: "error",
};

const columns: IAppTableColumn[] = [
	{
		name: "Vendor Name",
		uid: "companyName",
	},
	{
		name: "Vendor Email",
		uid: "vendorEmail",
	},
	{
		name: "Vendor Phone No",
		uid: "vendorPhoneNo",
	},
	{
		name: "Status",
		uid: "status",
	},
	{
		name: "Join Date",
		uid: "createdAt",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const VendorListTab = () => {
	const renderCell = useCallback((item: IVendorProfile, columnKey: AppKey) => {
		switch (columnKey) {
			case "companyName":
				return <span>{item.companyName}</span>;
			case "status":
				return <Chip color={statusColorMap[item.status] as any}>{item.status}</Chip>;
			case "createdAt":
				return <span>{format(new Date(item.createdAt), "dd/MM/yyyy")}</span>;
			case "actions":
				return (
					<Dropdown>
						<DropdownTrigger>
							<LuMoreVertical size={20} />
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownItem>View</DropdownItem>
							<DropdownItem>Edit</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				);

			case "vendorPhoneNo":
				return <span>{item.phoneNo}</span>;
			case "vendorEmail":
				return <span>{item.createdBy ? item.createdBy?.email : "----"}</span>;
			default:
				return null;
		}
	}, []);

	const { data: vendors, isLoading } = useSWR<IVendorProfile[]>([IApiEndpoint.GET_VENDOR_PROFILES], swrFetcher, { keepPreviousData: true });
	return (
		<AppTable<IVendorProfile>
			title={"Vendors"}
			data={vendors ?? []}
			count={vendors?.length ?? 0}
			headerColumns={columns}
			isLoading={isLoading}
			renderCell={renderCell}
			columnsToShowOnMobile={["companyName", "actions", "status"]}>
			<AddNewVendorInterest />
		</AppTable>
	);
};

export default VendorListTab;
