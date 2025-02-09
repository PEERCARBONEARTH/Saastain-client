"use client";
import AppCheckboxGroup from "@/components/forms/AppCheckboxGroup";
import AppInput from "@/components/forms/AppInput";
import useDidHydrate from "@/hooks/useDidHydrate";
import useLoanUtils from "@/hooks/useLoanUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { ILoanApplication } from "@/types/Loan";
import { generateOptions } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BreadcrumbItem, Breadcrumbs, Button, Card, Progress, Spacer } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import { z } from "zod";

const eastAfricanCountries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia", "Burundi"];

interface IProps {
	loanId: string;
}

const formSchema = z.object({
	companyLocation: z.string().min(1, "Company Headquaters is required"),
	noOfEmployees: z.string().min(1, "No of Employees is required"),
	countriesOfOperation: z.array(z.string()).min(1, "Please at least one country of Operation"),
});

const CompanyLocationDetails = ({ loanId }: IProps) => {
	const [loading, setLoading] = useState<boolean>(false);
	const { data: loanInfo, isLoading } = useSWR<ILoanApplication>(!loanId ? null : [IApiEndpoint.GET_LOAN_APPLICATION_DETAILS, { id: loanId }], swrFetcher, { keepPreviousData: true });
	const { didHydrate } = useDidHydrate();
	const { data: session } = useSession();
	const { updateLoanInfo } = useLoanUtils();
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
			companyLocation: "",
			noOfEmployees: "",
			countriesOfOperation: ["Kenya"],
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
		setValue("companyLocation", account?.company?.location);
	}

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const info = {
			companyLocation: data.companyLocation,
			noOfEmployees: data.noOfEmployees,
			countriesOfOperation: data.countriesOfOperation,
			loanApplicationId: loanId,
		};
		setLoading(true);

		try {
			const resp = await updateLoanInfo(info);

			if (resp?.status === "success") {
				toast.success("Location Information Updated Successfully");
				reset();
				router.push(`${AppEnumRoutes.APP_LOAN_REQUESTS_APPLY_NEW_COMPANY_FINANCIAL_INFORMATION}/${loanId}`);
			} else {
				toast.error(resp?.msg ?? "Unable to update location information");
			}
		} catch (err) {
			toast.error("Unable to update location information");
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
				<BreadcrumbItem href={`${AppEnumRoutes.APP_PROJECT_DETAILS}/${loanInfo?.order?.id}`}>{isLoading ? "Loading" : `#${loanInfo?.order?.orderCode} (${loanInfo?.order?.product?.name})`}</BreadcrumbItem>
				<BreadcrumbItem>Loan Application - SME Location</BreadcrumbItem>
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
					<Progress size="sm" aria-label="Progress..." value={50} className="w-full" maxValue={100} showValueLabel={true} />
					<h1 className="mt-3 font-bold text-xl">SME Location Information</h1>
					<FormProvider {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="mt-3">
								<AppInput label={"Where is the Company headquatered?"} placeholder="Embakasi, Nairobi" name="companyLocation" control={control} error={formErrors.companyLocation} />
								<Spacer y={4} />
								<AppInput label={"How many full-time employees does the company have?"} placeholder="e.g. 20 Employees" name="noOfEmployees" control={control} error={formErrors.noOfEmployees} />
								<Spacer y={4} />
								<AppCheckboxGroup
									label="Please all applicable countries of operation:"
									orientation="horizontal"
									options={generateOptions(eastAfricanCountries)}
									name="countriesOfOperation"
									control={control}
									error={formErrors.countriesOfOperation}
								/>
							</div>
							<div className="mt-4 flex items-center justify-end gap-5">
								<Button type="button" startContent={<ChevronLeft size={15} />} color="primary" variant="bordered">
									Previous
								</Button>
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

export default CompanyLocationDetails;
