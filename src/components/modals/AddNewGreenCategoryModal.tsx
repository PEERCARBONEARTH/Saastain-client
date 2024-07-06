import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { HiPlus } from "react-icons/hi";
import { CheckIcon } from "lucide-react";
import AppInput from "../forms/AppInput";
import AppTextArea from "../forms/AppTextArea";

interface IProps {
	mutate?: VoidFunction;
}

export default function AddNewGreenCategoryModal({ mutate }: IProps) {
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
								<h2 className="text-lg font-semibold uppercase">Add New Category</h2>
							</ModalHeader>
							<ModalBody>
								<AppInput label={"Category Name"} placeholder="Clean Cooking" />
								<AppInput label={"Category Icon"} placeholder="Choose Icon" />
								<AppTextArea label="Description" placeholder="Write text here ..." />
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
}
