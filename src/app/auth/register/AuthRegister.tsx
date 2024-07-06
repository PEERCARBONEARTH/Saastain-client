"use client";
import AppInput from "@/components/forms/AppInput";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Button } from "@nextui-org/react";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useVendorUtils from "@/hooks/useVendorUtils";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
	companyName: z.string({ message: "Company Name is required" }).min(3, { message: "Company Name is required" }),
	companyWebsite: z.string().optional(),
	name: z.string().min(3, { message: "Your name is required" }),
	email: z.string().email({ message: "Your email is required" }),
	phoneNo: z.string().min(10, { message: "Your phone number is too short" }).max(15, { message: "Phone no is too long" }),
});

const AuthRegister = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			companyName: "",
			companyWebsite: "",
			name: "",
			email: "",
			phoneNo: "",
		},
	});

	const {
		reset,
		control,
		formState: { errors: formErrors },
		handleSubmit,
	} = formMethods;

	const { addNewInterest } = useVendorUtils();

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const info = {
			companyName: data.companyName,
			website: data.companyWebsite || "",
			vendorName: data.name,
			vendorPhoneNo: data.phoneNo,
			vendorEmail: data.email,
		};

		setLoading(true);

		try {
			const resp = await addNewInterest(info);

			if (resp.status === "success") {
				toast.success("Thank you for your interest. We will get back to you soon.");
				reset();
				router.push(AppEnumRoutes.AUTH_REGISTER_SUCCESS);
			} else {
				toast.error("Failed to submit interest. Please try again.");
			}
		} catch (err) {
			toast.error("Failed to submit interest. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-10">
						<AppInput label="Your Company" placeholder="Company Name" name="companyName" control={control} error={formErrors.companyName} />
						<AppInput label="Company Website" placeholder="example.com" name="companyWebsite" control={control} error={formErrors.companyWebsite} />
						<AppInput label="Your Name" placeholder="John Doe" name="name" control={control} error={formErrors.name} />
						<AppInput label="Your Email" placeholder="joe.doe@example.com" name="email" control={control} error={formErrors.email} />
						<div className="col-span-full">
							<AppInput label="Your Phone Number" placeholder="+254712345678" name="phoneNo" control={control} error={formErrors.phoneNo} />
						</div>
					</div>
					<div className="flex items-center justify-between mt-6">
						<Link target="_blank" href={"https://saastain.app"} className="text-primary hover:underline hover:underline-offset-4">
							Learn More about Saastain?
						</Link>
						<Button color="primary" endContent={<ArrowRightIcon />} type="submit" isLoading={loading} isDisabled={loading}>
							Submit interest
						</Button>
					</div>
				</form>
			</FormProvider>
			<div className="w-full h-0.5 bg-primary mt-5"></div>
			<div className="">
				<p className="mt-6">
					Already have an account?{" "}
					<Link href={AppEnumRoutes.AUTH_LOGIN} className="font-bold text-[#CFA16C] hover:underline hover:underline-offset-4">
						Login
					</Link>
				</p>
			</div>
		</>
	);
};

export default AuthRegister;
