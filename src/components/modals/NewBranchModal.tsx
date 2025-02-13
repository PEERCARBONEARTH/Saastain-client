import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { MdAdd } from "react-icons/md";
import AppInput from "../forms/AppInput";
import AppSelect from "../forms/AppSelect";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import { InferType, object, string } from "yup";
import useBranchUtils from "@/hooks/useBranchUtils";
import { useSession } from "next-auth/react";
import { BranchType } from "@/types/Company";
import { IOption } from "@/types/Forms";

const branchLevels = ["Main", "Subsidiary", "Franchise", "Satellite"];

const branchTypeOptions = [
	{
		label: "Subsidiary",
		value: BranchType.SUBSIDIARY,
	},
	{
		label: "Franchise",
		value: BranchType.FRANCHISE,
	},
	{
		label: "Satellite",
		value: BranchType.SATELLITE,
	},
] satisfies IOption[];

const schema = object({
	name: string().required("Name is required"),
	type: string().required("Type is required"),
	address: string().required("Address is required"),
});

interface IProps {
	onSave?: VoidFunction;
}

const NewBranchModal = ({ onSave }: IProps) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { data: session } = useSession();

	const formMethods = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			name: "",
			type: "",
			address: "",
		},
	});

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = formMethods;

	const { addBranchToCompany } = useBranchUtils();

	const onSubmit = async (data: InferType<typeof schema>) => {
		const id = toast.loading("Adding location ...");
		setLoading(true);
		try {
			const resp = await addBranchToCompany(data.name, data.type.toUpperCase(), data.address, session?.user?.company?.id!);

			if (resp?.status === "success") {
				toast.success("Location added", { id });
				reset();
				onSave && onSave?.();
				onClose();
			} else {
				toast.error(resp?.msg ?? "Failed to add location", { id });
			}
		} catch (err) {
			toast.error(err?.message ?? "Failed to save the location", { id });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button startContent={<MdAdd />} color="primary" onPress={onOpen}>
				Add Location
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside">
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader>New Branch</ModalHeader>
								<ModalBody>
									<AppInput label="Branch Name" placeholder="Enter branch name" name="name" control={control} error={errors.name} />
									<Spacer y={1} />
									<AppSelect label="Branch Level" options={branchTypeOptions} name="type" control={control} error={errors.type} />
									<Spacer y={1} />
									<AppInput label="Street Address" placeholder="Enter street address" name="address" control={control} error={errors.address} />
									<Spacer y={1} />
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="bordered" onPress={onClose} type="button">
										Cancel
									</Button>
									<Button color="primary" type="submit" isDisabled={loading} isLoading={loading}>
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

export default NewBranchModal;
