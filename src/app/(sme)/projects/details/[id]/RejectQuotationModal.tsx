import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useOrderUtils from "@/hooks/useOrderUtils";
import { IOrder, OrderStage } from "@/types/Order";
import { IQuoteDetails } from "@/types/QuoteDetails";
import { formatCurrency } from "@/utils";
import { Button, useDisclosure } from "@heroui/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface IProps {
	orderDetails: IOrder;
	quoteDetails: IQuoteDetails;
	mutate?: VoidFunction;
}

const RejectQuotationModal = ({ orderDetails, quoteDetails, mutate }: IProps) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { smeRejectQuotation, saveNewOrderTimeline } = useOrderUtils();

	const onClickReject = async () => {
		setLoading(true);
		try {
			const resp = await smeRejectQuotation(orderDetails?.id);

			if (resp?.status === "success") {
				toast.success("Quotation Rejected Successfully");
				mutate?.();
				saveNewTimelineInfo();
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to reject quotation at the moment");
			}
		} catch (err) {
			toast.error("Unable to reject quotation at the moment");
		} finally {
			setLoading(false);
		}
	};

	const saveNewTimelineInfo = async () => {
		const info = {
			orderId: orderDetails?.id,
			code: OrderStage.RFQ,
			title: "SME Accepted Quotation",
			description: `${orderDetails?.company?.companyName} has rejected the quotation for ${formatCurrency(Number(quoteDetails?.totalCost))} to purchase ${orderDetails?.product?.name}`,
		};
		try {
			await saveNewOrderTimeline(info);
		} catch (err) {}
	};

	return (
		<>
			<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
				<AlertDialogTrigger asChild>
					<Button color="danger">Reject Quotation</Button>
				</AlertDialogTrigger>
				<AlertDialogContent className="saastain font-nunito">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>This action cannot be undone. This will cancel this project from going on</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel asChild>
							<Button color="danger" size="sm" variant="flat">
								Cancel
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button isLoading={loading} isDisabled={loading} onPress={onClickReject} color="primary" size="sm">
								Reject
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default RejectQuotationModal;
