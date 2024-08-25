"use client";
import { API_URL } from "@/env";
import useDocumentsUtils from "@/hooks/useDocumentsUtils";
import useGreenLoanUtils from "@/hooks/useGreenLoanUtils";
import { swrFetcher } from "@/lib/api-client";
import { AccountingReportPeriod } from "@/types/Accounting";
import { getEndpoint, IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IGreenLoanApplication } from "@/types/GreenLoanApplication";
import { formatCurrency, getInitials } from "@/utils";
import { Avatar, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Skeleton } from "@nextui-org/react";
import axios from "axios";
import { format, sub } from "date-fns";
import { CheckIcon, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { HiCheckCircle, HiEye, HiOutlineCloudUpload, HiDocumentText, HiDotsVertical, HiUser, HiMail, HiPhone } from "react-icons/hi";
import useSWR from "swr";
import GenerateClimateRiskReportModal from "./GenerateClimateRiskReportModal";
const StrokedGaugeEmissions = dynamic(() => import("@/components/charts/StrokedGaugeChart"), { ssr: false });

const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024;

function replaceSpacesWithHyphen(inputString: string) {
	return inputString.replace(/ /g, "-");
}

interface IScopesData {
	scopeOne: {
		bioEnergy: number;
		fuels: number;
		fugitive: number;
		processEmission: number;
		fleet: number;
	};
	scopeTwo: {
		electricityTotal: number;
		heatAndSteamTotal: number;
		coolingTotal: number;
	};
}

const LoanRequestDetails = ({ id }: { id: string }) => {
	const [isGeneratingEmissionsReport, setIsGeneratingEmissionsReport] = useState<boolean>(false);
	const onGenerate = async () => {};

	const { uploadOneDocument } = useDocumentsUtils();
	const { updateEmissionBaselineDocument } = useGreenLoanUtils();

	const onDrop = (acceptedFiles: File[]) => {};

	const docSizeValidator = (file: File) => {
		if (file.size > MAX_FILE_SIZE_BYTES) {
			return {
				code: ErrorCode.FileTooLarge,
				message: "Image is larger tham 10MB",
			};
		}

		return null;
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, validator: docSizeValidator });

	const splitCategoriesByComma = (cat: string) => cat.split(", ").filter(Boolean);

	const { data: appliedLoanDetails, isLoading, mutate: refetchLoanDetails } = useSWR<IGreenLoanApplication>(!id ? null : [`${IApiEndpoint.GET_APPLIED_LOAN_DETAILS}/${id}`], swrFetcher, { keepPreviousData: true });

	const { data: scopesData } = useSWR<IScopesData>(!appliedLoanDetails ? null : [`${IApiEndpoint.GET_SCOPES_DATA_LAST_ONE_YEAR}/${appliedLoanDetails?.company?.id}`], swrFetcher, {
		keepPreviousData: true,
	});

	const uploadDocumentToStorage = async (documentFile: Blob, documentName: string, folderPath: string, callback: (url: string) => void) => {
		const file = new File([documentFile], documentName, { type: "application/pdf" });
		try {
			const info = {
				file,
				folder: folderPath,
			};
			const resp = await uploadOneDocument(info);

			if (resp?.status === "success") {
				callback(resp?.data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const computeTotalScopesData = (scopesData: IScopesData) => {
		if (!scopesData) return null;

		const totalScopeOne = Object.values(scopesData.scopeOne).reduce((acc, value) => acc + value, 0);
		const totalScopeTwo = Object.values(scopesData.scopeTwo).reduce((acc, value) => acc + value, 0);

		return {
			totalScopeOne,
			totalScopeTwo,
		};
	};

	const totalEmissions = useMemo(() => {
		if (!scopesData) return "0.00 kgCO2";

		let scopeOneTotal = computeTotalScopesData(scopesData).totalScopeOne;
		let scopeTwoTotal = computeTotalScopesData(scopesData).totalScopeTwo;
		let totalEmissionStr = `${scopeOneTotal + scopeTwoTotal} kgCO2`;

		return totalEmissionStr;
	}, [scopesData]);

	const updateEmissionsDocumentInLoanApplication = async (url: string) => {
		let endDate = new Date();

		let startDate = sub(endDate, { years: 1 });

		let startFormatted = format(startDate, "PPP");
		let endFormatted = format(endDate, "PPP");
		try {
			await updateEmissionBaselineDocument(appliedLoanDetails?.id, {
				totalEmission: totalEmissions,
				accountingPeriod: `${startFormatted} - ${endFormatted}`,
				documentUrl: url,
			});
			refetchLoanDetails();
		} catch (err) {}
	};

	const generateEmissionsReport = async () => {
		const id = toast.loading("Generating Emissions Report");
		setIsGeneratingEmissionsReport(true);

		try {
			const resp = await axios.get<Blob>(`${API_URL}${getEndpoint(IApiEndpoint.GENERATE_EMISSIONS_REPORT)}`, {
				params: {
					companyId: appliedLoanDetails?.company?.id,
					period: AccountingReportPeriod.CURRENT_YEAR,
					companyName: appliedLoanDetails?.company?.companyName,
				},
				headers: {
					Accept: "application/json",
				},
				responseType: "blob",
			});

			toast.success("Report Generated Successfully", { id });

			const arrBuffer = await resp.data.arrayBuffer();

			const blob = new Blob([arrBuffer], { type: "application/pdf" });

			let companyRaw = appliedLoanDetails?.company?.companyName;
			let companyName = replaceSpacesWithHyphen(companyRaw);

			let documentName = `${companyName}-emissions-report.pdf`;
			let folderPath = `emission-reports/${appliedLoanDetails?.company?.id}`;

			// we need to send an upload request to backend but in background
			uploadDocumentToStorage(blob, documentName, folderPath, updateEmissionsDocumentInLoanApplication);

			const url = window.URL.createObjectURL(blob);

			const link = document.createElement("a");

			link.href = url;

			link.setAttribute("download", documentName);

			document.body.appendChild(link);

			link.click();

			setTimeout(() => window.URL.revokeObjectURL(url), 3000);
		} catch (err) {
			toast.error("An error occurred while trying to download the report", { id });
		} finally {
			setIsGeneratingEmissionsReport(false);
		}
	};

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem>{isLoading ? "Loading" : appliedLoanDetails ? `${appliedLoanDetails?.company?.companyName}'s Loan Application` : "Loading"}</BreadcrumbItem>
			</Breadcrumbs>
			{isLoading && <TopCardSkeleton />}
			{appliedLoanDetails && (
				<div className="mt-4 flex items-center justify-between">
					<h1 className="text-green-800 font-bold text-2xl">{appliedLoanDetails?.company?.companyName}'s Loan Application</h1>
					<div className="space-x-2 flex">
						<Button color="warning">Reject</Button>
						<Button color="primary" endContent={<CheckIcon className="w-5 h-5" />}>
							Approve
						</Button>
					</div>
				</div>
			)}
			<hr className="my-4 border-primary" />
			{isLoading && (
				<div className="grid grid-cols-1 md:grid-cols-12 gap-2 px-3 w-full mt-5">
					<div className="col-auto md:col-span-9">
						<ProductSkeleton />
					</div>
					<div className="col-auto md:col-span-3">
						<ProductSkeleton />
					</div>
				</div>
			)}
			{appliedLoanDetails && (
				<>
					{!appliedLoanDetails?.climateRiskData && (
						<div className="my-2">
							<Card className="bg-yellow-100">
								<CardHeader>
									<div className="flex items-center gap-3">
										<HiCheckCircle className="w-6-h-6 text-yellow-700" />
										<h2 className="text-yellow-700 font-extrabold">Climate Risk Report Required</h2>
									</div>
								</CardHeader>
								<CardBody>
									<p className="text-sm">
										Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of
										content.
									</p>
								</CardBody>
								<CardFooter>
									<div className="flex items-center justify-end w-full">
										<GenerateClimateRiskReportModal loanApplication={appliedLoanDetails} refetch={refetchLoanDetails} />
									</div>
								</CardFooter>
							</Card>
						</div>
					)}
					{!appliedLoanDetails?.totalBaselineEmissions && (
						<div className="my-2">
							<Card className="bg-yellow-100">
								<CardHeader>
									<div className="flex items-center gap-3">
										<HiCheckCircle className="w-6-h-6 text-yellow-700" />
										<h2 className="text-yellow-700 font-extrabold">Baseline Report Required</h2>
									</div>
								</CardHeader>
								<CardBody>
									<p className="text-sm">
										Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of
										content.
									</p>
								</CardBody>
								<CardFooter>
									<div className="flex items-center justify-end w-full">
										<Button
											isLoading={isGeneratingEmissionsReport}
											isDisabled={isGeneratingEmissionsReport}
											onPress={generateEmissionsReport}
											className="bg-yellow-700 text-white"
											endContent={<HiEye className="w-5 h-5" />}>
											Generate
										</Button>
									</div>
								</CardFooter>
							</Card>
						</div>
					)}
					<div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10">
						<div className="col-auto md:col-span-9">
							<div className="flex items-start gap-6">
								<div className="">
									<Avatar showFallback getInitials={getInitials} name={appliedLoanDetails?.company?.companyName} radius="lg" className="w-28 h-28 text-5xl bg-gray-900 text-white" />
								</div>
								<div className="space-y-2">
									<h1 className="text-saastain-green font-bold text-2xl">Company Profile</h1>
									<p className="text-[#374151ß] text-sm">{appliedLoanDetails?.company?.description}</p>
								</div>
							</div>
							{appliedLoanDetails?.climateRiskData && (
								<div className="space-y-2 mt-10">
									<h1 className="text-saastain-green font-bold text-2xl">Climate Risk Summary</h1>
									<p className="text-[#374151ß] text-sm">
										Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
										beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
										nesciunt.
									</p>
								</div>
							)}
							<div className="mt-10">
								<h1 className="text-saastain-green font-bold text-2xl">Sustainability Perfomance Targets</h1>
								<div className="border border-gray-300 rounded-lg mt-3">
									<div className="px-2 py-2.5 grid grid-cols-2 border-b border-gray-300 bg-[#F9FAFB] rounded-t-lg">
										<h1 className="uppercase">Sustainability perfomance target</h1>
										<h1 className="uppercase">Key Performance Indicators</h1>
									</div>
									{[...Array.from({ length: 6 })].map((_, idx) => (
										<div key={idx} className="px-2 py-3 grid grid-cols-2 border-b border-gray-300 last:border-none">
											<h1 className="text-sm">Sustainability perfomance target one here</h1>
											<h1 className="text-sm">Emissions Reductions</h1>
										</div>
									))}
								</div>
							</div>
							<div className="mt-10">
								<div className="space-y-2">
									<h1 className="font-bold text-2xl">SDGs</h1>
									<p className="text-[#374151ß] text-sm">
										Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
									</p>
								</div>
								<div className="mt-3">
									<div className="flex items-center gap-2 flex-wrap">
										{[...Array.from({ length: 4 })].map((_, idx) => (
											<Image src="/images/project/SDG-3.png" width={80} key={idx} />
										))}
									</div>
								</div>
							</div>
						</div>
						<div className="col-auto md:col-span-3">
							<div className="border border-dashed border-primary flex items-center justify-center p-4 text-center rounded-xl cursor-pointer mt-2" {...getRootProps()}>
								<input {...getInputProps()} />
								{isDragActive ? (
									<p>Drop files here ...</p>
								) : (
									<div className="flex flex-col items-center gap-3">
										<HiOutlineCloudUpload className="w-8 h-8" />
										<p className="text-primary">Click to upload your report or drag and drop</p>
									</div>
								)}
							</div>
							<div className="mt-5">
								<div className="bg-primary rounded-xl">
									<StrokedGaugeEmissions label="Climate Risk Score" value={81} />
								</div>
							</div>
							<div className="mt-5">
								<div className="px-3 py-3 rounded-xl border">
									<h1 className="font-bold text-base">Reports</h1>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<HiDocumentText />
											<p className="text-sm truncate">Credit Risk Report</p>
										</div>
										<Dropdown>
											<DropdownTrigger>
												<Button size="sm" isIconOnly variant="light">
													<HiDotsVertical />
												</Button>
											</DropdownTrigger>
											<DropdownMenu className="saastain font-nunito" aria-label="Docs Actions">
												<DropdownItem key="view">View</DropdownItem>
												<DropdownItem key="download">Download</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</div>
									<div className="mt-4">
										<div className="w-full h-[1px] bg-primary-500 my-4"></div>
										<div className="flex items-center justify-end">
											<Button size="sm" variant="bordered" color="primary">
												Download All
											</Button>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-5">
								<div className="px-3 py-3 rounded-xl border">
									<div className="flex items-center justify-between">
										<h1 className="font-bold text-base text-primary">Loan Summary</h1>
										<ChevronDown className="text-primary" />
									</div>
									<div className="mt-4 space-y-3">
										<div className="flex items-center justify-between">
											<p className="text-sm text-gray-500">Product Name</p>
											<p className="text-xs text-gray-800 truncate font-semibold">{appliedLoanDetails?.order?.product?.name}</p>
										</div>
										<div className="flex items-center justify-between">
											<p className="text-sm text-gray-500">Loan Type</p>
											<p className="text-xs text-gray-800 truncate font-semibold">Green Loan</p>
										</div>
										<div className="flex items-center justify-between">
											<p className="text-sm text-gray-500">Amount Requested</p>
											<p className="text-xs text-gray-800 truncate font-semibold">{formatCurrency(appliedLoanDetails?.order?.quoteDetails?.[0]?.totalCost)} </p>
										</div>
										<div className="flex items-center justify-between">
											<p className="text-sm text-gray-500">Industry</p>
											<div className="flex items-center gap-1 flex-wrap">
												{splitCategoriesByComma(appliedLoanDetails?.order?.product?.categories)?.map((cat) => (
													<Chip size="sm" key={cat} className="bg-green-100 text-green-800 capitalize text-xs font-semibold">
														{cat}
													</Chip>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-5">
								<div className="px-3 py-3 rounded-xl border">
									<div className="flex items-center justify-between">
										<h1 className="font-bold text-base text-primary">Green Lender</h1>
										<ChevronDown className="text-primary" />
									</div>
									<div className="mt-4 space-y-3">
										<div className="flex items-center gap-4">
											<HiUser className="w-5 h-5" />
											<p className="text-sm text-gray-700">Lender Name</p>
										</div>
										<div className="flex items-center gap-4">
											<HiMail className="w-5 h-5" />
											<p className="text-sm text-gray-700">lender@gmail.com</p>
										</div>
										<div className="flex items-center gap-4">
											<HiPhone className="w-5 h-5" />
											<p className="text-sm text-gray-700">+254 723 345 678</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

const TopCardSkeleton = () => {
	return (
		<div className="w-full flex items-center gap-3">
			<div>
				<Skeleton className="flex rounded-full w-12 h-12" />
			</div>
			<div className="w-full flex flex-col gap-2">
				<Skeleton className="h-3 w-3/5 rounded-lg" />
				<Skeleton className="h-3 w-4/5 rounded-lg" />
			</div>
		</div>
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

export default LoanRequestDetails;
