import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useOrderUtils from "@/hooks/useOrderUtils";
import { IOrderSiteVisitSchedule } from "@/types/OrderSiteVisitSchedule";
import { Button, useDisclosure } from "@nextui-org/react";
import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

interface IProps {
	siteVisitItem: IOrderSiteVisitSchedule | null;
	mutate?: VoidFunction;
}

const ConfirmSiteVisitModal = ({ siteVisitItem, mutate }: IProps) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { confirmSiteVisit } = useOrderUtils();

	const onClickConfirm = async () => {
		setLoading(true);

		try {
			const resp = await confirmSiteVisit(siteVisitItem.id);

			if (resp?.status === "success") {
				toast.success("Site Visit Confirm Successfully");
				mutate && mutate?.();
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to Confirm Site Visit");
			}
		} catch (err) {
			toast.error("Unable to Confirm Site Visit");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogTrigger asChild>
				<Button color="primary" variant="bordered">
					Confirm Site Visit
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="saastain font-nunito">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This will confirm that site visit was done on <span className="font-bold">{format(new Date(siteVisitItem?.eventDate), "MMM dd, yyyy")}</span>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button color="danger" size="sm" variant="flat">
							Cancel
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button size="sm" color="primary" onPress={onClickConfirm} isLoading={loading} isDisabled={loading}>
							Confirm
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ConfirmSiteVisitModal;
