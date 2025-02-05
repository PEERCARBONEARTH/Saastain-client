"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IGreenLoanApplication } from "@/types/GreenLoanApplication";
import { formatCurrency, getInitials } from "@/utils";
import { Breadcrumbs, BreadcrumbItem, Tabs, Tab, Avatar, Chip, Button, Card, Skeleton, CardBody } from "@heroui/react";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const AppLoanRequests = () => {
	const { data, isLoading } = useSWR<IGreenLoanApplication[]>([IApiEndpoint.GET_ALL_LOAN_APPLICATIONS], swrFetcher, { keepPreviousData: true });
	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem>Loan Requests</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-4 space-y-2">
				<h1 className="text-green-800 font-bold text-2xl">Loan Requests</h1>
				<p className="text-sm">
					Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
					sunt explicabo
				</p>
			</div>
			<div className="w-full h-[1px] bg-primary-500 my-4"></div>
			<Tabs aria-label="Loan Requests" color="primary" variant="underlined">
				<Tab key={"all-requests"} title={"All Requests"}>
					<div className="px-1 mt-1 space-y-4">
						{isLoading ? (
							[...Array.from({ length: 4 })].map((_, idx) => <GridSkeleton key={idx} />)
						) : data?.length > 0 ? (
							data?.map((loanReq) => <RequestItem item={loanReq} key={loanReq.id} />)
						) : (
							<Card className="w-full col-span-1 sm:col-span-2 md:col-span-3">
								<CardBody>
									<p className="text-center">No Loan Requests Found Yet</p>
								</CardBody>
							</Card>
						)}
					</div>
				</Tab>
				<Tab key={"accepted-requests"} title={"Accepted Requests"}>
					<div className="px-1 mt-1 space-y-4">
						{[...Array.from({ length: 4 })].map((_, idx) => (
							<DummyRequestItem key={idx} />
						))}
					</div>
				</Tab>
				<Tab key={"declined-requests"} title={"Declined Requests"}>
					<div className="px-1 mt-1 space-y-4">
						{[...Array.from({ length: 4 })].map((_, idx) => (
							<DummyRequestItem key={idx} />
						))}
					</div>
				</Tab>
			</Tabs>
		</AuthRedirectComponent>
	);
};

const RequestItem = ({ item }: { item: IGreenLoanApplication }) => {
	const splitCategoriesByComma = (cat: string) => cat.split(", ").filter(Boolean);
	return (
		<div className="border border-gray-300 rounded">
			<div className="grid grid-cols-1 md:grid-cols-3 w-full">
				<div className="col-auto md:col-span-2">
					<div className="flex items-start gap-6 w-full border-b-small md:border-r-small border-gray-300 pl-4 py-4">
						<div className="">
							<Avatar showFallback getInitials={getInitials} name={item?.companyName} radius="lg" className="w-20 h-20 text-3xl bg-gray-900 text-white" />
						</div>
						<div className="pr-1 space-y-2">
							<Link href={`${AppEnumRoutes.APP_COMPANY_PROFILE}/${item?.company?.id}`}>
								<h1 className="text-saastain-green font-bold text-2xl hover:underline">{item?.company?.companyName}</h1>
							</Link>
							<p className="text-gray-700">{item?.companyLocation}</p>
							<p className="text-[#374151ß] text-sm">{item?.company?.description}</p>
							<div className="flex items-center gap-4">
								{splitCategoriesByComma(item?.order?.product?.categories)?.map((cat) => (
									<Chip size="sm" key={cat} className="bg-green-100 text-green-800 capitalize">
										{cat}
									</Chip>
								))}
								<Chip size="sm" className="bg-[#E1EFFE] text-blue-800">
									{item?.order?.product?.name}
								</Chip>
							</div>
						</div>
					</div>
				</div>
				<div className="col-auto mt-2 md:mt-0 md:col-span-1">
					<div className="px-4 py-4 h-full">
						<div className="h-full flex flex-col items-start justify-between">
							<div className="space-y-4">
								<h3 className="text-[#374151] font-bold">
									Loan Type : <span>Green Loan</span>{" "}
								</h3>
								<h3 className="text-[#374151] font-bold">Amount Requested: {formatCurrency(item?.order?.quoteDetails?.[0]?.totalCost)}</h3>
							</div>
							<div className="flex items-center justify-end gap-x-3 w-full mt-2">
								<Button color="primary" as={Link} href={`${AppEnumRoutes.APP_LOAN_REQUEST_DETAILS}/${item?.id}`}>
									View Request
								</Button>
								<Button color="primary" variant="bordered" endContent={<CheckIcon className="w-4 h-4" />}>
									Approve Loan
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const DummyRequestItem = () => {
	return (
		<div className="border border-gray-300 rounded">
			<div className="grid grid-cols-3 w-full">
				<div className="col-span-2">
					<div className="flex items-start justify-between w-full gap-6 border-r-small border-gray-300 pl-4 py-4">
						<div className="">
							<Avatar showFallback getInitials={getInitials} name="SME Name" radius="lg" className="w-20 h-20 text-3xl bg-gray-900 text-white" />
						</div>
						<div className="pr-1 space-y-2">
							<h1 className="text-saastain-green font-bold text-2xl">SME Name</h1>
							<p className="text-gray-700">Mombasa County</p>
							<p className="text-[#374151ß] text-sm">
								Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae
								vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
							</p>
							<div className="flex items-center gap-4">
								<Chip size="sm" className="bg-green-100 text-green-800">
									Education
								</Chip>
								<Chip size="sm" className="bg-[#E1EFFE] text-blue-800">
									Steam Cooking
								</Chip>
								<Chip size="sm" className="bg-green-100 text-green-800">
									Agriculture
								</Chip>
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-1">
					<div className="px-4 py-4 h-full">
						<div className="h-full flex flex-col items-start justify-between">
							<div className="space-y-4">
								<h3 className="text-[#374151] font-bold">
									Loan Type : <span>Green Loan</span>{" "}
								</h3>
								<h3 className="text-[#374151] font-bold">Amount Requested: Ksh 217,800</h3>
							</div>
							<div className="flex items-center justify-end gap-x-3 w-full">
								<Button color="primary" as={Link} href={`${AppEnumRoutes.APP_LOAN_REQUEST_DETAILS}/1`}>
									View Request
								</Button>
								<Button color="primary" variant="bordered" endContent={<CheckIcon className="w-4 h-4" />}>
									Approve Loan
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const GridSkeleton = () => {
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

export default AppLoanRequests;
