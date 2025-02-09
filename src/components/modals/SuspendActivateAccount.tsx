import useUserUtils from "@/hooks/useUserUtils";
import { AccountStatus, IUser } from "@/types/User";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { ShieldMinus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface SuspendActivateAccountProps {
	account?: IUser;
	refresh?: () => void;
}

const SuspendActivateAccount = ({ account, refresh }: SuspendActivateAccountProps) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const { activateUserAccount, suspendUserAccount } = useUserUtils();
	const [loading, setLoading] = useState<boolean>(false);
	const { data: session } = useSession();

	const onClickOwnAccount = () => {
		toast.error("You cannot suspend your own account");
	};

	const onClick = async () => {
		if (!account) return;

		setLoading(true);
		const id = toast.loading("Please wait...");

		try {
			const resp = await (account?.accountStatus === AccountStatus.ACTIVE ? suspendUserAccount(account?.id) : activateUserAccount(account?.id));

			if (resp?.status === "success") {
				refresh && refresh();
				toast.success("User account updated successfully", { id });
				onClose();
			} else {
				toast.error("Something went wrong");
			}
		} catch (err) {
			toast.error(err?.message ?? "Something went wrong", { id });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button color="warning" onPress={session?.user?.id === account?.id ? onClickOwnAccount : onOpen} startContent={<ShieldMinus />}>
				{account?.accountStatus === AccountStatus.ACTIVE ? "Suspend" : "Activate"}
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader className="text-sm">
								{account?.accountStatus === AccountStatus.ACTIVE ? "Suspend" : "Activate"}
								<span className="text-default-500 px-2"> {account?.name}&apos;s</span> Account
							</ModalHeader>
							<ModalBody>
								<p className="text-default-500 text-sm">Are you sure you want to {account?.accountStatus === AccountStatus.ACTIVE ? "suspend" : "activate"} this account?</p>
							</ModalBody>
							<ModalFooter className="flex gap-2">
								<Button color="danger" onClick={onClose}>
									Cancel
								</Button>
								<Button color="warning" onClick={onClick} isLoading={loading} isDisabled={loading}>
									{account?.accountStatus === AccountStatus.ACTIVE ? "Suspend" : "Activate"}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SuspendActivateAccount;
