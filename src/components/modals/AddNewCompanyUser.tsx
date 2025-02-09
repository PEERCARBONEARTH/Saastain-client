import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { FormProvider, useForm } from "react-hook-form";
import { InferType, object, string } from "yup";
import AppBtn from "../btns/AppBtn";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import useUserUtils from "@/hooks/useUserUtils";
import useCompanyUtils from "@/hooks/useCompanyUtils";
import AppInput from "../forms/AppInput";
import AppRadioGroup from "../forms/AppRadioGroup";

interface AddNewCompanyUserProps {
	refreshData?: () => void;
	companyId: string;
}

const roles = [
	{
		label: "Company Admin",
		value: "company_admin",
	},
	{
		label: "Company User",
		value: "company_user",
	},
];

const FormSchema = object({
	name: string().required("Name is required"),
	email: string().required("Email is required").email("Email is invalid"),
	roleInCompany: string().required("Role in company is required"),
	systemRole: string().required("Select a system role for the user"),
});

const AddNewCompanyUser = ({ companyId, refreshData }: AddNewCompanyUserProps) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const formMethods = useForm({
		resolver: yupResolver(FormSchema),
		defaultValues: {
			name: "",
			email: "",
			roleInCompany: "",
			systemRole: "",
		},
	});

	const { createUser } = useUserUtils();
	const { adminUpdateUserWithCompany } = useCompanyUtils();

	const {
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = formMethods;

	const onSubmit = async (data: InferType<typeof FormSchema>) => {
		const userPassword = nanoid(10);
		const info = {
			name: data.name,
			email: data.email,
			roleInCompany: data.roleInCompany,
			systemRole: data.systemRole,
			password: userPassword,
		};

		setLoading(true);
		const id = toast.loading("Creating user...");

		try {
			const resp = await createUser(info);

			if (resp?.status === "success") {
				toast.success("User created successfully", { id });
				reset();
				refreshData?.();
				onClose();
				const userId = resp.data.id;
				const updateResp = await adminUpdateUserWithCompany(userId, companyId);
			} else {
				toast.error(resp?.msg ?? "Something went wrong", { id });
			}
		} catch (err) {
			toast.error(err?.message ?? "Something went wrong", { id });
		} finally {
            setLoading(false);
        }
	};
	return (
		<>
			<AppBtn onClick={onOpen} startContent={<UserPlus className="w-4 h-4" />} text="Add New User" />
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader className="flex flex-col gap-1">
									<h2 className="text-lg font-semibold">Add New User to Company</h2>
								</ModalHeader>
								<ModalBody>
									<AppInput label="Name" placeholder="e.g. John Doe" name="name" control={control} error={errors.name} />
									<AppInput label="Email" placeholder="e.g. john.doe@gmail.com" name="email" control={control} error={errors.email} />
									<AppInput label="Role in Company" placeholder="e.g. Sustainability DevSec or CTO" name="roleInCompany" control={control} error={errors.roleInCompany} />
									<AppRadioGroup orientation="horizontal" label="System Role" name="systemRole" control={control} error={errors.systemRole} options={roles} />
								</ModalBody>
								<ModalFooter>
									<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
										Close
									</Button>
									<AppBtn type="submit" text="Add User" isLoading={loading} startContent={<FiEdit3 className="w-4 h-4" />} />
								</ModalFooter>
							</form>
						</FormProvider>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddNewCompanyUser;
