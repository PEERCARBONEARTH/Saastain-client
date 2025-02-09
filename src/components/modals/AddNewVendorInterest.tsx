import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import AppInput from "../forms/AppInput";
import { z } from "zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useVendorUtils from "@/hooks/useVendorUtils";
import toast from "react-hot-toast";

const formSchema = z.object({
	companyName: z.string().min(1, "Company Name is required"),
	email: z.string().email("Invalid email").min(1, "Email is required"),
	contactPersonName: z.string().min(1, "Contact Person's Name is required"),
	phoneNo: z.string().min(1, "Phone No is required"),
	website: z.string().optional(),
});

const AddNewVendorInterest = () => {
	const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

	const [loading, setLoading] = useState<boolean>(false);

	const formMethods = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			companyName: "",
			email: "",
			contactPersonName: "",
			phoneNo: "",
			website: "",
		},
	});

	const { addNewInterest } = useVendorUtils();

	const {
		handleSubmit,
		control,
		formState: { errors: formErrors },
		reset,
	} = formMethods;

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const info = {
			companyName: data.companyName,
			website: data.website,
			vendorName: data.contactPersonName,
			vendorPhoneNo: data.phoneNo,
			vendorEmail: data.email,
		};

		setLoading(true);

		try {
			const resp = await addNewInterest(info);

			if (resp.status === "success") {
				toast.success("Interest submitted successfully.");
				reset();
				onClose();
			} else {
				toast.error("Failed to submit interest. Please try again.");
			}
		} catch (err) {
			toast.error("Failed to submit interest. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<Button color="primary" onPress={onOpen}>
				Add New Vendor Interest
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<ModalHeader>Add New Vendor Interest</ModalHeader>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalBody>
									<AppInput label={"Company Name"} placeholder={"e.g. Indiana Tech"} name="companyName" control={control} error={formErrors.companyName} />
									<AppInput label={"Email"} placeholder={"e.g. john.doe@gmail.com"} name="email" control={control} error={formErrors.email} />
									<AppInput label={"Contact Person Name"} placeholder="John Doe" name="contactPersonName" control={control} error={formErrors.contactPersonName} />
									<AppInput label={"Phone No"} placeholder="0700123456" name="phoneNo" control={control} error={formErrors.phoneNo} />
									<AppInput label={"Website (optional"} placeholder="e.g. indianatech.com" name="website" control={control} error={formErrors.website} />
								</ModalBody>
								<ModalFooter>
									<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
										Close
									</Button>
									<Button size="sm" color="primary" type="submit" isLoading={loading} isDisabled={loading}>
										Add
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

export default AddNewVendorInterest;
