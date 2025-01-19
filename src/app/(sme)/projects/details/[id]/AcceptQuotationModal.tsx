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

const AcceptQuotationModal = ({ orderDetails, quoteDetails, mutate }: IProps) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { smeAcceptQuotation, saveNewOrderTimeline } = useOrderUtils();

	const onClickContinue = async () => {
		setLoading(true);
		try {
			const resp = await smeAcceptQuotation(orderDetails?.id, quoteDetails?.id);

			if (resp?.status === "success") {
				toast.success("Quotation Accepted Successfully");
				mutate?.();
				saveNewTimelineInfo();
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to accept quotation at the moment");
			}
		} catch (err) {
			toast.error("Unable to accept quotation at the moment");
		} finally {
			setLoading(false);
		}
	};

	const saveNewTimelineInfo = async () => {
		const info = {
			orderId: orderDetails?.id,
			code: OrderStage.RFQ,
			title: "SME Accepted Quotation",
			description: `${orderDetails?.company?.companyName} has accepted the quotation for ${formatCurrency(Number(quoteDetails?.totalCost))} to purchase ${orderDetails?.product?.name}`,
		};
		try {
			await saveNewOrderTimeline(info);
		} catch (err) {}
	};

	return (
		<>
			<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
				<AlertDialogTrigger asChild>
					<Button className="bg-green-700 text-white">Accept Quotation</Button>
				</AlertDialogTrigger>
				<AlertDialogContent className="saastain font-nunito">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action will allow you to apply for a Green Loan totalling to <span className="font-bold">{formatCurrency(Number(quoteDetails?.totalCost))}</span> for funding purchase of{" "}
							<span className="font-bold">{orderDetails?.product?.name}</span>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel asChild>
							<Button color="danger" size="sm" variant="flat">
								Cancel
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button isLoading={loading} isDisabled={loading} onPress={onClickContinue} color="primary" size="sm">
								Continue
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default AcceptQuotationModal;
