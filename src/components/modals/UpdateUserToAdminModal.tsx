import { IUser, SystemRole } from "@/types/User";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import AppBtn from "../btns/AppBtn";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useUserUtils from "@/hooks/useUserUtils";
import AppRadioGroup from "../forms/AppRadioGroup";

interface UpdateUserToAdminModalProps {
	account?: IUser;
	refresh?: () => void;
}

const options = [
	{ label: "System Admin", value: SystemRole.SYSTEM_ADMIN },
	{ label: "Admin", value: SystemRole.ADMIN },
];

const UpdateUserToAdminModal = ({ account, refresh }: UpdateUserToAdminModalProps) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [role, setRole] = useState<SystemRole | string>(SystemRole.ADMIN);
	const [loading, setLoading] = useState<boolean>(false);

	const { data } = useSession();
	const { updateUserToAdmin, updateUserToSystemAdmin } = useUserUtils();

	const onClickOwnAccount = () => {
		toast.error("You cannot update your own account. Please contact another admin");
	};

	const ownAccount = useMemo(() => data?.user?.id === account?.id, [data, account]);

	const onClick = async () => {
		if (!account) return;

		if (!role) return toast.error("Please select a role");

		setLoading(true);
		const id = toast.loading("Please wait...");

		try {
			if (ownAccount) {
				toast.error("You cannot update your own account. Please contact another admin");
				return;
			}

			if (role === SystemRole.SYSTEM_ADMIN) {
				const resp = await updateUserToSystemAdmin(account?.id);

				if (resp?.status === "success") {
					refresh && refresh();
					toast.success("User account updated successfully", { id });
					onClose();
				} else {
					toast.error("Something went wrong");
				}
			} else {
				const resp = await updateUserToAdmin(account?.id);

				if (resp?.status === "success") {
					refresh && refresh();
					toast.success("User account updated successfully", { id });
					onClose();
				} else {
					toast.error("Something went wrong");
				}
			}
		} catch (err) {
			toast.error(err?.message ?? "Something went wrong", { id });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<AppBtn size="md" color="success" onPress={ownAccount ? onClickOwnAccount : onOpen} text="Update to Admin" />
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader className="text-sm">
								Update
								<span className="text-default-500 px-2"> {account?.name}&apos;s</span> Account to Admin
							</ModalHeader>
							<ModalBody>
								<p className="text-default-500 text-sm">Are you sure you want to update this account to an admin? This action cannot be undone.</p>
								<AppRadioGroup label="Role" value={role} setValue={(val) => setRole(val)} options={options} />
							</ModalBody>
							<ModalFooter className="flex gap-2">
								<Button color="danger" onClick={onClose}>
									Cancel
								</Button>
								<Button color="warning" onClick={onClick} isLoading={loading} isDisabled={loading}>
									{loading ? "Please wait..." : "Update to Admin"}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateUserToAdminModal;
