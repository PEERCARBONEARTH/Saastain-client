import useDidHydrate from "@/hooks/useDidHydrate";
import useOrderUtils from "@/hooks/useOrderUtils";
import { IGreenProduct } from "@/types/GreenProduct";
import { OrderStage } from "@/types/Order";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useSession } from "next-auth/react";
import { FC, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface IProps {
	productInfo: IGreenProduct;
	isActive?: boolean;
	mutate?: VoidFunction;
}

const RFQModal: FC<IProps> = ({ productInfo, isActive = true, mutate }) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { createNewRFQ, saveNewOrderTimeline } = useOrderUtils();

	const { data: session } = useSession();

	const { didHydrate } = useDidHydrate();

	const account = useMemo(() => {
		if (didHydrate && session?.user) {
			return session?.user;
		}

		return null;
	}, [session, didHydrate]);

	const onClickConfirm = async () => {
		setLoading(true);
		try {
			const resp = await createNewRFQ({ productId: productInfo.id, requestedBy: account?.id, vendorId: productInfo?.vendor?.id, companyId: account?.company?.id });

			if (resp?.status === "success") {
				toast.success("Quoatation request sent successfully");
				mutate?.();
				saveNewTimelineInfo(resp?.data?.id);
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to make request at the moment");
			}
		} catch (err) {
			toast.error("Unable to make request at the moment");
		} finally {
			setLoading(false);
		}
	};

	const saveNewTimelineInfo = async (orderId: string) => {
		const info = {
			orderId,
			code: OrderStage.RFQ,
			title: "Request for Quotation",
			description: `${account?.company?.companyName} has requested for quotation for ${productInfo?.name}`,
		};
		try {
			await saveNewOrderTimeline(info);
		} catch (err) {}
	};

	return (
		<>
			<Button isDisabled={isActive} color="primary" onPress={onOpen}>
				Request For Quotation
			</Button>
			<Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader>
								<h1>Confirmation to Request For Quotation</h1>
							</ModalHeader>
							<ModalBody>
								<p>
									Are you sure you want to request a quotation for the <span className="font-bold">{productInfo?.name}</span>?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="bordered" size="sm" onPress={onClose}>
									Cancel
								</Button>
								<Button isDisabled={loading} isLoading={loading} color="primary" variant="solid" size="sm" onPress={onClickConfirm}>
									Confirm Request
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default RFQModal;
