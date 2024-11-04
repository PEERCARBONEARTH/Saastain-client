import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import AppInput from "../forms/AppInput";
import { useState } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserUtils from "@/hooks/useUserUtils";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const formSchema = z
	.object({
		password: z.string().min(8, {
			message: "Current Password must be at least 8 characters long",
		}),
		newPassword: z.string().min(8, {
			message: "New Password must be at least 8 characters long",
		}),
		confirmNewPassword: z.string().min(8, {
			message: "Confirm New Password must be at least 8 characters long",
		}),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "New passwords do not match",
		path: ["confirmNewPassword"],
	});

const UpdatePasswordModal = () => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { data: session } = useSession();

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	const {
		reset,
		control,
		handleSubmit,
		formState: { errors: formErrors },
	} = formMethods;

	const { validateUserPassword, updateUserProfilePassword } = useUserUtils();

	const verifyCurrentPassword = async (currentPassword: string) => {
		try {
			const resp = await validateUserPassword({ currentPassword, userId: session?.user?.id });

			if (resp?.status === "success") {
				return resp?.data;
			}
			return false;
		} catch (err) {
			return false;
		}
	};

	const onSubmit = handleSubmit(async (data) => {
		setLoading(true);
		const isPasswordValid = await verifyCurrentPassword(data.password);

		if (!isPasswordValid) {
			toast.error("Current Password is invalid, kindly check and retry.");
			setLoading(false);
			return;
		}

		try {
			const resp = await updateUserProfilePassword({ currentPassword: data.password, newPassword: data.newPassword, userId: session?.user?.id });

			if (resp?.status === "success") {
				toast.success("Password Updated Successfully");
				reset();
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to update password at the moment");
			}
		} catch (err) {
			toast.error(err?.response?.data?.msg ?? "Unable to update password at the moment");
		} finally {
			setLoading(false);
		}
	});

	return (
		<>
			<Button color="primary" variant="bordered" onPress={onOpen}>
				Update
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={onSubmit}>
								<ModalHeader>Update Password</ModalHeader>
								<ModalBody>
									<AppInput label={"Current Password"} placeholder="Current Password" labelPlacement="inside" isPassword type="password" name="password" control={control} error={formErrors.password} />
									<Spacer y={1} />
									<AppInput label={"New Password"} placeholder="New Password" labelPlacement="inside" isPassword type="password" name="newPassword" control={control} error={formErrors.newPassword} />
									<Spacer y={1} />
									<AppInput
										label={"Confirm New Password"}
										placeholder="Confirm New Password"
										labelPlacement="inside"
										isPassword
										type="password"
										name="confirmNewPassword"
										control={control}
										error={formErrors.confirmNewPassword}
									/>
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="bordered" onPress={onClose} type="button">
										Cancel
									</Button>
									<Button color="primary" type="submit" isDisabled={loading} isLoading={loading}>
										Update
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

export default UpdatePasswordModal;
