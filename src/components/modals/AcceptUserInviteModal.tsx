import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { LockKeyholeIcon, UserPlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import useInviteUtils from "@/hooks/useInviteUtils";
import AppInput from "../forms/AppInput";
import { IInvite } from "@/types/Invite";
import { useState } from "react";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const schema = z
	.object({
		password: z.string().min(8, {
			message: "Password must be at least 8 characters long",
		}),
		confirmPassword: z.string().min(8, {
			message: "Password must be at least 8 characters long",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});



interface AcceptUserInviteModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	onClose: () => void;
	inviteInfo: IInvite;
}

const AcceptUserInviteModal: React.FC<AcceptUserInviteModalProps> = ({ isOpen, onClose, inviteInfo, setIsOpen }) => {
	const router = useRouter();
	const { acceptInvite } = useInviteUtils();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const formMethods = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			password: "",
		},
	});

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = formMethods;


	const onSubmit = async (data: z.infer<typeof schema>) => {
		setLoading(true);
		const id = toast.loading("Accepting Invite ...");
		try {
			const response = await acceptInvite(inviteInfo.inviteCode, data.password);
			if (response.status === "success") {
				console.log(response.data);
				toast.success("Invite Accepted Successfully", { id });
				reset();
				router.push("/auth/login");
			} else {
				toast.error(response.msg, { id });
				setError(response.msg || "An error occurred. Please try again");
			}
		} catch (error) {
			console.log(error?.response?.data?.msg);
			toast.error(error?.response?.data?.msg || "An error occurred. Please try again", { id });
			setError(error?.response?.data?.msg || "Please Contact your Admin");
		} finally {
			setLoading(false);
			onClose();
		}
	};

	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={setIsOpen} isDismissable={false}>
				<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="p-6 bg-[#DEF7EC]">
									<ModalHeader className="flex flex-col items-center">
										<Image className="w-1/4 my-5" src={"/images/saastain_logo.svg"} alt="" width={100} height={100} />
										<h2 className="text-sm">
											You have been invited to join Company Name in their sustainability journey. <br />
											Please set a password to join.
										</h2>
									</ModalHeader>
									<ModalBody className="items-center">
										<AppInput
											label="Password"
											type="password"
											name="password"
											control={control}
											placeholder="Enter Password"
											error={errors.password}
											startContent={<LockKeyholeIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
										/>
										<Spacer y={4} />
										<AppInput
											name="confirmPassword"
											placeholder="Confirm Password"
											type="password"
											control={control}
											error={errors.confirmPassword}
											startContent={<LockKeyholeIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
										/>
									</ModalBody>
									<ModalFooter>
										<Button variant="bordered" type="button">Cancel</Button>
										<Button color="primary" type="submit" >
											Submit
										</Button>
									</ModalFooter>
								</div>
							</form>
						</FormProvider>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AcceptUserInviteModal;
