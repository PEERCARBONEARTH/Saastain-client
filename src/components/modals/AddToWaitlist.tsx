import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { InferType, object, string } from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import toast from "react-hot-toast";
import AppInput from "../forms/AppInput";
import useWaitlistUtils from "@/hooks/useWaitlistUtils";

const FormSchema = object({
	companyName: string().required("Company Name is required"),
	name: string().required("Contact Person's Name is required"),
	email: string().email("Invalid email").required("Email is required"),
	phoneNo: string().required("Phone is required"),
});

interface AddToWaitlistProps {
	refreshData?: () => void;
}

export default function AddToWaitlist({ refreshData }: AddToWaitlistProps) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const formMethods = useForm({
		resolver: yupResolver(FormSchema),
		defaultValues: {
			companyName: "",
			name: "",
			email: "",
			phoneNo: "",
		},
	});
	const { addToWaitlist } = useWaitlistUtils();

	const {
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = formMethods;

	const onSubmit = async (data: InferType<typeof FormSchema>) => {
		setLoading(true);
		const id = toast.loading("Adding to waitlist...");

		try {
			await addToWaitlist(data as any);
			refreshData?.();
			toast.success("Added to waitlist successfully", { id });
			reset();
			onClose();
		} catch (error) {
			toast.error("Failed to add to waitlist", { id });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button type="button" onPress={onOpen} color="primary" startContent={<PlusIcon className="w-4 h-4" />} size="sm">
				Add to Waitlist
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader className="flex flex-col gap-1">
									<h2 className="text-lg font-semibold">Add to Waitlist</h2>
								</ModalHeader>
								<ModalBody>
									<AppInput label="Company Name" placeholder="e.g. Indiana Tech" name="companyName" control={control} error={errors.companyName} />
									<AppInput label="Contact Person" placeholder="e.g. Paul Anderson" name="name" control={control} error={errors.name} />
									<AppInput label="Email" placeholder="e.g. paul.anderson@gmail.com" name="email" control={control} error={errors.email} />
									<AppInput label="Phone" placeholder="e.g. 0700123456" name="phoneNo" control={control} error={errors.phoneNo} />
								</ModalBody>
								<ModalFooter>
									<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
										Close
									</Button>
									<Button size="sm" type="submit" color="primary" endContent={<ArrowRightIcon className="w-4 h-4" />} isLoading={loading} isDisabled={loading}>
										{loading ? "Adding ..." : "Add to Waitlist"}
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
