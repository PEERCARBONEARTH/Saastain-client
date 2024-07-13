import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { HiPlus } from "react-icons/hi";
import AppInput from "../forms/AppInput";
import { FC, SetStateAction, useState } from "react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";

interface AddProductVariantModalModalProps {
	setProductVariants: (items: SetStateAction<{ id: string; variant: string; capacity: string }[]>) => void;
}

const AddProductVariantModal: FC<AddProductVariantModalModalProps> = ({ setProductVariants }) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const [variant, setVariant] = useState<string>("");
	const [capacity, setCapacity] = useState<string>("");

	const reset = () => {
		setVariant("");
		setCapacity("");
	};

	const onSubmit = async () => {
		if (!capacity || !variant) {
			toast.error("Please add variant and capacity");
			return;
		}
		setProductVariants((items) => [...items, { variant: variant, capacity: capacity, id: nanoid() }]);
		toast.success("Variant added");
		reset();
		onClose();
	};

	return (
		<>
			<Button type="button" color="primary" startContent={<HiPlus />} variant="light" onPress={onOpen}>
				Add Variant
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader>Add Product Variant</ModalHeader>
							<ModalBody>
								<AppInput label="Variant" placeholder="Small Meko" value={variant} setValue={setVariant} isRequired />
								<Spacer y={2} />
								<AppInput label="Capacity" placeholder="5kg" value={capacity} setValue={setCapacity} isRequired />
							</ModalBody>
							<ModalFooter>
								<Button type="button" color="danger" variant="flat" onPress={onClose}>
									Close
								</Button>
								<Button type="button" color="primary" onPress={onSubmit}>
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
