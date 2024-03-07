import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { UserPlus } from "lucide-react";
import AppInput from "../forms/AppInput";
import AppSelect from "../forms/AppSelect";
import { generateOptions } from "@/helpers";
import { InferType, object, string } from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import useInviteUtils from "@/hooks/useInviteUtils";
import toast from "react-hot-toast";

const roles = ["admin", "manager", "data_entry"];

const schema = object({
	name: string().required("Name is required"),
	email: string().email("Invalid email").required("Email is required"),
	role: string().required("Role is required"),
});

const InviteNewUserModal = () => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const formMethods = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			role: "",
		},
	});

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = formMethods;

	const { inviteUserToCompany } = useInviteUtils();

	const onSubmit = async (data: InferType<typeof schema>) => {
		const id = toast.loading("Inviting user ...");
		setLoading(true);

		try {
			const resp = await inviteUserToCompany(data.name, data.email, data.role);

			if (resp?.status === "success") {
				toast.success("User invited successfully", { id });
				reset();
				onClose();
			} else {
				toast.error(resp?.msg ?? "Failed to invite user", { id });
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to invite user", { id });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button color="primary" startContent={<UserPlus className="w-4 h-4" />} onPress={onOpen}>
				Invite New User
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside">
				<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader>
									<h2 className="text-lg font-semibold">Invite New User</h2>
								</ModalHeader>
								<ModalBody>
									<AppInput label={"Name"} placeholder={"Enter user's name"} name="name" control={control} error={errors.name} />
									<Spacer y={1} />
									<AppInput label={"Email"} placeholder={"Enter user's email"} name="email" control={control} error={errors.email} />
									<Spacer y={1} />
									<AppSelect label={"Role"} placeholder="Choose Role ..." options={generateOptions(roles)} name="role" control={control} error={errors.role} />
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="bordered" onPress={onClose} type="button">
										Cancel
									</Button>
									<Button color="primary" type="submit" isDisabled={loading} isLoading={loading}>
										Invite
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

export default InviteNewUserModal;
