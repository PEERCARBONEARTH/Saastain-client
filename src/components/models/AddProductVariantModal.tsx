import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { HiPlus } from "react-icons/hi";
import AppInput from "../forms/AppInput";
import { FC, SetStateAction } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";

const productVariantSchema = z.object({
	variant: z.string().min(1, "Product variant is required"),
	capacity: z.string().min(1, "Please enter capacity "),
});

interface AddProductVariantModalModalProps {
	setProductVariants: (items: SetStateAction<{ id: string; variant: string; capacity: string }[]>) => void;
}

const AddProductVariantModal: FC<AddProductVariantModalModalProps> = ({ setProductVariants }) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const formMethods = useForm<z.infer<typeof productVariantSchema>>({
		resolver: zodResolver(productVariantSchema),
		defaultValues: {
			variant: "",
			capacity: "",
		},
	});

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors: formErrors },
	} = formMethods;

	const onSubmit = async (data: z.infer<typeof productVariantSchema>) => {
		setProductVariants((items) => [...items, { variant: data.variant, capacity: data.capacity, id: nanoid() }]);
		toast.success("Variant added");
		reset();
	};

	return (
		<>
			<Button type="button" color="primary" startContent={<HiPlus />} variant="light" onPress={onOpen}>
				Add Variant
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<ModalHeader>Add Product Variant</ModalHeader>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalBody>
									<AppInput label="Variant" placeholder="Small Meko" name="variant" control={control} error={formErrors.variant} />
									<Spacer y={2} />
									<AppInput label="Capacity" placeholder="5kg" name="capacity" control={control} error={formErrors.capacity} />
								</ModalBody>
								<ModalFooter>
									<Button type="button" color="danger" variant="flat" onPress={onClose}>
										Close
									</Button>
									<Button type="button" color="primary">
										Save
									</Button>
								</ModalFooter>
							</form>
						</FormProvider>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddProductVariantModal;
