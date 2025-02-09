"use client";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IGreenLoanApplication, SLAType } from "@/types/GreenLoanApplication";
import { ISDG } from "@/types/SDG";
import { formatCurrency, getInitials } from "@/utils";
import { Avatar, BreadcrumbItem, Breadcrumbs, Button, Card, Skeleton, Image, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { FC, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { HiDocumentText, HiDotsVertical, HiUser, HiMail, HiPhone } from "react-icons/hi";
import GenerateSLADocumentTokenForVendorAndSME from "./GenerateSLADocumentTokenForVendorAndSME";
import { useApi } from "@/hooks/useApi";

const StrokedGaugeEmissions = dynamic(() => import("@/components/charts/StrokedGaugeChart"), { ssr: false });

const splitCategoriesByComma = (cat: string) => cat.split(", ").filter(Boolean);

interface IProps {
	id: string;
}

const OngoingProjectDetails: FC<IProps> = ({ id }) => {
	const { data: approvedLoanDetails, isLoading } = useSWR<IGreenLoanApplication>(!id ? null : [`${IApiEndpoint.GET_LOAN_PROJECT_DETAILS}/${id}`], swrFetcher, { keepPreviousData: true });

	const { data: SDGs } = useSWR<ISDG[]>([IApiEndpoint.GET_SDG_ITEMS], swrFetcher, { keepPreviousData: true });

	const computeSDGURL = (id: string) => {
		if (SDGs && SDGs.length > 0) {
			const item = SDGs.find((item) => item.id === id);

			return item;
		}

		return null;
	};

	const vendorSMESLA = useMemo(() => {
		if (!approvedLoanDetails?.slaDocuments) return null;

		const infoSLA = approvedLoanDetails.slaDocuments.flat().find((item) => item.type === SLAType.VENDOR_SME);

		return infoSLA;
	}, [approvedLoanDetails]);

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem>{isLoading ? "Loading" : approvedLoanDetails ? `${approvedLoanDetails?.company?.companyName}'s Project` : "Loading"}</BreadcrumbItem>
			</Breadcrumbs>
			{isLoading && <TopCardSkeleton />}
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
			{approvedLoanDetails && (
				<div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10">
					<div className="col-auto md:col-span-9">
						<div className="flex items-start gap-6">
							<div className="">
								<Avatar showFallback getInitials={getInitials} name={approvedLoanDetails?.company?.companyName} radius="lg" className="w-28 h-28 text-5xl bg-gray-900 text-white" />
							</div>
							<div className="space-y-2">
								<h1 className="text-saastain-green font-bold text-2xl">Company Profile</h1>
								<p className="text-[#374151ß] text-sm">{approvedLoanDetails?.company?.description}</p>
							</div>
						</div>
						{approvedLoanDetails?.climateRiskData && (
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
							<div className="flex items-center justify-between">
								<h1 className="text-saastain-green font-bold text-2xl">Sustainability Perfomance Targets</h1>
							</div>
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
									{approvedLoanDetails?.order?.product?.sdg?.map((item) => (
										<Image src={computeSDGURL(item.id)?.imageUrl} fallbackSrc={"/images/project/SDG-3.png"} width={80} key={item.id} />
									))}
								</div>
							</div>
						</div>
						<div className="mt-10">
							<div className="flex items-center justify-between">
								<h1 className="text-saastain-green font-bold text-2xl">Service Level Agreements (SLA)</h1>
							</div>
							<div className="border border-gray-300 rounded-lg mt-3">
								<div className="px-2 py-2.5 grid grid-cols-2 border-b border-gray-300 bg-[#F9FAFB] rounded-t-lg">
									<h1 className="uppercase">Document</h1>
									<h1 className="uppercase">Actions</h1>
								</div>
								<div className="px-2 py-3 grid grid-cols-2 border-b border-gray-300 last:border-none">
									<h1 className="text-sm">
										{approvedLoanDetails?.order?.vendor?.companyName} and {approvedLoanDetails?.company?.companyName} SLA
									</h1>
									<div className="flex items-center gap-2">
										{!vendorSMESLA && <GenerateSLADocumentTokenForVendorAndSME loanDetails={approvedLoanDetails} />}
										{vendorSMESLA && <DownloadSLADocument info={vendorSMESLA} />}
										{/* {vendorSMESLA && (
											<Button as={Link} href={`/${AppEnumRoutes.APP_SLA_DOCUMENTS_EDIT}/${vendorSMESLA.token}`} color="primary" size="sm">
												View
											</Button>
										)} */}
									</div>
								</div>
								<div className="px-2 py-3 grid grid-cols-2 border-b border-gray-300 last:border-none">
									<h1 className="text-sm">{approvedLoanDetails?.order?.vendor?.companyName} and Peercarbon SLA</h1>
									<div className="flex items-center gap-2">
										<Button color="primary" size="sm">
											Add
										</Button>
										<Button color="primary" size="sm">
											View
										</Button>
										<Button color="primary" size="sm">
											Download
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-auto md:col-span-3">
						<div className="mt-5">
							<div className="bg-primary rounded-xl">
								<StrokedGaugeEmissions label="Climate Risk Score" value={approvedLoanDetails?.climateRiskData ? approvedLoanDetails?.climateRiskData?.[0]?.score : 0} />
							</div>
						</div>
						<div className="mt-5">
							<div className="px-3 py-3 rounded-xl border">
								<h1 className="font-bold text-base">Reports</h1>
								{approvedLoanDetails?.climateRiskData && <DocumentItem title="Climate Risk Report" url={approvedLoanDetails?.climateRiskData?.[0]?.documentUrl} />}
								{approvedLoanDetails?.climateRiskData && <DocumentItem title="Emissions Baseline Report" url={approvedLoanDetails?.totalBaselineEmissions?.[0]?.documentUrl} />}
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
									<Dropdown>
										<DropdownTrigger>
											<Button size="sm" color="primary" isIconOnly variant="light">
												<ChevronDown />
											</Button>
										</DropdownTrigger>
										<DropdownMenu className="saastain font-nunito" aria-label="Docs Actions">
											<DropdownItem key="view">View Order</DropdownItem>
											<DropdownItem key="download">Download</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</div>
								<div className="mt-4 space-y-3">
									<div className="flex items-center justify-between">
										<p className="text-sm text-gray-500">Product Name</p>
										<p className="text-xs text-gray-800 truncate font-semibold">{approvedLoanDetails?.order?.product?.name}</p>
									</div>
									<div className="flex items-center justify-between">
										<p className="text-sm text-gray-500">Loan Type</p>
										<p className="text-xs text-gray-800 truncate font-semibold">Green Loan</p>
									</div>
									<div className="flex items-center justify-between">
										<p className="text-sm text-gray-500">Project Amount</p>
										<p className="text-xs text-gray-800 truncate font-semibold">{formatCurrency(approvedLoanDetails?.order?.quoteDetails?.[0]?.totalCost)} </p>
									</div>
									<div className="flex items-center justify-between">
										<p className="text-sm text-gray-500">Industry</p>
										<div className="flex items-center gap-1 flex-wrap">
											{splitCategoriesByComma(approvedLoanDetails?.order?.product?.categories)?.map((cat) => (
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
			)}
		</>
	);
};

const DownloadSLADocument = ({
	info,
}: {
	info: { type: SLAType; documentName: string; token?: string; tokenType?: "test" | "prod"; initialEmailAccess?: string; external_template_id?: string; template_id?: number };
}) => {
	const [templateInfo, setTemplateInfo] = useState<Record<string, any>[]>([]);

	const { get } = useApi();

	useEffect(() => {
		async function getData() {
			try {
				const resp = await get<IApiResponse<Record<string, any>[]>>({ endpoint: IApiEndpoint.GET_DOCUMENT_TEMPLATE_INFO, queryParams: { template_external_id: info.external_template_id } });

				const rawResp = resp.data;

				if (rawResp?.status === "success") {
					setTemplateInfo(rawResp.data);
				}
			} catch (err) {}
		}

		if (info) {
			getData();
		}
	}, [get]);

	const onClickView = async () => {
		if (templateInfo?.[0]?.documents) {
			let documents = templateInfo?.[0]?.documents as Array<Record<string, any>>;

			documents.forEach((doc) => {
				window.open(doc.url, "_blank");
			});
		}
	};
	return (
		<Button color="primary" size="sm" onPress={onClickView}>
			View
		</Button>
	);
};

const DocumentItem = ({ title, url }: { title: string; url: string }) => {
	const onClickView = () => {
		window.open(url, "_blank");
	};

	function downloadFile(blob: Blob) {
		const url = window.URL.createObjectURL(blob);

		const link = document.createElement("a");

		link.href = url;

		link.setAttribute("download", title);

		document.body.appendChild(link);

		link.click();

		setTimeout(() => window.URL.revokeObjectURL(url), 3000);
	}

	const onClickDownload = () => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = "blob";
		xhr.onload = function (event) {
			if (this.status === 200) {
				const blob = xhr.response;
				// Process the blob here
				downloadFile(blob);
			} else {
				console.error("Failed to load:", this.statusText);
			}
		};

		xhr.onerror = function (error) {
			console.error("Error:", error);
		};
		xhr.open("GET", url);
		// xhr.setRequestHeader("Accept", "application/octet-stream");
		xhr.send();
	};
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<HiDocumentText />
				<p className="text-sm truncate">{title}</p>
			</div>
			<Dropdown>
				<DropdownTrigger>
					<Button size="sm" isIconOnly variant="light">
						<HiDotsVertical />
					</Button>
				</DropdownTrigger>
				<DropdownMenu className="saastain font-nunito" aria-label="Docs Actions">
					<DropdownItem key="view" onPress={onClickView}>
						View
					</DropdownItem>
					<DropdownItem key="download" onPress={onClickDownload}>
						Download
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
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

export default OngoingProjectDetails;
