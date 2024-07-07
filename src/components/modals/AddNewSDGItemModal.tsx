import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";
import { HiPlus } from "react-icons/hi";
import AppInput from "../forms/AppInput";
import FileInput from "../forms/FileInput";

const AddNewSDGItemModal = () => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	return (
		<>
			<Button startContent={<HiPlus />} color="primary" onPress={onOpen}>
				New
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h2 className="text-lg font-semibold uppercase">Add New SDG</h2>
							</ModalHeader>
							<ModalBody>
								<AppInput label={"SDG Number"} placeholder="1" />
								<AppInput label={"SDG Label"} placeholder="Clean Energy" />
								<FileInput labelText="SDG Image" />
							</ModalBody>
							<ModalFooter>
								<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
									Close
								</Button>
								<Button size="sm" color="primary" startContent={<CheckIcon className="w-4 h-4" />}>
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddNewSDGItemModal;
