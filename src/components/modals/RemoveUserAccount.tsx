import useUserUtils from "@/hooks/useUserUtils";
import { AccountStatus, IUser } from "@/types/User";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { TrashIcon } from "lucide-react";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface IProps {
	account: IUser;
	mutate?: VoidFunction;
}

const RemoveUserAccount: FC<IProps> = ({ account, mutate }) => {
	const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { updateUserAccountStatus } = useUserUtils();

	const onConfirm = async () => {
		setLoading(true);
		try {
			const resp = await updateUserAccountStatus(account?.id, AccountStatus.DELETED);

			if (resp?.status === "success") {
				toast.success("User Account removed successfully.");
				mutate && mutate?.();
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to remove the user account on SaaStain");
			}
		} catch (err) {
			toast.error(err?.response?.data?.msg ?? "Unable to remove the user account on SaaStain");
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<Button color="danger" startContent={<TrashIcon />} onPress={onOpen}>
				Delete
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="font-nunito saastain">
					{(onClose) => (
						<>
							<ModalHeader className="text-sm">
								Remove <span className="text-default-500 px-2"> {account?.name}&apos;s</span> Account
							</ModalHeader>
							<ModalBody>
								<p className="text-default-500 text-sm">Are you sure you want to remove this account?</p>
								<p className="text-default-500 text-sm">This will temporary remove this account from SaaStain. The user will not be able to access SaaStain until its activated.</p>
							</ModalBody>
							<ModalFooter className="gap-2">
								<Button color="danger" onClick={onClose}>
									Cancel
								</Button>
								<Button color="primary" onPress={onConfirm} isLoading={loading} isDisabled={loading}>
									Confirm
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default RemoveUserAccount;
