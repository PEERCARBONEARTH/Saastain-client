import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { HiPlus } from "react-icons/hi";
import AppInput from "../forms/AppInput";

const AddProductVariantModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<Button color="primary" startContent={<HiPlus />} variant="light" onPress={onOpen}>
				Add Variant
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader>Add Product Variant</ModalHeader>
							<ModalBody>
								<AppInput label="Variant" placeholder="Small Meko" />
								<Spacer y={2} />
								<AppInput label="Capacity" placeholder="5kg" />
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="flat" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
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

export default AddProductVariantModal;
