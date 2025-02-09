"use client";
import Image from "next/image";
import { Button, Spacer } from "@heroui/react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AppInput from "@/components/forms/AppInput";
import AppTextArea from "@/components/forms/AppTextArea";
import { useState } from "react";
import { FolderPen, MailCheck, MapPin, PencilLine, Phone } from "lucide-react";
import toast from "react-hot-toast";
import useCompanyUtils from "@/hooks/useCompanyUtils";
import { signOut, useSession } from "next-auth/react";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { useRouter } from "next/navigation";

const schema = z.object({
	companyName: z.string(),
	location: z.string(),
	description: z.string(),
	phoneNo: z.string(),
	primaryEmail: z.string(),
});

const SetupCompanyProfile = () => {
	const [loading, setLoading] = useState(false);
	const { createCompany } = useCompanyUtils();
	const { data: session } = useSession();
	const router = useRouter();

	const formMethods = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			companyName: "",
			location: "",
			description: "",
			phoneNo: "",
			primaryEmail: "",
		},
	});

	const {
		reset,
		control,
		handleSubmit,
		formState: { errors },
	} = formMethods;

	const logout = async () => {
		await signOut({
			redirect: false,
		});
		router.push(AppEnumRoutes.AUTH_LOGIN);
	};

	const onSubmit = async (data: Required<z.infer<typeof schema>>) => {
		setLoading(true);
		const id = toast.loading("Creating Company Profile...");

		if (!session.user) {
			toast.error("Please login to create your company profile.");
			return;
		}

		try {
			const response = await createCompany({
				userId: session.user.id,
				companyName: data.companyName,
				location: data.location,
				phoneNo: data.phoneNo,
				description: data.description,
				primaryEmail: data.primaryEmail,
				terms: true,
			});
			if (response.status === "success") {
				toast.success("Company Profile Created Successfully", { id });
				reset();
				// TODO: Implement Refresh token, to update session with new information
				logout?.();
			} else {
				toast.error(response.msg, { id });
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred, please try again", { id });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-auth h-screen">
			<div className="">
				<Image className="w-1/6 p-6" src={"/images/saastain_logo.svg"} alt="" width={140} height={140} />
			</div>
			<Spacer y={6} />
			<div className="flex flex-col items-center">
				<div className="flex flex-col gap-4 px-5">
					<h2 className="font-semibold text-3xl">Set Up Your Company Profile </h2>
					<p className="text-sm leading-1">Saastain goes beyond conventional solutions, empowering you to not only navigate the complexities of emissions tracking but also to drive sustainable growth.</p>
				</div>
				<Spacer y={6} />
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl px-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
							<AppInput
								label="Company Name"
								name="companyName"
								placeholder="Enter Company Name"
								control={control}
								error={errors.companyName}
								startContent={<FolderPen size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
							/>
							<AppInput
								label="Company Phone"
								name="phoneNo"
								placeholder="Enter Company Phone"
								control={control}
								error={errors.phoneNo}
								startContent={<Phone size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
							/>

							<AppInput
								label="Company Email"
								name="primaryEmail"
								placeholder="Enter Company Email"
								control={control}
								error={errors.primaryEmail}
								startContent={<MailCheck size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
							/>
							<AppInput
								label="Company Location"
								name="location"
								placeholder="Enter Company Location"
								control={control}
								error={errors.location}
								startContent={<MapPin size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
							/>
						</div>
						<Spacer y={4} />
						<AppTextArea
							label="Company Description"
							name="description"
							placeholder="Enter Company Description"
							control={control}
							error={errors.description}
							startContent={<PencilLine size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
						/>
						<div className="flex flex-col md:flex-row  justify-end py-4 my-8">
							<Button type="submit" color="primary" isDisabled={loading} isLoading={loading}>
								Submit
							</Button>
						</div>
					</form>
				</FormProvider>
			</div>
		</div>
	);
};

export default SetupCompanyProfile;
