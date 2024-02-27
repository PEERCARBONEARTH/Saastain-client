import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { UserPlus } from "lucide-react";
import AppInput from "../forms/AppInput";
import AppSelect from "../forms/AppSelect";
import { generateOptions } from "@/helpers";
import Image from "next/image";

const roles = ["admin", "manager", "data_entry"];

const AcceptUserInviteModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<Button color="primary" startContent={<UserPlus className="w-4 h-4" />} onPress={onOpen}>
				AcceptInvite
			</Button>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
					{(onClose) => (
						<div className="p-6 bg-[#DEF7EC]">
							<ModalHeader className="flex flex-col items-center">
								<Image className="w-1/4 my-5" src={"/images/saastain_logo.svg"} alt="" width={100} height={100} />
								<h2 className="text-lg font-semibold">
									Join Company Name In Their <br /> Sustainability Journey
								</h2>
							</ModalHeader>
							<ModalBody className="items-center">
								<p className="mt-3">Saastain goes beyond conventional solutions, empowering you to not only navigate the complexities of emissions tracking but also to drive sustainable growth.</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="bordered" onPress={onClose}>
									Reject Invite
								</Button>
								<Button color="primary" onPress={onClose}>
									Accept Invite
								</Button>
							</ModalFooter>
						</div>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AcceptUserInviteModal;
