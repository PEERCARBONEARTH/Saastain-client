"use client";
import AppInput from "@/components/forms/AppInput";
import useVendorUtils from "@/hooks/useVendorUtils";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IVendorInterest, VendorInterestStatus } from "@/types/VendorInterest";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface IProps {
	id: string;
}

const formSchema = z
	.object({
		companyName: z.string({ message: "Company Name is required" }).min(3, { message: "Company Name is required" }),
		name: z.string().min(3, { message: "Your name is required" }),
		email: z.string().email({ message: "Your email is required" }),
		phoneNo: z.string().min(10, { message: "Your phone number is too short" }).max(15, { message: "Phone no is too long" }),
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

const OnboardingScreen: FC<IProps> = ({ id }) => {
	const [validating, setValidating] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [vendorInterest, setVendorInterest] = useState<IVendorInterest | null>(null);
	const [saving, setSaving] = useState<boolean>(false);

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			companyName: "",
			name: "",
			email: "",
			phoneNo: "",
			password: "",
			confirmPassword: "",
		},
	});

	const {
		reset,
		control,
		formState: { errors: formErrors },
		handleSubmit,
		setValue,
	} = formMethods;

	const { getInterestDetails, registerNewVendor } = useVendorUtils();
	const router = useRouter();

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const info = {
			companyName: data.companyName,
			vendorName: data.name,
			vendorPhoneNo: data.phoneNo,
			vendorEmail: data.email,
			password: data.password,
			interestId: id,
		};

		setSaving(true);

		try {
			const resp = await registerNewVendor(info);

			if (resp.status === "success") {
				// Handle success
				toast.success("Your vendor is now complete. You can now login to your account.");
				reset();
				router.push(AppEnumRoutes.AUTH_LOGIN);
			} else {
				// Handle error
				toast.error(resp?.msg || "Failed to complete vendor profile. Please try again.");
			}
		} catch (err) {
			// Handle error
			toast.error("Failed to complete vendor profile. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		async function validateId() {
			setValidating(true);

			try {
				const resp = await getInterestDetails(id);

				if (resp.status === "success") {
					const item = resp.data;

					if (!item) {
						// Handle error
						setErrorMsg("Could not find the vendor interest");
						return;
					}

					// check if the vendor interest is approved or not
					if (item.status !== VendorInterestStatus.APPROVED) {
						// Handle error
						setErrorMsg("Vendor profile is not approved yet.");
						return;
					}

					setVendorInterest(item);

					setValue("companyName", item.companyName);
					setValue("name", item.vendorName);
					setValue("email", item.vendorEmail);
					setValue("phoneNo", item.vendorPhoneNo || "");
				} else {
					// Handle error
					setErrorMsg(resp.msg);
				}
			} catch (err) {
				// Handle error
				setErrorMsg(err?.response?.data?.msg || "An error occurred while fetching the vendor interest");
			} finally {
				setValidating(false);
			}
		}

		const timeout = setTimeout(() => {
			validateId();
		}, 500);

		return () => clearTimeout(timeout);
	}, [id]);
	return (
		<>
			{validating && (
				<div className="flex items-center gap-x-3">
					<Spinner color="primary" size="lg" />
					<span>Validating...</span>
				</div>
			)}
			{errorMsg && (
				<div>
					<div className="space-y-2">
						<h3 className="text-danger font-semibold">Error</h3>
						<p className="text-danger">{errorMsg}</p>
						<p>Please Contact your Admin for further assistance</p>
					</div>
				</div>
			)}
			{vendorInterest && (
				<>
					<FormProvider {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<AppInput label={"Your Name"} placeholder="Vendor Name" name="name" control={control} error={formErrors.name} />
								<AppInput label={"Your Email"} placeholder="vendor@peercarbon.earth" name="email" control={control} error={formErrors.email} isDisabled />
								<AppInput label={"Your Company"} placeholder="Vendor Company" name="companyName" control={control} error={formErrors.companyName} />
								<AppInput label={"Your Phone No"} placeholder="+254712345678" name="phoneNo" control={control} error={formErrors.phoneNo} />
								<AppInput label={"New Password"} placeholder="********" name="password" control={control} error={formErrors.password} type="password" />
								<AppInput label={"Confirm Password"} placeholder="********" name="confirmPassword" control={control} error={formErrors.confirmPassword} type="password" />
							</div>
							<div className="mt-16 flex items-center justify-end">
								<Button color="primary" type="submit" isLoading={saving} isDisabled={saving}>
									Submit
								</Button>
							</div>
						</form>
					</FormProvider>
				</>
			)}
		</>
	);
};

export default OnboardingScreen;
