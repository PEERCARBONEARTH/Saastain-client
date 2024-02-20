"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import AppInput from "@/components/forms/AppInput";
import { Spacer } from "@nextui-org/react";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/Layout";

const schema = z.object({
	email: z.string().email(),
});

const ForgotPassword: NextPageWithLayout = () => {
	// define the form
	const formMethods = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
		},
	});

	//define a submit handler
	const onSubmit = (data: z.infer<typeof schema>) => {
		console.log(data);
	};

	return (
		<>

				{/* Form Content */}
				<div className="container  w-full md:w-5/6   my-auto p-4 md:p-8 mt-12 md:mt-24 ">
					<p className="text-gray-900 text-3xl text-base mt-6 mb-6">Enter your email address.We'll send you instructions to reset your password.</p>
					<Spacer y={6} />
					<FormProvider {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)}>
							<AppInput
								label="Email Address"
								name="email"
								placeholder="Your Email Address"
								control={formMethods.control}
								startContent={<MailCheck className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
							/>
							<Spacer y={6} />
							<div className="py-4 border-peer-grey-300  border-b-2 my-4">
								<Button type="submit" className="w-full h-10 px-4 bg-[#5E896E] text-white rounded-lg hover:bg-[#CFA16C]">
									Send Email
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
}

ForgotPassword.getLayout = (c) => <AuthLayout>{c}</AuthLayout>;


export default ForgotPassword;