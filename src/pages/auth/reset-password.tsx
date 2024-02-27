"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import AppInput from "@/components/forms/AppInput";
import { Spacer, Button } from "@nextui-org/react";
import { LockKeyholeIcon } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuthUtils from "@/hooks/useAuthUtils";


const schema = z.object({
	password: z.string().min(8, {
		message: "Password must be at least 8 characters long",
	}),
});

const ResetPassword: NextPageWithLayout = () => {
	const router = useRouter();
	const { token, id } = router.query;
	const [loading, setLoading] = useState<boolean>(false);
	const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
	const [email, setEmail] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const { resetPassword, verifyPasswordResetToken } = useAuthUtils();
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
			if (token) {
				const response = await verifyPasswordResetToken(token as string, id as string);
				if (response.status === "success") {
					setIsTokenValid(true);
					setEmail(response.data.email);
					setUserId(response.data.userId);
				} else {
					setIsTokenValid(false);
				}
			}
		};
		const timer = setTimeout(() => {
			verifyToken();
		}, 500);
		return () => clearTimeout(timer);
	}, [token, id]);


	const onSubmit = async (data: z.infer<typeof schema>) => {
		setLoading(true);
		const id = toast.loading("Resetting Password...");
		try {
			const response = await resetPassword(token as string, data.password, userId);
			if (response.status === "success") {
				toast.success("Password Reset Successfully", { id });
				reset();
				router.push("/auth/login");
			} else {
				toast.error(response.msg, { id });
			}
		} catch (error) {
			toast.error("An error occurred. Please try again", { id });
		} finally {
			setLoading(false);
		}
	};

	if (isTokenValid === null) {
		return (
			<div className="container  w-full md:w-5/6   my-auto p-4 md:p-8 mt-12 md:mt-24 ">
				<p className="text-gray-900 text-base mt-6 mb-6">Invalid Token</p>
				<Spacer y={6} />
				<p className="mt-6 text-center">
					<Link href="/auth/forgot-password" replace className="font-bold text-[#CFA16C]">
						Reset Password
					</Link>
				</p>
			</div>
		);
	} else if (!isTokenValid) {
		return (
			<div className="container  w-full md:w-5/6   my-auto p-4 md:p-8 mt-12 md:mt-24 ">
				<p className="text-gray-900 text-base mt-6 mb-6">Invalid Token</p>
				<Spacer y={6} />
				<p className="mt-6 text-center">
					<Link href="/auth/forgot-password" replace className="font-bold text-[#CFA16C]">
						Reset Password
					</Link>
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="container  w-full md:w-5/6   my-auto p-4 md:p-8 mt-12 md:mt-24 ">
				<p className="text-gray-900 text-base mt-6 mb-6">Set New Password for Your Account</p>
				<Spacer y={6} />
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						{email && (
							<AppInput
								name="email"
								placeholder="Your Email"
								value={email}
								isDisabled
								control={control}
								isPassword={false}
								startContent={<LockKeyholeIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
							/>
						)}
						<Spacer y={6} />
						<AppInput
							name="password"
							placeholder="Your New Password"
							control={control}
							isPassword={true}
							error={errors.password}
							startContent={<LockKeyholeIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
						/>
						<Spacer y={6} />
						<div className="py-4 border-peer-grey-300  border-b-2 my-4">
							<Button type="submit" color="primary" className="w-full h-10 px-4  text-white rounded-lg hover:bg-[#CFA16C]">
								Set New Password
							</Button>
						</div>
					</form>
				</FormProvider>

				<p className="mt-6 text-center">
					Have an Account ?{" "}
					<Link href="/auth/login" replace className="font-bold text-[#CFA16C]">
						Sign In
					</Link>
				</p>
			</div>
		</>
	);
};

ResetPassword.getLayout = (c) => <AuthLayout>{c}</AuthLayout>;

export default ResetPassword;
