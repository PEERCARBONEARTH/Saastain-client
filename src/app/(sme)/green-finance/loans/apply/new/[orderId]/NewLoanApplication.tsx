"use client";
import AppInput from "@/components/forms/AppInput";
import useDidHydrate from "@/hooks/useDidHydrate";
import useLoanUtils from "@/hooks/useLoanUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IOrder } from "@/types/Order";
import { zodResolver } from "@hookform/resolvers/zod";
import { BreadcrumbItem, Breadcrumbs, Button, Card, Progress, Spacer } from "@heroui/react";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import { z } from "zod";

interface IProps {
	orderId: string;
}

const formSchema = z.object({
	companyName: z.string().min(1, "Company Name is required"),
	companyWebsite: z.string(),
	nameOfContactPerson: z.string().min(1, "Name of Contact Person is required"),
	emailOfContactPerson: z.string().email("Invalid email address"),
	phoneNoOfContactPerson: z.string().min(10, "Phone number is required"),
	titleOfContactPerson: z.string().min(1, "Title of Contact Person is required"),
});

const NewLoanApplication: FC<IProps> = ({ orderId }) => {
	const [loading, setLoading] = useState<boolean>(false);

	const { data: orderDetails, isLoading } = useSWR<IOrder>(!orderId ? null : [`${IApiEndpoint.GET_ORDER_DETAILS}/${orderId}`], swrFetcher, { keepPreviousData: true });

	const { didHydrate } = useDidHydrate();
	const { data: session } = useSession();
	const { initialLoanApplication } = useLoanUtils();
	const router = useRouter();

	const account = useMemo(() => {
		if (didHydrate) {
			return session?.user;
		}

		return null;
	}, [session, didHydrate]);

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			companyName: "",
			companyWebsite: "",
			nameOfContactPerson: "",
			emailOfContactPerson: "",
			phoneNoOfContactPerson: "",
			titleOfContactPerson: "",
		},
	});

	const {
		handleSubmit,
		reset,
		formState: { errors: formErrors },
		control,
		setValue,
	} = formMethods;

	function updateFormFields() {
		setValue("companyName", account?.company?.companyName);
		setValue("companyWebsite", account?.company?.website ?? "");
		setValue("emailOfContactPerson", account?.email);
		setValue("nameOfContactPerson", account?.name);
		setValue("titleOfContactPerson", account?.roleInCompany);
	}

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const info = {
			companyName: data.companyName,
			companyWebsite: data.companyWebsite,
			emailOfContactPerson: data.emailOfContactPerson,
			nameOfContactPerson: data.nameOfContactPerson,
			titleOfContactPerson: data.titleOfContactPerson,
			phoneNoOfContactPerson: data.phoneNoOfContactPerson,
			appliedBy: account?.id,
			companyLocation: account?.company?.location,
			productId: orderDetails?.product?.id,
			orderId: orderDetails?.id,
			companyId: account?.company?.id,
		};
		setLoading(true);

		try {
			const resp = await initialLoanApplication(info);

			if (resp?.status === "success") {
				const rawData = resp?.data;
				toast.success("Company Information Saved Successfully");
				reset();
                router.push(`${AppEnumRoutes.APP_LOAN_REQUESTS_APPLY_NEW_COMPANY_LOCATION}/${rawData.id}`)
			} else {
				toast.error(resp?.msg ?? "Unable to save company information");
			}
		} catch (err) {
			toast.error("Unable to save company information");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (account) {
			updateFormFields();
		}
	}, [account]);

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem href={`${AppEnumRoutes.APP_PROJECT_DETAILS}/${orderId}`}>{isLoading ? "Loading" : `#${orderDetails?.orderCode} (${orderDetails?.product?.name})`}</BreadcrumbItem>
				<BreadcrumbItem>Loan Application</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-6">
				<h1 className="text-2xl font-bold">PeerCarbon Green Financing Application</h1>
				<div className="mt-4">
					<p className="text-sm">
						To ensure a seamless evaluation and optimize your chances of approval, please provide complete and accurate information in all fields. Rest assured, your application and data are handled with the
						strictest confidentiality in accordance with our privacy policy.
					</p>
					<p className="mt-3 text-sm"> Completing all sections allows us to make a swift and well-informed decision on your request.</p>
				</div>
			</div>
			<Spacer y={6} />
			<Card className="bg-[#E4FCE6]">
				<div className="p-8">
					<Progress size="sm" aria-label="Progress..." value={25} className="w-full" maxValue={100} showValueLabel={true} />
					<h1 className="mt-3 font-bold text-xl">SME General Details</h1>
					<FormProvider {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
								<AppInput label={"SME Name"} placeholder="e.g. Peers Traders" name="companyName" control={control} error={formErrors.companyName} />
								<AppInput label={"Website"} placeholder="e.g. peerstraders.com" name="companyWebsite" control={control} error={formErrors.companyWebsite} />
								<AppInput label={"Name of Contact Person"} placeholder="e.g. John Kelly" name="nameOfContactPerson" control={control} error={formErrors.nameOfContactPerson} />
								<AppInput label={"Title of Contact Person"} placeholder="e.g. CEO" name="titleOfContactPerson" control={control} error={formErrors.titleOfContactPerson} />
								<AppInput label={"Email"} placeholder="e.g. john.kelly@gmail.com" name="emailOfContactPerson" control={control} error={formErrors.emailOfContactPerson} />
								<AppInput label={"Phone Number"} placeholder="e.g. 0700234678" name="phoneNoOfContactPerson" control={control} error={formErrors.phoneNoOfContactPerson} />
							</div>
							<div className="mt-4 flex items-center justify-end gap-5">
								<Button isLoading={loading} isDisabled={loading} type="submit" color="primary" endContent={<ChevronRight size={15} />}>
									Next
								</Button>
							</div>
						</form>
					</FormProvider>
				</div>
			</Card>
		</>
	);
};

export default NewLoanApplication;
