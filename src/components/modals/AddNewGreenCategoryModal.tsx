import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { HiPlus } from "react-icons/hi";
import { CheckIcon } from "lucide-react";
import AppInput from "../forms/AppInput";
import AppTextArea from "../forms/AppTextArea";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import useGreenProductUtils from "@/hooks/useGreenProductUtils";
import toast from "react-hot-toast";

interface IProps {
	mutate?: VoidFunction;
}

const formSchema = z.object({
	title: z.string().min(1, "Category Name is required"),
	description: z.string().optional(),
});

export default function AddNewGreenCategoryModal({ mutate }: IProps) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const formMethods = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	const [loading, setLoading] = useState<boolean>(false);

	const { addGreenProductCategory } = useGreenProductUtils();

	const {
		handleSubmit,
		formState: { errors: formErrors },
		control,
		reset,
	} = formMethods;

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const info = {
			title: data.title,
			description: data.description,
		};
		setLoading(true);

		try {
			const resp = await addGreenProductCategory(info);

			if (resp.status === "success") {
				toast.success("New Product Category added successfully");
				reset();
				mutate && mutate?.();
				onClose();
			} else {
				toast.error("Failed to save the new product category");
			}
		} catch (err) {
			toast.error("Failed to save the new product category");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button startContent={<HiPlus />} color="primary" onPress={onOpen}>
				New
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader className="flex flex-col gap-1">
									<h2 className="text-lg font-semibold uppercase">Add New Category</h2>
								</ModalHeader>
								<ModalBody>
									<AppInput label={"Category Name"} placeholder="Clean Cooking" name="title" control={control} error={formErrors.title} />
									<AppTextArea label="Description" placeholder="Write text here ..." name="description" control={control} error={formErrors.description} />
								</ModalBody>
								<ModalFooter>
									<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
										Close
									</Button>
									<Button size="sm" color="primary" type="submit" startContent={<CheckIcon className="w-4 h-4" />} isLoading={loading} isDisabled={loading}>
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
}
