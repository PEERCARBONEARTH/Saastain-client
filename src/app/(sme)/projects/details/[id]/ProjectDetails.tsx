"use client";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { AppKey } from "@/types/Global";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Image, Progress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton } from "@nextui-org/react";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { TbCalendar } from "react-icons/tb";
import { HiPencil } from "react-icons/hi2";
import { CalendarClock, CheckIcon, ChevronDown, FileTextIcon, FullscreenIcon, MailIcon, MinusIcon, PencilIcon, PhoneIcon, Trash2Icon } from "lucide-react";
import { IoDocumentText } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import { IOrder, OrderStage, OrderStatus } from "@/types/Order";
import { IOrderTimeline } from "@/types/OrderTimeline";
import { format } from "date-fns";
import { fromDate } from "@internationalized/date";
import { formatCurrency } from "@/utils";
import AcceptQuotationModal from "./AcceptQuotationModal";
import RejectQuotationModal from "./RejectQuotationModal";
import { IQuoteDetails } from "@/types/QuoteDetails";
import Link from "next/link";

interface IProps {
	id: string;
}

interface IVariantsInfoItem {
	variant: string;
	code: string;
	unitPrice: number;
	status?: string;
	quantity: number;
	id: string;
}

const itemsColumns: IAppTableColumn[] = [
	{
		name: "Item",
		uid: "name",
	},
	{
		name: "Quantity",
		uid: "quantity",
	},
	{
		name: "Unit Price (Ksh)",
		uid: "price",
	},
	{
		name: "Status",
		uid: "status",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

interface ITimelineItemProps {
	title: string;
	description: string;
	completed?: boolean;
	timelineDate?: string;
	stepIcon?: ReactNode;
	children?: ReactNode;
}

const ProjectDetails: FC<IProps> = ({ id }) => {
	const { data: orderDetails, isLoading, mutate: mutateOrderDetails } = useSWR<IOrder>(!id ? null : [`${IApiEndpoint.GET_ORDER_DETAILS}/${id}`], swrFetcher, { keepPreviousData: true });
	const { data: orderTimelines, mutate: mutateTimelines } = useSWR<IOrderTimeline[]>(!id ? null : [`${IApiEndpoint.GET_ORDER_TIMELINES}/${id}`], swrFetcher, { keepPreviousData: true });
	const { data: orderQuoteItem, mutate: mutateOrderQuote } = useSWR<IQuoteDetails>(!id ? null : [`${IApiEndpoint.GET_QUOTATION_ITEM_BY_ORDER}/${id}`], swrFetcher, { keepPreviousData: true });

	const rfqOrderTimelines = useMemo(() => {
		if (orderTimelines && orderTimelines?.length > 0) {
			return orderTimelines?.filter((timeline) => timeline?.code === OrderStage.RFQ);
		}

		return [];
	}, [orderTimelines]);

	const computedActualCost = useMemo(() => {
		if (orderQuoteItem) {
			return orderQuoteItem?.variantsInfo?.reduce((total, item) => {
				return total + (item.unitPrice ?? 0) * (item?.quantity ?? 0);
			}, 0);
		}
		return 0;
	}, [orderQuoteItem]);

	const variants = useMemo(() => {
		if (orderQuoteItem) {
			return orderQuoteItem?.variantsInfo?.map((item) => {
				return {
					...item,
					id: item.code,
				};
			});
		}

		return [];
	}, [orderQuoteItem]);

	const renderCell = useCallback((item: IVariantsInfoItem, columnKey: AppKey) => {
		switch (columnKey) {
			case "name":
				return (
					<div className="flex items-center gap-2">
						<Image width={50} src={`${orderDetails?.product?.images?.[0]?.url}`} />
						<div className="space-y-2">
							{/* <p className="font-medium">{item.name}</p> */}
							<Chip size="sm" className="rounded-lg bg-indigo-100">
								{item.variant}
							</Chip>
						</div>
					</div>
				);
			case "quantity":
				return <p className="font-medium text-gray-900">{item.quantity}</p>;
			case "price":
				return <p className="font-medium text-gray-900">{item.unitPrice ?? "----"}</p>;
			case "status":
				return (
					<Chip size="sm" className="bg-green-100">
						{item.status === "ready" && "Ready"}
						{item.status === "in-progress" && "In Progress"}
						{item.status === "packaging" && "Packaging"}
						{item.status === "pending" && "Pending"}
					</Chip>
				);
			case "actions":
				return (
					<Button size="sm" startContent={<HiPencil className="w-4 h-4" />} className="bg-[#E1EFFE]">
						Update
					</Button>
				);

			default:
				return null;
		}
	}, []);

	const showActionBtn = orderQuoteItem && orderDetails?.status !== OrderStatus.APPROVED_BY_SME && orderDetails?.status !== OrderStatus.REJECTED_BY_SME;
	const showBtn = showActionBtn && orderQuoteItem && !orderQuoteItem.isApproved;

	const actionMutations = () => {
		mutateOrderDetails();
		mutateOrderQuote();
		mutateTimelines();
	};

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem href={AppEnumRoutes.APP_MY_PROJECTS}>My Projects</BreadcrumbItem>
				<BreadcrumbItem>{isLoading ? "Loading" : `#${orderDetails?.orderCode}`}</BreadcrumbItem>
			</Breadcrumbs>
			{isLoading && <TopCardSkeleton />}
			{orderDetails && (
				<div className="mt-4 space-y-2">
					<h1 className="text-green-800 font-bold text-2xl">#{orderDetails?.orderCode}</h1>
					<p className="text-sm">
						<div dangerouslySetInnerHTML={{ __html: orderDetails?.product?.description }}></div>
					</p>
				</div>
			)}
			{isLoading && (
				<div className="grid grid-cols-1 md:grid-cols-12 gap-2 px-3 w-full mt-5">
					<div className="col-auto md:col-span-8">
						<ProductSkeleton />
					</div>
					<div className="col-auto md:col-span-4">
						<ProductSkeleton />
					</div>
				</div>
			)}
			{orderDetails && (
				<>
					<div className="w-full h-[1px] bg-gray-500 my-4"></div>
					<div className="px-3 py-3 border rounded-xl mb-2">
						<div className="py-1">
							<h1 className="text-lg font-bold text-gray-900">Progress</h1>
						</div>
						<div className="">
							<div className="w-full flex items-center justify-between gap-5">
								<div className="w-full space-y-3">
									<Progress
										classNames={{
											indicator: "bg-green-600",
											track: "bg-gray-200",
										}}
										aria-label="new-order"
										value={100}
									/>
									<p className="text-gray-800 text-sm">New Project</p>
								</div>
								<div className="w-full space-y-3">
									<Progress
										value={orderQuoteItem ? 100 : 50}
										classNames={{
											indicator: orderQuoteItem ? "bg-green-600" : "bg-yellow-300",
											track: "bg-gray-200",
										}}
										aria-label="rfq"
									/>
									<p className="text-gray-800 text-sm">Request for Quotation</p>
								</div>
								<div className="w-full space-y-3">
									<Progress
										classNames={{
											indicator: "bg-green-600",
											track: "bg-gray-200",
										}}
										aria-label="manufacturing"
										value={0}
									/>
									<p className="text-gray-800 text-sm">Manufacturing</p>
								</div>
								<div className="w-full space-y-3">
									<Progress
										classNames={{
											indicator: "bg-green-600",
											track: "bg-gray-200",
										}}
										aria-label="installation"
										value={0}
									/>
									<p className="text-gray-800 text-sm">Installation</p>
								</div>
								<div className="w-full space-y-3">
									<Progress
										classNames={{
											indicator: "bg-green-600",
											track: "bg-gray-200",
										}}
										aria-label="maintenance"
										value={0}
									/>
									<p className="text-gray-800 text-sm">Maintenance</p>
								</div>
							</div>
							<div className="w-full py-5">
								<Divider />
							</div>
						</div>
						<div className="">
							<div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
								<Chip className="rounded-lg bg-gray-100" startContent={<TbCalendar className="w-5 h-5" />}>
									Estimated installation date: ----
								</Chip>
								<div className="flex items-center gap-2 flex-wrap mt-3 md:mt-0">
									{showBtn && <AcceptQuotationModal orderDetails={orderDetails} quoteDetails={orderQuoteItem} mutate={actionMutations} />}
									{showBtn && <Button color="warning">Request Update of Quotation</Button>}
									{showBtn && <RejectQuotationModal orderDetails={orderDetails} quoteDetails={orderQuoteItem} mutate={actionMutations} />}
									{orderQuoteItem && orderQuoteItem?.isApproved && (
										<Button color="primary" as={Link} href={`${AppEnumRoutes.APP_LOAN_REQUESTS_APPLY}`}>
											Apply for Funding
										</Button>
									)}
									<div className="py-3 px-4 border border-dashed border-gray-400 rounded-xl">
										<p className="text-sm text-center">{orderDetails?.orderStage === OrderStage.RFQ && !orderQuoteItem && "Order Pending Review By Vendor"}</p>
										{orderQuoteItem && !orderQuoteItem?.isApproved && <p className="text-sm text-center">Quotation Now Ready</p>}
										{orderQuoteItem && orderQuoteItem?.isApproved && <p className="text-sm text-center">Order now ready for Funding</p>}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-5">
						<div className="col-auto md:col-span-8">
							<AppTable<IVariantsInfoItem>
								headerColumns={itemsColumns}
								data={orderQuoteItem ? variants : []}
								count={variants?.length ?? 0}
								isLoading={false}
								renderCell={renderCell}
								title="Products"
								showBottomContent={false}
								showTopContent={false}
								emptyContent="No Quotation Added Yet"
							/>
							<div className="mt-6">
								<Card shadow="none" className="bg-transparent border">
									<CardHeader>
										<h1 className="font-bold">Timeline</h1>
									</CardHeader>
									<CardBody>
										{rfqOrderTimelines?.length > 0 && (
											<TimelineItem
												title={rfqOrderTimelines?.[0]?.title}
												description={rfqOrderTimelines?.[0]?.description}
												timelineDate={format(new Date(rfqOrderTimelines?.[0]?.createdAt), "MMM dd, yyyy hh:mm bbb")}
												completed>
												<div className="pl-6 pt-6">
													{rfqOrderTimelines?.slice(1).map((item) => (
														<TimelineItem
															title={item?.title}
															description={item?.description}
															// timelineDate={format(new Date(item?.createdAt), "MMM dd, yyyy hh:mm bbb")}
															timelineDate={format(fromDate(new Date(item.createdAt), "Africa/Nairobi").toDate(), "MMM dd, yyyy hh:mm bbb")}
															stepIcon={<CalendarClock className="shrink-0 size-4 mt-1" />}
															completed
															key={item?.id}
														/>
													))}
												</div>
											</TimelineItem>
										)}
										{/* <TimelineItem
											title="Order has been  placed"
											description="SME,Vendor  will be called by peer carbon . Btn-(Peer Carbon)-Add Visit Details (time,date,location,pc  representive)"
											timelineDate="July 26,2024 10:34 PM"
											stepIcon={<ClipboardPenLine className="shrink-0 size-4 mt-1" />}
											completed={false}
										/> */}
									</CardBody>
								</Card>
							</div>
						</div>
						<div className="col-auto md:col-span-4">
							<Card shadow="none" className="bg-transparent border">
								<CardHeader>
									<div className="w-full flex items-center justify-between">
										<h1 className="text-green-700 font-bold">Order Summary</h1>
										<Button size="sm" color="primary" variant="light" isIconOnly>
											<ChevronDown />
										</Button>
									</div>
								</CardHeader>
								<CardBody>
									<div className="pt-2 space-y-4 pb-4 border-b">
										<div className="w-full flex items-center justify-between">
											<h3 className="text-gray-500 text-sm font-semibold">Product Name</h3>
											<h3 className="text-gray-800 text-sm font-semibold">{orderDetails?.product?.name}</h3>
										</div>
										{orderQuoteItem && (
											<>
												<div className="w-full flex items-center justify-between">
													<h3 className="text-gray-500 text-sm font-semibold">No of Order</h3>
													<h3 className="text-gray-800 text-sm font-semibold">{orderQuoteItem?.variantsInfo?.length ?? 0}</h3>
												</div>
												<div className="w-full flex items-center justify-between">
													<h3 className="text-gray-500 text-sm font-semibold">Actual Cost</h3>
													<h3 className="text-gray-800 text-sm font-semibold">{formatCurrency(computedActualCost)}</h3>
												</div>
												<div className="w-full flex items-center justify-between">
													<h3 className="text-gray-500 text-sm font-semibold">Maintenance Cost</h3>
													<h3 className="text-gray-800 text-sm font-semibold">{formatCurrency(orderQuoteItem?.maintenanceCost)}</h3>
												</div>
												<div className="w-full flex items-center justify-between">
													<h3 className="text-gray-500 text-sm font-semibold">Installation Cost</h3>
													<h3 className="text-gray-800 text-sm font-semibold">{formatCurrency(orderQuoteItem?.installationCost)}</h3>
												</div>
												<div className="w-full flex items-center justify-between">
													<h3 className="text-gray-500 text-sm font-semibold">Total Cost</h3>
													<h3 className="text-gray-800 text-sm font-semibold">{formatCurrency(orderQuoteItem?.totalCost)}</h3>
												</div>
												<div className="w-full flex items-center justify-between">
													<h3 className="text-gray-500 text-sm font-semibold">Total Area</h3>
													<h3 className="text-gray-800 text-sm font-semibold">{orderQuoteItem?.totalArea}</h3>
												</div>
											</>
										)}
										{!orderQuoteItem && (
											<div className="px-2 py-3 border border-dashed border-gray-400 rounded-xl">
												<p className="text-center text-sm">No Quotation Added Yet</p>
											</div>
										)}
									</div>
								</CardBody>
							</Card>
							<div className="mt-6">
								<Card shadow="none" className="bg-transparent border">
									<CardHeader>
										<div className="w-full flex items-center justify-between">
											<h1 className="text-gray-700 font-semibold">Documents</h1>
											{/* <Button color="primary" variant="bordered">
												Upload
											</Button> */}
										</div>
									</CardHeader>
									<CardBody>
										<div className="w-full space-y-2">
											{orderQuoteItem && orderQuoteItem?.documents && orderQuoteItem?.documents?.length > 0 ? (
												<>
													{orderQuoteItem?.documents?.map((doc) => (
														<DocumentItem {...doc} key={doc.id} />
													))}
												</>
											) : (
												<p className="text-center text-sm">Not Documents Uploaded Yet</p>
											)}
										</div>
										<div className="w-full py-5">
											<Divider />
										</div>
									</CardBody>
									<CardFooter>
										<div className="w-full flex items-center justify-end">
											<Button isDisabled={!orderQuoteItem} color="primary" variant="bordered">
												Download Invoice
											</Button>
										</div>
									</CardFooter>
								</Card>
							</div>
							<div className="mt-6">
								<Card shadow="none" className="bg-transparent border">
									<CardHeader>
										<div className="w-full flex items-center justify-between">
											<h1 className="text-green-700 font-bold">Customer</h1>
											<Button size="sm" color="primary" variant="light" isIconOnly>
												<ChevronDown />
											</Button>
										</div>
									</CardHeader>
									<CardBody>
										<div className="w-full space-y-5 pb-5 border-b border-b-gray-400">
											<div className="flex items-center gap-2">
												<MailIcon className="w-5 h-5" />
												<p className="text-sm">{orderDetails?.company?.companyName}</p>
											</div>
											<div className="flex items-center gap-2">
												<MailIcon className="w-5 h-5" />
												<p className="text-sm">{orderDetails?.company?.primaryEmail}</p>
											</div>
											<div className="flex items-center gap-2">
												<PhoneIcon className="w-5 h-5" />
												<p className="text-sm">{orderDetails?.company?.phoneNo ?? "----"}</p>
											</div>
										</div>
										<div className="pt-4 pb-5 border-b border-b-gray-400">
											<div className="w-full flex items-center justify-between">
												<h1 className="text-green-700 font-bold">Shipping Address</h1>
												<Button size="sm" color="primary" variant="light" isIconOnly>
													<PencilIcon className="w-5 h-5" />
												</Button>
											</div>
											<div className="mt-2 space-y-3">
												<p className="text-sm text-gray-700">{orderDetails?.company?.location ?? "----"}</p>
												<p className="text-sm text-gray-700"> Kenya</p>
												<p className="text-sm text-gray-700"> Location Co-ordinates</p>
												<p className="text-sm text-gray-700">{orderDetails?.initiatedBy?.name}</p>
											</div>
										</div>
										<div className="pt-4">
											<div className="w-full flex items-center justify-between">
												<h1 className="text-green-700 font-bold">Billing Address</h1>
												<Button size="sm" color="primary" variant="light" isIconOnly>
													<PencilIcon className="w-5 h-5" />
												</Button>
											</div>
											<div className="mt-2 space-y-3">
												<div className="px-2 py-5 border rounded-xl border-dashed">
													<p className="text-center text-sm">Products to be billed to Peercarbon</p>
												</div>
											</div>
										</div>
									</CardBody>
								</Card>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

const DocumentItem = ({ id, name, url }: { id: string; name: string; url: string }) => {
	const openDocument = useCallback(() => {
		window.open(url, "_blank");
	}, []);
	return (
		<div className="w-full flex items-center justify-between">
			<div className="flex items-center gap-2">
				<IoDocumentText className="w-5 h-5" />
				<p className="text-sm font-semibold">{name}</p>
			</div>
			<Dropdown>
				<DropdownTrigger>
					<Button size="sm" color="primary" variant="light" isIconOnly>
						<HiDotsHorizontal className="w-5 h-5" />
					</Button>
				</DropdownTrigger>
				<DropdownMenu className="saastain font-nunito" aria-label="Quote Actions">
					<DropdownItem onPress={openDocument} startContent={<FullscreenIcon className="w-5 h-5" />} key="view">
						View Document
					</DropdownItem>
					<DropdownItem startContent={<PencilIcon className="w-5 h-5" />} key="edit">
						Edit Document
					</DropdownItem>
					<DropdownItem startContent={<Trash2Icon className="w-5 h-5" />} className="text-danger" key="remove">
						Remove Document
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	);
};

const TimelineItem = ({ title, description, completed = false, timelineDate, stepIcon, children }: ITimelineItemProps) => {
	return (
		<>
			<div className="flex gap-x-3">
				<div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
					<div className="relative z-10 size-7 flex justify-center items-center">
						<div className={cn("flex shrink-0 justify-center items-center size-7 rounded-full", completed ? "bg-primary" : "border border-gray-200")}>
							{completed ? <CheckIcon className="w-4 h-4 text-white" /> : <MinusIcon className="w-4 h-4" />}
						</div>
					</div>
				</div>
				<div className="grow pt-0.5 pb-8">
					<div className="flex items-center justify-between">
						<h3 className="flex gap-x-1.5 font-semibold text-gray-800">
							{stepIcon ? stepIcon : <FileTextIcon className="shrink-0 size-4 mt-1" />}
							{title}
						</h3>
						{timelineDate && <p className="text-xs font-semibold">{timelineDate}</p>}
					</div>
					<p className="mt-1 text-sm text-gray-600">{description} </p>
					{children}
				</div>
			</div>
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

export default ProjectDetails;
