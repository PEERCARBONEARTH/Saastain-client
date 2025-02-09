"use client";

import AppCheckboxGroup from "@/components/forms/AppCheckboxGroup";
import AppInput from "@/components/forms/AppInput";
import useDidHydrate from "@/hooks/useDidHydrate";
import useLoanUtils from "@/hooks/useLoanUtils";
import useOrderUtils from "@/hooks/useOrderUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { ILoanApplication } from "@/types/Loan";
import { OrderStage } from "@/types/Order";
import { generateOptions } from "@/utils";
import { BreadcrumbItem, Breadcrumbs, Button, Card, Chip, Progress, Skeleton, Spacer } from "@heroui/react";
import { ExternalLinkIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

interface IProps {
	loanId: string;
}

const eastAfricanCountries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia", "Burundi"];

const LoanReview = ({ loanId }: IProps) => {
	const [loading, setLoading] = useState<boolean>(false);
	const { data: loanInfo, isLoading } = useSWR<ILoanApplication>(!loanId ? null : [IApiEndpoint.GET_LOAN_APPLICATION_DETAILS, { id: loanId }], swrFetcher, { keepPreviousData: true });

	const { updateLoanToApplied } = useLoanUtils();
	const { saveNewOrderTimeline } = useOrderUtils();

	const { data: session } = useSession();
	const { didHydrate } = useDidHydrate();
	const router = useRouter();

	const account = useMemo(() => {
		if (didHydrate) return session?.user;

		return null;
	}, [session, didHydrate]);

	const onClickApply = async () => {
		setLoading(true);

		try {
			const resp = await updateLoanToApplied(loanId, loanInfo?.order?.id);

			if (resp?.status === "success") {
				toast.success("Loan Applied Successfully");
				saveNewTimelineInfo();
				router.push(`${AppEnumRoutes.APP_PROJECT_DETAILS}/${loanInfo?.order?.id}`);
			} else {
				toast.error(resp?.msg ?? "Unable to complete loan application");
			}
		} catch (err) {
			toast.error("Unable to complete loan application");
		} finally {
			setLoading(false);
		}
	};

	const saveNewTimelineInfo = async () => {
		const info = {
			orderId: loanInfo?.order?.id,
			code: OrderStage.LOAN_APPLICATION,
			title: "Loan Application Applied",
			description: `${account?.company?.companyName} has completed loan application process. It's Pending Review From Peercarbon Team.`,
		};
		try {
			await saveNewOrderTimeline(info);
		} catch (err) {}
	};

	const openDocument = useCallback((url: string) => {
		window.open(url, "_blank");
	}, []);

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem href={`${AppEnumRoutes.APP_PROJECT_DETAILS}/${loanInfo?.order?.id}`}>{isLoading ? "Loading" : `#${loanInfo?.order?.orderCode} (${loanInfo?.order?.product?.name})`}</BreadcrumbItem>
				<BreadcrumbItem>Loan Application - Confirm Details</BreadcrumbItem>
			</Breadcrumbs>
			<Spacer y={6} />
			{isLoading && <ProductSkeleton />}
			{loanInfo && (
				<div className="px-4 bg-[#E4FCE6] shadow-xl rounded-2xl">
					<div className="p-8">
						<Progress size="sm" aria-label="Progress..." value={100} className="w-full" maxValue={100} showValueLabel={true} />
						<h1 className="mt-3 font-bold text-xl">Confirm All Details</h1>
						<div className="mt-2">
							<h2 className="text-lg font-semibold">SME Information</h2>
						</div>
						<div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
							<AppInput label={"SME Name"} placeholder="e.g. Peers Traders" value={loanInfo.companyName} />
							<AppInput label={"Website"} placeholder="e.g. peerstraders.com" value={loanInfo.companyWebsite} />
							<AppInput label={"Name of Contact Person"} placeholder="e.g. John Kelly" value={loanInfo.nameOfContactPerson} />
							<AppInput label={"Title of Contact Person"} placeholder="e.g. CEO" value={loanInfo.titleOfContactPerson} />
							<AppInput label={"Email"} placeholder="e.g. john.kelly@gmail.com" value={loanInfo.titleOfContactPerson} />
							<AppInput label={"Phone Number"} placeholder="e.g. 0700234678" value={loanInfo.phoneNoOfContactPerson} />
						</div>
						<div className="mt-2">
							<h2 className="text-lg font-semibold">Company Operations</h2>
						</div>
						<Spacer y={4} />
						<div className="mt-5">
							<AppInput label={"Where is the Company headquatered?"} placeholder="Embakasi, Nairobi" value={loanInfo?.companyLocation} />
							<Spacer y={4} />
							<AppInput label={"How many full-time employees does the company have?"} placeholder="e.g. 20 Employees" value={loanInfo?.noOfEmployees} />
							<Spacer y={4} />
							<AppCheckboxGroup label="Countries of operation:" orientation="horizontal" options={generateOptions(eastAfricanCountries)} defaultValues={loanInfo.countriesOfOperation} />
						</div>
						<div className="mt-2">
							<h2 className="text-lg font-semibold">Financial Information</h2>
						</div>
						<Spacer y={4} />
						<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
							<AppInput label={"Revenue for the last 4 quarters"} placeholder="$ 0" value={loanInfo.totalRevenue} />
							<AppInput label={"Total Liabilities as reported in the most recent period"} placeholder="$ 0" value={loanInfo?.totalLiabilities} />
							<AppInput label={"Total Assets as reported in the most recent period"} placeholder="$ 0" value={loanInfo?.totalAssets} />
							<AppInput label={"How many years of Audited Financial Statements do you have available?"} placeholder="e.g. 2 years" value={loanInfo?.yearsOfAuditedFinancialStatements} />
							<AppInput label={"How many years of Operating Track Record do you have?"} placeholder="e.g. 2 years" value={loanInfo.yearsOfOperatingTrackRecord} />
						</div>
						<Spacer y={4} />
						<p className="text-sm font-semibold">Financial Documents Attached</p>
						<div className="mt-2 flex items-center gap-2 flex-wrap">
							{loanInfo?.financialDocuments?.map((item) => (
								<Chip key={item.documentName} color="primary" variant="bordered" onClose={() => openDocument(item.documentUrl)} endContent={<ExternalLinkIcon className="w-4 h-4" />}>
									{item.documentName}
								</Chip>
							))}
						</div>
						<div className="flex items-center justify-end">
							<Button size="lg" color="primary" isLoading={loading} isDisabled={loading} onPress={onClickApply}>
								Apply Loan
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

const ProductSkeleton = () => {
	return (
		<Card className="w-full space-y-5 p-4" radius="lg">
			<Skeleton className="rounded-lg">
				<div className="h-24 rounded-lg bg-default-300"></div>
			</Skeleton>
			<div className="space-y-3">
				<Skeleton className="w-3/5 rounded-lg">
					<div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
				</Skeleton>
				<Skeleton className="w-4/5 rounded-lg">
					<div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
				</Skeleton>
				<Skeleton className="w-2/5 rounded-lg">
					<div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
				</Skeleton>
			</div>
		</Card>
	);
};

export default LoanReview;
