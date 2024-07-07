import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppKey } from "@/types/Global";
import { IVendorInterest } from "@/types/VendorInterest";
import { Button, Chip } from "@nextui-org/react";
import { format } from "date-fns";
import { useCallback } from "react";
import useSWR from "swr";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface IAlertRejectVendorInterestProps {
	vendorInterestInfo: IVendorInterest;
}

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
		name: "Created On",
		uid: "createdAt",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const statusColorMap = {
	pending: "default",
	in_progress: "primary",
	approved: "success",
	cancelled: "warning",
	rejected: "error",
};

const VendorsInterestsTab = () => {
	const renderCell = useCallback((item: IVendorInterest, columnKey: AppKey) => {
		switch (columnKey) {
			case "companyName":
				return <span>{item.companyName}</span>;
			case "status":
				return <Chip color={statusColorMap[item.status] as any}>{item.status}</Chip>;
			case "createdAt":
				return <span>{format(new Date(item.createdAt), "dd/MM/yyyy")}</span>;
			case "actions":
				return (
					<div className="flex items-center gap-2">
						<AlertRejectVendorInterest vendorInterestInfo={item} />
						<Button size={"sm"} color="primary">
							Approve
						</Button>
					</div>
				);

			case "vendorPhoneNo":
				return <span>{item.vendorPhoneNo ?? "----"}</span>;
			case "vendorEmail":
				return <span>{item.vendorEmail}</span>;
			default:
				return null;
		}
	}, []);

	const { data: vendorsInterests, isLoading } = useSWR<IVendorInterest[]>([IApiEndpoint.VENDOR_INTEREST], swrFetcher, { keepPreviousData: true });

	return <AppTable<IVendorInterest> title="Interests" headerColumns={columns} data={vendorsInterests ?? []} isLoading={isLoading} renderCell={renderCell} count={vendorsInterests?.length ?? 0} />;
};

const AlertRejectVendorInterest = ({ vendorInterestInfo }: IAlertRejectVendorInterestProps) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size={"sm"} color="danger">
					Reject
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="saastain font-nunito">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will reject interest for the <span className="font-bold">{vendorInterestInfo?.companyName}</span> to join SaaStain as a Vendor
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button>Cancel</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button color="primary" >Continue</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default VendorsInterestsTab;
