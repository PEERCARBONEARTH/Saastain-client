"use client";
import useCompanyUtils from "@/hooks/useCompanyUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { ICompany } from "@/types/Company";
import { zodResolver } from "@hookform/resolvers/zod";
import { BreadcrumbItem, Breadcrumbs, Button, Divider, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { FiEdit3 } from "react-icons/fi";
import AppInput from "@/components/forms/AppInput";
import AppTextArea from "@/components/forms/AppTextArea";

interface IProps {
	id: string;
}
const formSchema = z.object({
	companyName: z.string().min(1, "Company name is required"),
	primaryEmail: z.string().email("Invalid email"),
	location: z.string().min(1, "Company Head Office is required"),
	businessType: z.string(),
	corporateNumber: z.string().min(0),
	website: z.string(),
	phoneNo: z.string(),
	description: z.string().min(1, "Company Description is required"),
});
const EditCompanyProfile: FC<IProps> = ({ id }) => {
	const {
		data: companyInfo,
		error,
		isLoading,
	} = useSWR<ICompany>(!id ? null : [IApiEndpoint.GET_COMPANY, { id }], swrFetcher, {
		keepPreviousData: true,
	});

	const [loading, setLoading] = useState<boolean>(false);
	const { updateCompanyProfile } = useCompanyUtils();
	const router = useRouter();

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			companyName: "",
			primaryEmail: "",
			location: "",
			businessType: "",
			corporateNumber: "",
			website: "",
			phoneNo: "",
			description: "",
		},
	});

	const {
		handleSubmit,
		reset,
		control,
		formState: { errors: formErrors },
		setValue,
	} = formMethods;

	useEffect(() => {
		if (companyInfo) {
			setValue("companyName", companyInfo.companyName);
			setValue("primaryEmail", companyInfo.primaryEmail);
			setValue("location", companyInfo.location);
			setValue("businessType", companyInfo.businessType);
			setValue("corporateNumber", companyInfo.corporateNumber);
			setValue("website", companyInfo.website);
			setValue("phoneNo", companyInfo.phoneNo);
			setValue("description", companyInfo.description);
		}
	}, [companyInfo]);

	const onSubmit = handleSubmit(async (data) => {
		setLoading(true);
		try {
			const resp = await updateCompanyProfile({ ...data, id: id });
			if (resp?.status === "success") {
				toast.success("Updated Company Profile Successfully...");
				reset();
				router.push(`${AppEnumRoutes.APP_COMPANY_PROFILE}/${id}`);
			} else {
				toast.error("Unable to update company profile at this time");
			}
		} catch (err) {
			toast.error("Unable to update company profile at this time");
		} finally {
			setLoading(false);
		}
	});

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={`${AppEnumRoutes.APP_DASHBOARD}`}>Home</BreadcrumbItem>
				<BreadcrumbItem href={`${AppEnumRoutes.APP_COMPANY_PROFILE}/${id}`}>Company Profile</BreadcrumbItem>
				<BreadcrumbItem>Edit</BreadcrumbItem>
			</Breadcrumbs>
			<div className="relative mt-8">
				<div className="rounded-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 w-full h-56"></div>
				<div className="absolute -bottom-10 left-5 ">
					<img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="rounded-full w-24 h-24" />
				</div>
			</div>
			{isLoading && (
				<div className="flex items-center justify-center h-96">
					<Spinner size="lg" /> <span className="ml-2">Loading...</span>
				</div>
			)}
			{error && (
				<Alert variant="destructive">
					<AlertTriangleIcon className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						<p>There was an error fetching the company details. Please try again later.</p>
					</AlertDescription>
				</Alert>
			)}
			{companyInfo && (
				<div className="bg-white shadow-lg rounded-xl px-3 py-5 mt-16 border">
					<FormProvider {...formMethods}>
						<form onSubmit={onSubmit}>
							<div className="flex flex-col md:flex-row items-center justify-center md:justify-between md:mb-0">
								<h3 className="text-lg font-semibold">Edit General Information</h3>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
								<AppInput label={"Name"} name="companyName" control={control} error={formErrors.companyName} placeholder="e.g. LP Management" />
								<AppInput label={"Company Email"} name="primaryEmail" control={control} error={formErrors.primaryEmail} placeholder="e.g. info@lpmanagement.com" />
								<AppInput label={"Head Office"} name="location" control={control} error={formErrors.location} placeholder="e.g. Nairobi" />
								<AppInput label={"Type of Business"} name="businessType" control={control} error={formErrors.businessType} placeholder="e.g. Finance" />
								<AppInput label={"Corporate Number"} name="corporateNumber" control={control} error={formErrors.corporateNumber} placeholder="e.g. LP001" />
								<AppInput label={"Website"} name="website" control={control} error={formErrors.website} placeholder="e.g. lp-manager.xyz" />
								<AppInput label={"Phone No."} name="phoneNo" control={control} error={formErrors.phoneNo} placeholder="e.g. 0700123456" />
							</div>
							<div className="my-2">
								<AppTextArea label="Description" name="description" control={control} error={formErrors.description} placeholder="Type something ..." />
							</div>
							<Divider />
							<div className="flex items-center justify-end gap-2 mt-4">
								<Button color="primary" variant="bordered" type="button" onPress={router.back}>
									Cancel
								</Button>
								<Button color="primary" startContent={<FiEdit3 className="w-4 h-4" />} type="submit" isLoading={loading} isDisabled={loading}>
									Update Profile
								</Button>
							</div>
						</form>
					</FormProvider>
				</div>
			)}
		</>
	);
};

export default EditCompanyProfile;
