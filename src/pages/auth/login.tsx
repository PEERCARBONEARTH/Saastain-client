"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
// import  Button  from "@components/buttons/add-button";
import AppInput from "@/components/forms/AppInput";
import { Spacer } from "@nextui-org/react";
import { LockKeyholeIcon, MailCheck } from "lucide-react";
import { useState } from "react";
import { NextPageWithLayout } from "@/types/Layout";

import Link from "next/link";
import AuthLayout from "@/layouts/AuthLayout";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters long",
	}),
});

const Login: NextPageWithLayout = () => {

	// define the form
	const formMethods = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	//define a submit handler
	const onSubmit = (data: z.infer<typeof schema>) => {
		console.log(data);
	};

	return (
		<AuthLayout>
				{/* Form Content */}
				<div className="container  w-full md:w-5/6   p-4 md:p-8   mt-12 md:mt-24 my-auto">
					<FormProvider {...formMethods}>
						<form onSubmit={formMethods.handleSubmit(onSubmit)}>
							<AppInput
								label="Email"
								name="email"
								placeholder="Your Email Address"
								control={formMethods.control}
								startContent={<MailCheck className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
							/>
							<Spacer y={6} />
							<AppInput
								label="Password"
								name="password"
								placeholder="Your Password"
								control={formMethods.control}
								isPassword={true}
								startContent={<LockKeyholeIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
							/>
							<div className="footer flex flex-col md:flex-row  justify-between py-4 px-4 border-peer-grey-300  border-b-2 my-8">
								<Link href="/auth/forgot_password" replace className=" my-4 md:my-auto text-peer-main-green text-base font-medium hover:underline hover:text-[#CFA16C] hover:font-bold">
									Forgot Password ?
								</Link>
								<Button type="submit" className=" h-10 px-4 bg-[#5E896E] text-white rounded-lg hover:bg-[#CFA16C]">
									Submit
								</Button>
							</div>
						</form>
					</FormProvider>

					<p className="mt-6">
						No Account yet?{" "}
						<Link href="/" className="font-bold text-[#CFA16C]">
							Sign Up
						</Link>
					</p>
				</div>
		</AuthLayout>
	);
}

// Login.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Login;
