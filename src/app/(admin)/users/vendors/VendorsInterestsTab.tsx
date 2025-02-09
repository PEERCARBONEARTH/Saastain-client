import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppKey } from "@/types/Global";
import { IVendorInterest } from "@/types/VendorInterest";
import { Button, Chip, useDisclosure } from "@heroui/react";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import useSWR from "swr";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useVendorUtils from "@/hooks/useVendorUtils";
import toast from "react-hot-toast";

interface IAlertRejectVendorInterestProps {
	vendorInterestInfo: IVendorInterest;
	variant: "reject" | "approve";
	mutate?: VoidFunction;
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
	rejected: "danger",
};

const VendorsInterestsTab = () => {
	const { data: vendorsInterests, isLoading, mutate } = useSWR<IVendorInterest[]>([IApiEndpoint.VENDOR_INTEREST], swrFetcher, { keepPreviousData: true });

	const renderCell = useCallback((item: IVendorInterest, columnKey: AppKey) => {
		const allowApproveArr = ["pending", "in_progress"];
		const allowApprove = allowApproveArr.includes(item.status); // Update this line

		switch (columnKey) {
			case "companyName":
				return <span>{item.companyName}</span>;
			case "status":
				return <Chip color={statusColorMap[item.status] as any}>{item.status}</Chip>;
			case "createdAt":
				return <span>{format(new Date(item.createdAt), "dd/MM/yyyy")}</span>;
			case "actions":
				return (
					<>
						{allowApprove ? (
							<div className="flex items-center gap-2">
								<AlertAcceptRejectVendorInterest vendorInterestInfo={item} variant="reject" mutate={mutate} />
								<AlertAcceptRejectVendorInterest vendorInterestInfo={item} variant="approve" mutate={mutate} />
							</div>
						) : (
							<Button size="sm" color="warning">Move to In Progress</Button>
						)}
					</>
				);

			case "vendorPhoneNo":
				return <span>{item.vendorPhoneNo ?? "----"}</span>;
			case "vendorEmail":
				return <span>{item.vendorEmail}</span>;
			default:
				return null;
		}
	}, []);

	return <AppTable<IVendorInterest> title="Interests" headerColumns={columns} data={vendorsInterests ?? []} isLoading={isLoading} renderCell={renderCell} count={vendorsInterests?.length ?? 0} />;
};

const AlertAcceptRejectVendorInterest = ({ vendorInterestInfo, variant, mutate }: IAlertRejectVendorInterestProps) => {
	const { approveVendorInterest, rejectVendorInterest } = useVendorUtils();
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);
	const onClickBtn = async () => {
		setLoading(true);

		try {
			const resp = await (variant === "reject" ? rejectVendorInterest(vendorInterestInfo.id) : approveVendorInterest(vendorInterestInfo.id));

			if (resp.status === "success") {
				toast.success(variant === "reject" ? "Vendor Interest rejected successfully" : "Vendor Interest approved successfully");
				mutate && mutate?.();
				onClose();
			} else {
				toast.success(variant === "reject" ? "Unable to reject Vendor Interest at the moment" : "Unable to approve Vendor Interest at the moment");
			}
		} catch (err) {
			toast.success(variant === "reject" ? "Unable to reject Vendor Interest at the moment" : "Unable to approve Vendor Interest at the moment");
		} finally {
			setLoading(false);
		}
	};
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogTrigger asChild>
				<Button size={"sm"} color={variant === "reject" ? "danger" : "primary"}>
					{variant === "reject" && "Reject"}
					{variant === "approve" && "Approve"}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="saastain font-nunito">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						{variant === "reject" && (
							<>
								This action cannot be undone. This will reject interest for the <span className="font-bold">{vendorInterestInfo?.companyName}</span> to join SaaStain as a Vendor.
							</>
						)}
						{variant === "approve" && (
							<>
								This will approve interest for the <span className="font-bold">{vendorInterestInfo?.companyName}</span> to join SaaStain as a Vendor. This will allow the Vendor to list products on Vendor
								portal and accept orders.
							</>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button>Cancel</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button color="primary" onPress={onClickBtn} isLoading={loading} isDisabled={loading}>
							Continue
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default VendorsInterestsTab;
