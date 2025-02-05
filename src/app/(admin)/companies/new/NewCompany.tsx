"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import AppBtn from "@/components/btns/AppBtn";
import AppInput from "@/components/forms/AppInput";
import AppTextArea from "@/components/forms/AppTextArea";
import useCompanyUtils from "@/hooks/useCompanyUtils";
import useUserUtils from "@/hooks/useUserUtils";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { SystemRole } from "@/types/User";
import { yupResolver } from "@hookform/resolvers/yup";
import { Breadcrumbs, BreadcrumbItem, Progress, Button } from "@heroui/react";
import { XIcon, ChevronRightIcon, ChevronLeft, CheckIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { InferType, array, object, string } from "yup";
import AppCreateableSelect from "@/components/forms/AppCreateableSelect";

const NewCompanySchema = object({
	companyName: string().required("Company name is required"),
	primaryEmail: string().email("Invalid email").required("Company email is required"),
	phoneNo: string().required("Company phone number is required"),
	location: string().required("Company location is required"),
	industry: array()
		.of(
			object({
				label: string(),
				value: string(),
			})
		)
		.compact((val) => !val.value || val.label === "" || val.value === "")
		.min(1, "Please add at least one industry")
		.max(5, "You can only add up to 5 industries")
		.required("Please add at least one industry"),
	businessType: string(),
	website: string(),
	description: string().required("Company description is required"),
	contactPerson: object({
		name: string().required("Contact person's name is required"),
		email: string().email("Invalid email").required("Contact person's email is required"),
		roleInCompany: string().required("Contact person's role is required"),
	}),
});

const NewCompany = () => {
	const [position, setPosition] = useState<"basic-info" | "user-info">("basic-info");
	const [loading, setLoading] = useState<boolean>(false);

	const formMethods = useForm({
		resolver: yupResolver(NewCompanySchema),
		defaultValues: {
			companyName: "",
			primaryEmail: "",
			phoneNo: "",
			location: "",
			industry: [],
			businessType: "",
			website: "",
			description: "",
			contactPerson: {
				name: "",
				email: "",
				roleInCompany: "",
			},
		},
	});

	const {
		handleSubmit,
		formState: { errors },
		control,
		reset,
	} = formMethods;

	const router = useRouter();
	const { createUser } = useUserUtils();
	const { adminCreateCompany, adminUpdateUserWithCompany } = useCompanyUtils();

	const onSubmit = async (data: InferType<typeof NewCompanySchema>) => {
		const newIndustry = data.industry.map((ind) => ind.value).join(", ");
		const userInfo = {
			name: data.contactPerson.name,
			email: data.contactPerson.email,
			roleInCompany: data.contactPerson.roleInCompany,
			systemRole: SystemRole.COMPANY_ADMIN,
			password: nanoid(10),
		};

		const newCompany = {
			companyName: data.companyName,
			primaryEmail: data.primaryEmail,
			phoneNo: data.phoneNo,
			location: data.location,
			industry: newIndustry,
			businessType: data.businessType,
			website: data.website,
			description: data.description,
			userId: null,
		};

		setLoading(true);
		const id = toast.loading("Setting up company...");

		try {
			const respUser = await createUser(userInfo);

			if (respUser?.status === "success") {
				toast.success("User created successfully", { id });

				const respCompany = await adminCreateCompany(newCompany);

				if (respCompany?.status === "success") {
					toast.success("Company created successfully", { id });
					await adminUpdateUserWithCompany(respUser.data.id, respCompany.data.id);
					toast.success("User updated with company successfully", { id });
					reset();
					router.push(AppEnumRoutes.APP_COMPANIES);
				} else {
					toast.error("Failed to create company", { id });
				}
			} else {
				toast.error(respUser?.msg ?? "Failed to create user", { id });
			}
		} catch (err) {
			toast.error("Something went wrong", { id });
		}
	};

	const handleNext = () => {
		if (position === "basic-info") {
			setPosition("user-info");
		}
	};
	const handleBack = () => {
		if (position === "user-info") {
			setPosition("basic-info");
		}
	};

	return (
		<AuthRedirectComponent>
			<FormProvider {...formMethods}>
				<Breadcrumbs>
					<BreadcrumbItem href="/app/dashboard">Home</BreadcrumbItem>
					<BreadcrumbItem startContent={<HiOutlineOfficeBuilding size={16} />} href={AppEnumRoutes.APP_COMPANIES}>
						Companies
					</BreadcrumbItem>
					<BreadcrumbItem>Add New Company</BreadcrumbItem>
				</Breadcrumbs>
				<div className="flex flex-col my-8 space-y-2">
					<h3 className="text-lg font-semibold">Add New Company</h3>
					<p className="text-gray-600">Kindly fill the form below to onboard a new company to SaaStain.</p>
				</div>
				<Progress aria-label="Progress..." size="md" value={position === "basic-info" ? 50 : 100} color="primary" showValueLabel={true} className="max-w-full" />
				{errors && Object.keys(errors).length > 0 && (
					<div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-500 mt-3">
						<h5 className="font-semibold">Error</h5>
						<p className="text-sm">There are errors in the form. Please fix them before submitting the form.</p>
					</div>
				)}
				<div className="my-4 md:my-8 font-medium">
					<h3>{position === "basic-info" ? "Basic Information" : "User Information"}</h3>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					{position === "basic-info" && (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 my-6">
								<AppInput label="Company Name" placeholder="e.g. Indiana Tech" name="companyName" control={control} error={errors.companyName} />
								<AppInput label="Company Email" placeholder="e.g. info@indiana.com" name="primaryEmail" control={control} error={errors.primaryEmail} />
								<AppInput label="Company Phone No" placeholder="e.g. 0700123456" name="phoneNo" control={control} error={errors.phoneNo} />
								<AppCreateableSelect
									label="Company Industry"
									helperText="Type the industry for the company and press enter"
									placeholder="e.g. Technology, Finance, etc."
									name="industry"
									control={control}
									error={errors.industry as any}
								/>
								<AppInput
									label="Type of Company"
									placeholder="e.g. Limited, Public, etc."
									helperText="The type of business the company operates"
									name="businessType"
									control={control}
									error={errors.businessType}
								/>
								<AppInput label="Where is the company located?" placeholder="e.g. Nairobi, Kenya" name="location" control={control} error={errors.location} />
								<AppInput label="Company Website" placeholder="e.g. https://example.com" name="website" control={control} error={errors.website} />
							</div>
							<AppTextArea label="Company Description" placeholder="A brief description of the company" name="description" control={control} error={errors.description} />
							<div className="flex items-center justify-center md:justify-end mt-7">
								<div className="flex flex-row space-x-5">
									<Button size="md" variant="bordered" color="primary" onClick={router.back} endContent={<XIcon className="w-4 h-4" />}>
										Cancel
									</Button>

									<AppBtn type="button" size="md" text="Next" endIcon={<ChevronRightIcon className="w-4 h-4 md:w-8 md:h-8" />} onClick={handleNext} />
								</div>
							</div>
						</>
					)}

					{position === "user-info" && (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 my-6">
								<AppInput label="Contact Person's Name" placeholder="Enter contact person's name" name="contactPerson.name" control={control} error={errors.contactPerson?.name} />
								<AppInput label="Contact Person's Email" placeholder="Enter contact person's email" name="contactPerson.email" control={control} error={errors.contactPerson?.email} />
								<AppInput
									label="What's the role of the contact person?"
									placeholder="e.g. CEO, CTO, etc."
									name="contactPerson.roleInCompany"
									control={control}
									error={errors.contactPerson?.roleInCompany}
								/>
							</div>
							<div className="flex items-center justify-center md:justify-end mt-7">
								<div className="flex flex-row space-x-5">
									<Button color="primary" onClick={handleBack} startContent={<ChevronLeft className="w-4 h-4" />}>
										Back
									</Button>

									<AppBtn type="submit" size="md" text="Submit" endIcon={<CheckIcon className="w-4 h-4 md:w-8 md:h-8" />} isLoading={loading} isDisabled={loading} />
								</div>
							</div>
						</>
					)}
				</form>
			</FormProvider>
		</AuthRedirectComponent>
	);
};

export default NewCompany;
