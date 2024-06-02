"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import AppInput from "@/components/forms/AppInput";
import { Spacer, Button, Spinner } from "@nextui-org/react";
import { LockKeyholeIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, FC } from "react";
import toast from "react-hot-toast";
import useAuthUtils from "@/hooks/useAuthUtils";

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

type IProps = {
	token: string;
	id: string;
};

const ResetPassword: FC<IProps> = ({ token, id }) => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const { resetPassword, verifyPasswordResetToken } = useAuthUtils();
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [info, setInfo] = useState(null);

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

	useEffect(() => {
		const verifyToken = async () => {
			setLoading(true);
			try {
				const response = await verifyPasswordResetToken(token as string, id as string);
				setInfo(response);
				if (response.status === "success") {
					setEmail(response.data.email);
					setUserId(response.data.userId);
				} else {
					setError(response.msg || "An error occurred. Please try again");
				}
			} catch (err) {
				setError(err?.response?.data?.msg || "An error occurred. Please try again");
			} finally {
				setLoading(false);
			}
		};
		const timer = setTimeout(() => {
			verifyToken();
		}, 500);
		return () => clearTimeout(timer);
	}, [token, id]);

	const onSubmit = async (data: z.infer<typeof schema>) => {
		setIsSubmitting(true);
		const id = toast.loading("Resetting Password...");
		try {
			const response = await resetPassword(token as string, data.password, userId);
			if (response.status === "success") {
				toast.success("Password Reset Successfully", { id });
				reset();
				router.push("/auth/login");
			} else {
				toast.error(response.msg, { id });
				setError(response.msg || "An error occurred. Please try again");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again", { id });
			setError("An error occurred. Please try again");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<div className="container  w-full md:w-5/6   my-auto p-4 md:p-8 mt-12 md:mt-24 ">
				<p className="text-gray-900 text-base mt-6 mb-6">Set New Password for Your Account</p>
				<Spacer y={6} />
				{loading && (
					<div className="flex space-x-3 items-center justify-center">
						<Spinner size="lg" />
						<p>Please wait as we verify your link ...</p>
					</div>
				)}
				<Spacer y={6} />
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
						<strong className="font-bold">Error!</strong>
						<span className="block">{error}</span>
						<div className="">
							<p>
								Please check the link and try again or{" "}
								<Link href="/auth/forgot-password" replace className="font-bold text-[#CFA16C]">
									Forgot Password
								</Link>
							</p>
						</div>
					</div>
				)}
				{email && (
					<FormProvider {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<AppInput placeholder="Your Email" value={email} isDisabled isPassword={false} startContent={<MailIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />} />
							<Spacer y={6} />
							<AppInput
								name="password"
								placeholder="Your New Password"
								control={control}
								error={errors.password}
								type="password"
								startContent={<LockKeyholeIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
							/>
							<Spacer y={6} />
							<AppInput
								name="confirmPassword"
								placeholder="Confirm Password"
								type="password"
								control={control}
								error={errors.confirmPassword}
								startContent={<LockKeyholeIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
							/>
							<div className="py-4 border-peer-grey-300  border-b-2 my-4">
								<Button type="submit" color="primary" isDisabled={isSubmitting} isLoading={isSubmitting}>
									Set New Password
								</Button>
							</div>
						</form>
					</FormProvider>
				)}

				<p className="mt-6">
					Have an Account ?{" "}
					<Link href="/auth/login" replace className="font-bold text-[#CFA16C]">
						Sign In
					</Link>
				</p>
			</div>
		</>
	);
};

export default ResetPassword;
