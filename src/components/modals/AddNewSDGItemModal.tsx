import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";
import { HiPlus } from "react-icons/hi";
import AppInput from "../forms/AppInput";
import FileInput from "../forms/FileInput";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useGreenProductUtils from "@/hooks/useGreenProductUtils";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firebaseStorage } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useState } from "react";
import { nanoid } from "nanoid";

const formSchema = z.object({
	title: z.string().min(1, "SDG Number is required"),
	description: z.string().min(1, "SDG Label or Description is required"),
	imageUrl: z.string().min(1, "Please select SDG Image"),
});

interface IProps {
	mutate?: VoidFunction;
}

const AddNewSDGItemModal = ({ mutate }: IProps) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const formMethods = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			imageUrl: "",
		},
	});

	const {
		handleSubmit,
		formState: { errors: formErrors },
		reset,
		control,
	} = formMethods;

	const { addSDGItem } = useGreenProductUtils();

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const storageRef = ref(firebaseStorage, `green-products/sdg/${nanoid(10)}/images`);
		const id = toast.loading("Uploading Image ...");
		await uploadString(storageRef, data.imageUrl, "data_url")
			.then(async (snapshot) => {
				toast.success("Image Uploaded successfully", { id });
				try {
					const downloadURL = await getDownloadURL(snapshot.ref);
					const resp = await addSDGItem({
						title: data.title,
						description: data.description,
						imageUrl: downloadURL,
					});

					if (resp.status === "success") {
						toast.success("SDG Item saved successfully", { id });
						reset();
						mutate && mutate?.();
						onClose();
					} else {
						toast.error("Unable to save SDG at the moment, please try again later.", { id });
					}
				} catch (err) {
					toast.error("Unable to save SDG at the moment, please try again later.", { id });
				} finally {
					setLoading(false);
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error("Unable to save SDG at the moment, please try again later.", { id });
				setLoading(false);
			});
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
									<h2 className="text-lg font-semibold uppercase">Add New SDG</h2>
								</ModalHeader>
								<ModalBody>
									<AppInput label={"SDG Number"} placeholder="1" name="title" control={control} error={formErrors.title} />
									<AppInput label={"SDG Label"} placeholder="Clean Energy" name="description" control={control} error={formErrors.description} />
									<FileInput labelText="SDG Image" name="imageUrl" control={control} error={formErrors.imageUrl} />
								</ModalBody>
								<ModalFooter>
									<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
										Close
									</Button>
									<Button size="sm" color="primary" startContent={<CheckIcon className="w-4 h-4" />} type="submit" isLoading={loading} isDisabled={loading}>
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

export default AddNewSDGItemModal;
