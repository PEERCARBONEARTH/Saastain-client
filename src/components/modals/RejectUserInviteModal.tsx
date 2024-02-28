import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import useAcceptInviteUtils from "@/hooks/useAcceptInviteUtils";
import { IInvite } from "@/types/Invite";
import { useState } from "react";
import toast from "react-hot-toast";

// Define the prop types for AcceptUserInviteModal
interface RejectUserInviteModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	onClose: () => void;
	inviteInfo: IInvite;
   }

const RejectUserInviteModal: React.FC<RejectUserInviteModalProps> = ({ isOpen, onClose, inviteInfo, setIsOpen }) => {
	const router = useRouter();
	const {rejectInvite} = useAcceptInviteUtils();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);


	const onSubmit = async () => {
		setLoading(true);
		try {
			const response = await rejectInvite(inviteInfo.inviteCode);
		if (response.status === "success") {
			 router.push("/auth/login");
		} else {
			toast.error(response.msg);
			setError(response.msg);
		}
		} catch (error) {
			toast.error(error.message);
			setError(error.message);
		}
	};

	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={setIsOpen} isDismissable={false}>
				<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
					{(onClose) => (
						<div className="p-6 bg-[#DEF7EC]">
							<ModalHeader className="flex flex-col items-center">
								<Image className="w-1/4 my-5" src={"/images/saastain_logo.svg"} alt="" width={100} height={100} />
								{/* <h2 className="text-sm">
									Dear {inviteInfo?.name} You have been invited to join {inviteInfo?.company?.companyName} in their sustainability journey.
								</h2> */}
							</ModalHeader>
							<ModalBody className="items-center">
								<p>Dear {inviteInfo?.name} Are you sure you want to reject the invite from {inviteInfo?.company?.companyName}. This action is irrevesible</p>
							</ModalBody>
							<ModalFooter>
								<Button variant="bordered" color="danger" onPress={onSubmit}>Yes</Button>
								<Button color="primary" onPress={onClose}>
									No
								</Button>
							</ModalFooter>
						</div>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default RejectUserInviteModal;
