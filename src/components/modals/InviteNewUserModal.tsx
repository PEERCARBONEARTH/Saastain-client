import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { UserPlus } from "lucide-react";
import AppInput from "../forms/AppInput";
import AppSelect from "../forms/AppSelect";
import { generateOptions } from "@/helpers";

const roles = ["admin", "manager", "data_entry"];

const InviteNewUserModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<Button color="primary" startContent={<UserPlus className="w-4 h-4" />} onPress={onOpen}>
				Invite New User
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
					{(onClose) => (
						<>
							<ModalHeader>
								<h2 className="text-lg font-semibold">Invite New User</h2>
							</ModalHeader>
							<ModalBody>
								<AppInput label={"Name"} placeholder={"Enter user's name"} />
								<Spacer y={1} />
								<AppInput label={"Email"} placeholder={"Enter user's email"} />
								<Spacer y={1} />
								<AppSelect label={"Role"} placeholder="Choose Role ..." options={generateOptions(roles)} />
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="bordered" onPress={onClose}>
									Cancel
								</Button>
								<Button color="primary" onPress={onClose}>
									Invite
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default InviteNewUserModal;
