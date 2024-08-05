"use client";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { AppKey } from "@/types/Global";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Image, Progress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, cn } from "@nextui-org/react";
import { FC, ReactNode, useCallback } from "react";
import { TbCalendar } from "react-icons/tb";
import { HiPencil } from "react-icons/hi2";
import { CalendarCheck2, CalendarClock, CheckIcon, ChevronDown, ClipboardCheckIcon, ClipboardPenLine, FileTextIcon, FullscreenIcon, MailIcon, MinusIcon, PencilIcon, PhoneIcon, Trash2Icon } from "lucide-react";
import { IoDocumentText } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import ScheduleSiteVisitModal from "./ScheduleSiteVisitModal";
import ConfirmSiteVisitModal from "./ConfirmSiteVisitModal";

interface IProps {
	id: string;
}

interface ITimelineItemProps {
	title: string;
	description: string;
	completed?: boolean;
	timelineDate?: string;
	stepIcon?: ReactNode;
	children?: ReactNode;
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
		name: "Unit Price",
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

interface IProductItem {
	id: string;
	name: string;
	imgUrl: string;
	quantity: string;
	price?: number;
	variant: string;
	status: "ready" | "packaging" | "in-progress";
}

const productItems: IProductItem[] = [
	{
		name: "Product A",
		imgUrl: "/images/quotes/img1.png",
		quantity: "10",
		price: 100,
		variant: "Variant 1",
		status: "ready",
		id: "1",
	},
	{
		name: "Product B",
		imgUrl: "/images/quotes/img1.png",
		quantity: "5",
		price: null,
		variant: "Variant 2",
		status: "packaging",
		id: "2",
	},
	{
		name: "Product C",
		imgUrl: "/images/quotes/img1.png",
		quantity: "20",
		price: 150,
		variant: "Variant 3",
		status: "in-progress",
		id: "3",
	},
];

const OrderDetails: FC<IProps> = ({ id }) => {
	const renderCell = useCallback((item: IProductItem, columnKey: AppKey) => {
		switch (columnKey) {
			case "name":
				return (
					<div className="flex items-center gap-2">
						<Image width={50} src="/images/quotes/img1.png" />
						<div className="space-y-2">
							<p className="font-medium">{item.name}</p>
							<Chip size="sm" className="rounded-lg bg-indigo-100">
								{item.variant}
							</Chip>
						</div>
					</div>
				);
			case "quantity":
				return <p className="font-medium text-gray-900">{item.quantity}</p>;
			case "price":
				return <p className="font-medium text-gray-900">{item.price ?? "----"}</p>;
			case "status":
				return (
					<Chip size="sm" className="bg-green-100">
						{item.status === "ready" && "Ready"}
						{item.status === "in-progress" && "In Progress"}
						{item.status === "packaging" && "Packaging"}
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
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem>#MEKO-SM-12345</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-4 space-y-2">
				<h1 className="text-green-800 font-bold text-2xl">#MEKO-SM-12345</h1>
				<p className="text-sm">
					Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
					sunt explicabo
				</p>
			</div>
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
							<p className="text-gray-800 text-sm">New Order</p>
						</div>
						<div className="w-full space-y-3">
							<Progress
								value={45}
								classNames={{
									indicator: "bg-yellow-300",
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
					<div className="w-full flex items-center justify-between">
						<Chip className="rounded-lg bg-gray-100" startContent={<TbCalendar className="w-5 h-5" />}>
							Estimated installation date: ----
						</Chip>
						<div className="flex items-center gap-2">
							<ScheduleSiteVisitModal />
							<ConfirmSiteVisitModal />
						</div>
					</div>
				</div>
			</div>
			<div className="mt-8 grid grid-cols-12 gap-5">
				<div className="col-span-8">
					<AppTable<IProductItem>
						headerColumns={itemsColumns}
						data={productItems}
						count={productItems.length}
						isLoading={false}
						renderCell={renderCell}
						title="Products"
						showBottomContent={false}
						showTopContent={false}
					/>
					<div className="mt-6">
						<Card shadow="none" className="bg-transparent border">
							<CardHeader>
								<h1 className="font-bold">Timeline</h1>
							</CardHeader>
							<CardBody>
								<TimelineItem title="Request for Quotation" description="SME Name has requested for a quotation  for this product" timelineDate="July 26,2024 10:34 PM" completed>
									<div className="pl-6 pt-6">
										<TimelineItem
											title="Scheduling a visit"
											description="SME,Vendor  will be called by peer carbon . Btn-(Peer Carbon)-Add Visit Details (time,date,location,pc  representive)"
											timelineDate="July 26,2024 10:34 PM"
											stepIcon={<CalendarClock className="shrink-0 size-4 mt-1" />}
											completed
										/>
										<TimelineItem
											title="Visit scheduled(Vendor,SME)"
											description="SME,Vendor  will be called by peer carbon . Btn-(Peer Carbon)-Add Visit Details (time,date,location,pc  representive)"
											timelineDate="July 26,2024 10:34 PM"
											stepIcon={<CalendarCheck2 className="shrink-0 size-4 mt-1" />}
											completed={false}
										/>
										<TimelineItem
											title="Confirm Visit(Peer Carbon)"
											description="SME,Vendor  will be called by peer carbon . Btn-(Peer Carbon)-Add Visit Details (time,date,location,pc  representive)"
											timelineDate="July 26,2024 10:34 PM"
											stepIcon={<ClipboardCheckIcon className="shrink-0 size-4 mt-1" />}
											completed={false}
										/>
										<TimelineItem
											title="Update Quotation"
											description="SME,Vendor  will be called by peer carbon . Btn-(Peer Carbon)-Add Visit Details (time,date,location,pc  representive)"
											timelineDate="July 26,2024 10:34 PM"
											stepIcon={<ClipboardPenLine className="shrink-0 size-4 mt-1" />}
											completed={false}
										/>
									</div>
								</TimelineItem>
								<TimelineItem
									title="Order has been  placed"
									description="SME,Vendor  will be called by peer carbon . Btn-(Peer Carbon)-Add Visit Details (time,date,location,pc  representive)"
									timelineDate="July 26,2024 10:34 PM"
									stepIcon={<ClipboardPenLine className="shrink-0 size-4 mt-1" />}
									completed={false}
								/>
							</CardBody>
						</Card>
					</div>
				</div>
				<div className="col-span-4">
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
									<h3 className="text-gray-800 text-sm font-semibold">Meko Steam Cooking</h3>
								</div>
								<div className="w-full flex items-center justify-between">
									<h3 className="text-gray-500 text-sm font-semibold">No of Order</h3>
									<h3 className="text-gray-800 text-sm font-semibold">4</h3>
								</div>
								<div className="w-full flex items-center justify-between">
									<h3 className="text-gray-500 text-sm font-semibold">Estimated Price</h3>
									<h3 className="text-gray-800 text-sm font-semibold">Ksh 4,000,000</h3>
								</div>
								<div className="w-full flex items-center justify-between">
									<h3 className="text-gray-500 text-sm font-semibold">Actual Price</h3>
									<h3 className="text-gray-800 text-sm font-semibold">Ksh 6,000,000</h3>
								</div>
								<div className="w-full flex items-center justify-between">
									<h3 className="text-gray-500 text-sm font-semibold">Total Area</h3>
									<h3 className="text-gray-800 text-sm font-semibold">---</h3>
								</div>
							</div>
						</CardBody>
					</Card>
					<div className="mt-6">
						<Card shadow="none" className="bg-transparent border">
							<CardHeader>
								<div className="w-full flex items-center justify-between">
									<h1 className="text-gray-700 font-semibold">Documents</h1>
									<Button color="primary" variant="bordered">
										Upload
									</Button>
								</div>
							</CardHeader>
							<CardBody>
								<div className="w-full space-y-2">
									<DocumentItem />
									<DocumentItem />
								</div>
								<div className="w-full py-5">
									<Divider />
								</div>
							</CardBody>
							<CardFooter>
								<div className="w-full flex items-center justify-end">
									<Button color="primary" variant="bordered">
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
										<p className="text-sm">SME Company Name</p>
									</div>
									<div className="flex items-center gap-2">
										<MailIcon className="w-5 h-5" />
										<p className="text-sm">sme@gmail.com</p>
									</div>
									<div className="flex items-center gap-2">
										<PhoneIcon className="w-5 h-5" />
										<p className="text-sm">+254 723 345 678</p>
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
										<p className="text-sm text-gray-700">Jomo Kenyatta International Airport</p>
										<p className="text-sm text-gray-700"> Kenya Nairobi</p>
										<p className="text-sm text-gray-700"> Location Co-ordinates</p>
										<p className="text-sm text-gray-700">+254 7326789</p>
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
	);
};

const DocumentItem = () => {
	return (
		<div className="w-full flex items-center justify-between">
			<div className="flex items-center gap-2">
				<IoDocumentText className="w-5 h-5" />
				<p className="text-sm font-semibold">Document Name.pdf</p>
			</div>
			<Dropdown>
				<DropdownTrigger>
					<Button size="sm" color="primary" variant="light" isIconOnly>
						<HiDotsHorizontal className="w-5 h-5" />
					</Button>
				</DropdownTrigger>
				<DropdownMenu className="saastain font-nunito" aria-label="Quote Actions">
					<DropdownItem startContent={<FullscreenIcon className="w-5 h-5" />} key="view">
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

export default OrderDetails;
