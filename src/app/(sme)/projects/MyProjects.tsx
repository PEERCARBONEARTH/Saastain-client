"use client";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { AppKey } from "@/types/Global";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input } from "@nextui-org/react";
import { ChevronRight, LayoutGridIcon, MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { HiOutlineRefresh, HiDotsVertical, HiDocumentText } from "react-icons/hi";

const headerColumns: IAppTableColumn[] = [
	{
		name: "Order ID",
		uid: "orderId",
	},
	{
		name: "Product",
		uid: "productName",
	},
	{
		name: "Category",
		uid: "category",
	},
	{
		name: "Delivery Date",
		uid: "deliveryDate",
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

interface IOrder {
	id: string;
	orderId: string;
	productName: string;
	deliveryDate: string;
	status: string;
	category: string;
}

const orders: IOrder[] = [
	{
		id: "1",
		orderId: "ORD001",
		productName: "Product A",
		deliveryDate: "2024-07-01",
		status: "Pending",
		category: "Category 1",
	},
	{
		id: "2",
		orderId: "ORD002",
		productName: "Product B",
		deliveryDate: "2024-07-02",
		status: "Completed",
		category: "Category 2",
	},
	{
		id: "3",
		orderId: "ORD003",
		productName: "Product C",
		deliveryDate: "2024-07-03",
		status: "In Progress",
		category: "Category 3",
	},
	{
		id: "4",
		orderId: "ORD004",
		productName: "Product D",
		deliveryDate: "2024-07-04",
		status: "Pending",
		category: "Category 4",
	},
	{
		id: "5",
		orderId: "ORD005",
		productName: "Product E",
		deliveryDate: "2024-07-05",
		status: "Completed",
		category: "Category 5",
	},
];

type IViewType = "grid" | "table";

const MyProjects = () => {
	const [currentView, setCurrentView] = useState<IViewType>("grid");
	const renderCell = useCallback((item: IOrder, columnKey: AppKey) => {
		switch (columnKey) {
			case "orderId":
				return <span>{item.orderId}</span>;
			case "productName":
				return <span>{item.productName}</span>;
			case "deliveryDate":
				return <span>{item.deliveryDate}</span>;
			case "status":
				return (
					<Chip size="sm" color="primary" variant="flat">
						{item.status}
					</Chip>
				);
			case "category":
				return (
					<Chip size="sm" color="warning" variant="flat">
						{item.category}
					</Chip>
				);
			case "actions":
				return (
					<>
						<Button as={Link} href="/projects/details/1" color="primary" size="sm" endContent={<ChevronRight className="w-4 h-4" />}>
							View
						</Button>
					</>
				);
			default:
				return null;
		}
	}, []);

	const onClickView = (toView: IViewType) => {
		setCurrentView((prevView) => (prevView === toView ? prevView : toView));
	};

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem>My Projects</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-4 space-y-2">
				<h1 className="text-green-800 font-bold text-2xl">My Projects</h1>
				<p className="text-sm">List of all current and past projects. You can view detailed information about each project, including the vendor name, order date, status, and total amount.</p>
			</div>
			<div className="w-full h-[1px] bg-gray-500 my-4"></div>
			<div className="flex items-center justify-between">
				<div className="w-1/2 flex items-center gap-4">
					<Input
						classNames={{
							base: "h-12 w-full",
							mainWrapper: "h-full",
							input: "text-small",
							inputWrapper: "h-full font-normal text-default-500 bg-gray-50",
						}}
						placeholder="Search for project ..."
						endContent={<SearchIcon size={18} />}
						type="search"
						variant="bordered"
					/>
					<Button isIconOnly size="lg" className="bg-saastain-brown">
						<HiOutlineRefresh className="text-white w-5 h-5" />
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Button isIconOnly size="sm" color="primary" variant={currentView === "grid" ? "solid" : "bordered"} onPress={() => onClickView("grid")}>
						<LayoutGridIcon className="w-5 h-5" />
					</Button>
					<Button isIconOnly size="sm" color="primary" variant={currentView === "table" ? "solid" : "bordered"} onPress={() => onClickView("table")}>
						<MenuIcon className="w-5 h-5" />
					</Button>
				</div>
			</div>
			{currentView === "grid" && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
					{[...Array.from({ length: 10 })].map((_, idx) => (
						<QuoteItem key={idx} />
					))}
				</div>
			)}
			{currentView === "table" && (
				<div className="mt-5">
					<AppTable<IOrder> count={orders.length} data={orders} isLoading={false} renderCell={renderCell} title="Orders" showTopContent={false} headerColumns={headerColumns} />
				</div>
			)}
		</>
	);
};

const QuoteItem = () => {
	const router = useRouter();
	return (
		<Card shadow="none" className="bg-none border">
			<CardHeader>
				<div className="flex items-center justify-end w-full">
					<Dropdown>
						<DropdownTrigger>
							<Button isIconOnly variant="light">
								<HiDotsVertical />
							</Button>
						</DropdownTrigger>
						<DropdownMenu className="saastain font-nunito" aria-label="Quote Actions">
							<DropdownItem onPress={() => router.push("/projects/details/1")} key="view">
								View Quote
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</CardHeader>
			<CardBody>
				<div className="w-full flex items-center justify-between py-2 pb-4 border-b">
					<Image width={65} src="/images/quotes/img1.png" />
					<div className="">
						<p className="text-xs font-medium">23/07/2024, 2:58 PM</p>
						<h2 className="text-bold text-saastain-green">MEKO-SM_242424</h2>
					</div>
					<Chip size="sm" className="bg-yellow-100 text-yellow-800">
						Pending
					</Chip>
				</div>
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
						<h3 className="text-gray-500 text-sm font-semibold">Total Area</h3>
						<h3 className="text-gray-800 text-sm font-semibold">---</h3>
					</div>
				</div>
			</CardBody>
			<CardFooter>
				<div className="w-full flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-green-100 p-2 rounded-lg">
							<HiDocumentText className="w-6 h-6 text-saastain-green" />
						</div>
						<p className="text-gray-500 text-sm">Price Range</p>
					</div>
					<p className="text-gray-800 text-sm">Ksh 4-8 M</p>
				</div>
			</CardFooter>
		</Card>
	);
};

export default MyProjects;
