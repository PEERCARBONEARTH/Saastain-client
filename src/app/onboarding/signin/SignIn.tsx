"use client";
import { FC, ReactNode, useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import useAuthLogsUtils from "@/hooks/useAuthLogsUtils";
import { AuthLogStatus } from "@/types/AuthLog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import AppInput from "@/components/forms/AppInput";
import { Button, Spacer } from "@nextui-org/react";
import { LockKeyholeIcon, MailCheck } from "lucide-react";
import Link from "next/link";

const schema = z.object({
	email: z.string().email({ message: "Invalid Email Address" }),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters long",
	}),
});

const SignIn = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const [authError, setAuthError] = useState<string | null>(null);

	// define the form
	const formMethods = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { saveNewAuthLog } = useAuthLogsUtils();

	const {
		reset,
		control,
		handleSubmit,
		formState: { errors },
	} = formMethods;
	//define a submit handler
	const onSubmit = async (data: z.infer<typeof schema>) => {
		setLoading(true);
		try {
			const resp = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
				callbackUrl: "/",
			});
			// check if the login was successful
			if (resp.ok) {
				toast.success("Logged In Successfully");
				reset();
				saveNewAuthLog({ email: data.email, status: AuthLogStatus.SUCCESS });
				router.push("/");
			} else {
				// handle other errors
				setAuthError(resp.error);
				toast.error(resp.error || "An Error Was Encountered.Try Again later.");
				saveNewAuthLog({ email: data.email, status: AuthLogStatus.FAILED });
			}
		} catch (error) {
			toast.error("An Error Was Encountered.Try Again later.");
		} finally {
			setLoading(false);
		}
	};
	return (
		<SignInLayout>
			<div className="container w-full md:w-5/6 p-4 md:p-8 mt-12 md:mt-24 my-auto">
				{authError && (
					<div className="space-y-2 border p-2 rounded-md mb-10">
						<p className="text-danger font-bold">Error</p>
						<div className="text-danger text-sm">{authError}</div>
					</div>
				)}
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<AppInput
							label="Email"
							name="email"
							placeholder="Your Email Address"
							control={control}
							error={errors.email}
							startContent={<MailCheck className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
						/>
						<Spacer y={6} />
						<AppInput
							label="Password"
							type="password"
							name="password"
							placeholder="Your Password"
							control={control}
							error={errors.password}
							isPassword={true}
							startContent={<LockKeyholeIcon className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
						/>
						<div className="flex justify-between py-4 border-primary-grey  border-b-2 my-8 items-center">
							<Link href={AppEnumRoutes.AUTH_FORGOT_PASSWORD} replace className="text-primary text-base font-medium hover:underline hover:underline-offset-4">
								Forgot Password ?
							</Link>
							<Button type="submit" color="primary" isDisabled={loading} isLoading={loading}>
								Submit
							</Button>
						</div>
					</form>
				</FormProvider>
				<p className="mt-6">
					No Account yet?{" "}
					<Link href={AppEnumRoutes.AUTH_REGISTER} className="font-bold text-[#CFA16C] hover:underline hover:underline-offset-4">
						Sign Up
					</Link>
				</p>
			</div>
		</SignInLayout>
	);
};

interface IProps {
	children: ReactNode | ReactNode[];
}

const SignInLayout: FC<Readonly<IProps>> = ({ children }) => {
	return (
		<div className="bg-auth h-screen grid md:grid-cols-2 grid-cols-1 mt-24 md:mt-0 my-auto">
			<div className="container mx-2 md:mx-4 px-4 md:px-8 mt-5  hidden md:flex  flex-col justify-center ">
				<Image className="w-1/4 my-5" src={"/images/saastain_logo.svg"} alt="" width={100} height={100} />
				<p className="text-gray-700 text-base">Saastain goes beyond conventional solutions, empowering you to not only navigate the complexities of emissions tracking but also to drive sustainable growth.</p>
			</div>
			{/* Form Content */}
			<div className="container  w-full px-4 my-auto border-l-0 border-gray-200 md:border-l-2 h-full flex flex-col justify-center">
				<Image className="w-1/4 my-2 inline-block md:hidden" src={"/images/saastain_logo.svg"} width={100} height={100} alt="" />
				{children}
			</div>
		</div>
	);
};

export default SignIn;
