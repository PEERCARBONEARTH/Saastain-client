"use client";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { AppKey } from "@/types/Global";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Image, Progress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { FC, useCallback } from "react";
import { TbCalendar } from "react-icons/tb";
import { HiPencil } from "react-icons/hi2";
import { ChevronDown, FullscreenIcon, MailIcon, PencilIcon, PhoneIcon, Trash2Icon } from "lucide-react";
import { IoDocumentText } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import Link from "next/link";

interface IProps {
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

const QuoteDetails: FC<IProps> = ({ id }) => {
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
						<Button as={Link} href="/quotations/update/1" className="bg-green-700 text-white">Update Quotation</Button>
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
								<div>
									<div className="ps-2 my-2 first:mt-0">
										<h3 className="text-xs font-medium uppercase text-gray-500">1 Aug, 2023</h3>
									</div>
									<div className="flex gap-x-3">
										<div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
											<div className="relative z-10 size-7 flex justify-center items-center">
												<img
													className="shrink-0 size-7 rounded-full"
													src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
													alt="Avatar"
												/>
											</div>
										</div>

										<div className="grow pt-0.5 pb-8">
											<h3 className="flex gap-x-1.5 font-semibold text-gray-800">
												<svg
													className="shrink-0 size-4 mt-1"
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round">
													<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
													<polyline points="14 2 14 8 20 8"></polyline>
													<line x1="16" x2="8" y1="13" y2="13"></line>
													<line x1="16" x2="8" y1="17" y2="17"></line>
													<line x1="10" x2="8" y1="9" y2="9"></line>
												</svg>
												Created "Preline in React" task
											</h3>
											<p className="mt-1 text-sm text-gray-600">Find more detailed insctructions here.</p>
											<button
												type="button"
												className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
												<img
													className="shrink-0 size-4 rounded-full"
													src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
													alt="Avatar"
												/>
												James Collins
											</button>
										</div>
									</div>

									<div className="flex gap-x-3">
										<div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
											<div className="relative z-10 size-7 flex justify-center items-center">
												<span className="flex shrink-0 justify-center items-center size-7 border border-gray-200 text-sm font-semibold uppercase text-gray-800 rounded-full">A</span>
											</div>
										</div>

										<div className="grow pt-0.5 pb-8">
											<h3 className="flex gap-x-1.5 font-semibold text-gray-800">Release v5.2.0 quick bug fix 🐞</h3>
											<button
												type="button"
												className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
												<span className="flex shrink-0 justify-center items-center size-4 bg-white border border-gray-200 text-[10px] font-semibold uppercase text-gray-600 rounded-full">A</span>
												Alex Gregarov
											</button>
										</div>
									</div>

									<div className="flex gap-x-3">
										<div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
											<div className="relative z-10 size-7 flex justify-center items-center">
												<img
													className="shrink-0 size-7 rounded-full"
													src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
													alt="Avatar"
												/>
											</div>
										</div>

										<div className="grow pt-0.5 pb-8">
											<h3 className="flex gap-x-1.5 font-semibold text-gray-800">Marked "Install Charts" completed</h3>
											<p className="mt-1 text-sm text-gray-600">Finally! You can check it out here.</p>
											<button
												type="button"
												className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
												<img
													className="shrink-0 size-4 rounded-full"
													src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
													alt="Avatar"
												/>
												James Collins
											</button>
										</div>
									</div>

									<div className="ps-2 my-2 first:mt-0">
										<h3 className="text-xs font-medium uppercase text-gray-500">31 Jul, 2023</h3>
									</div>

									<div className="flex gap-x-3">
										<div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
											<div className="relative z-10 size-7 flex justify-center items-center">
												<span className="flex shrink-0 justify-center items-center size-7 bg-white border border-gray-200 text-[10px] font-semibold uppercase text-gray-600 rounded-full">
													<svg
														className="shrink-0 size-4 mt-1"
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round">
														<path d="M16 3h5v5"></path>
														<path d="M8 3H3v5"></path>
														<path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"></path>
														<path d="m15 9 6-6"></path>
													</svg>
												</span>
											</div>
										</div>

										<div className="grow pt-0.5 pb-8">
											<h3 className="flex gap-x-1.5 font-semibold text-gray-800">Take a break ⛳️</h3>
											<p className="mt-1 text-sm text-gray-600">Just chill for now... 😉</p>
										</div>
									</div>
								</div>
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

export default QuoteDetails;
