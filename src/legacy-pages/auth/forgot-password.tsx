import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import AppInput from "@/components/forms/AppInput";
import { Button, Spacer } from "@nextui-org/react";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/Layout";
import useAuthUtils from "@/hooks/useAuthUtils";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Head from "next/head";

const schema = z.object({
	email: z.string().email(),
});

const ForgotPassword: NextPageWithLayout = () => {
	const formMethods = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
		},
	});
	const [loading, setLoading] = useState<boolean>(false);
	
	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = formMethods;

	const { requestPasswordReset } = useAuthUtils();

	//define a submit handler
	const onSubmit = async (data: z.infer<typeof schema>) => {
		setLoading(true);
		const id = toast.loading("Sending Email...");
		try {
			const response = await requestPasswordReset(data.email);
			if (response.status === "success") {
				toast.success("Reset link has been sent to your email", { id });
				reset();
			} else {
				toast.error(response.msg, { id });
			}
		} catch (error) {
			toast.error(error?.message ?? "An error occurred. Please try again", { id });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container  w-full md:w-5/6   my-auto p-4 md:p-8 mt-12 md:mt-24 ">
			<Head>
				<title>Forgot Password - SaaStain</title>
			</Head>
			<p className="text-gray-900 text-base mt-6 mb-6">Enter your email address.We'll send you instructions to reset your password.</p>
			<Spacer y={6} />
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<AppInput
						label="Email Address"
						name="email"
						placeholder="Your Email Address"
						control={control}
						error={errors.email}
						startContent={<MailCheck className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
					/>
					<Spacer y={6} />
					<div className="py-4 border-peer-grey-300  border-b-2 my-4">
						<Button type="submit" color="primary" className="w-full" isLoading={loading} isDisabled={loading}>
							Send Email
						</Button>
					</div>
				</form>
			</FormProvider>
			<p className="mt-6">
				Have an Account ?{" "}
				<Link href="/auth/login" replace className="font-bold text-[#CFA16C] hover:underline hover:underline-offset-4">
					Sign In
				</Link>
			</p>
		</div>
	);
};

ForgotPassword.getLayout = (c) => <AuthLayout>{c}</AuthLayout>;

export default ForgotPassword;
