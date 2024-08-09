'use client';

import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { Orders } from "@/data/orders";
import { AppKey } from "@/types/Global";
import { OrderStatus, statusColors, statusTextColor } from "@/types/OrderStatus";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Input } from "@nextui-org/react";
import { useCallback, useState } from "react";
import Image from "next/image";
import { LayoutGrid, Menu, SearchIcon } from "lucide-react"
import { HiOutlineRefresh } from "react-icons/hi";

interface IOrderItem {
	id: string;
	product: string;
	category: string;
	customer: string;
	deliveryDate: string;
	status: OrderStatus
}

type IViewType = "grid" | "tabular";


const OrdersColumns: IAppTableColumn[] = [
	{
		name: "Order Id",
		uid: "id",
	},
	{
		name: "Product",
		uid: "product",
	},
	{
		name: "Category",
		uid: "category",
	},
	{
		name: "Customer",
		uid: "customer",
	},
	{
		name: "Delivery Date",
		uid: "deliveryDate",
	},
	{
		name: "Status",
		uid: "status",
	},
];

const MyOrders = () => {
	const [isGridViewActive, setIsGridViewActive] = useState(false);
	const [currentView, setCurrentView] = useState<IViewType>("grid")

	const toggleView = (toView: IViewType) => {
		if (currentView === toView)
			return
		setCurrentView(toView)
	}
	// Function to toggle grid view
	const toggleGridView = () => {
		setIsGridViewActive(true);
	};

	// Function to toggle tabular view
	const toggleTabularView = () => {
		setIsGridViewActive(false);
	};

	const renderCell = useCallback((item: IOrderItem, columnKey: AppKey) => {
		switch (columnKey) {
			case "id":
				return <p className="text-[#6B7280]">{item.id}</p>;
			case "product":
				return <p className="text-[#014737]">{item.product}</p>;
			case "category":
				return <Chip style={{ backgroundColor: '#EDEBFE', color: '#5521B5' }} >{item.category}</Chip>;
			case "customer":
				return <p>{item.customer}</p>;
			case "deliveryDate":
				return <p>{item.deliveryDate}</p>;
			case "status": {
				const backgroundColor = statusColors[item.status] || "#ccc";
				const textColor = statusTextColor[item.status] || "#ccc"
				return (
					<Chip style={{ backgroundColor, color: textColor }}>
						{item.status}
					</Chip>
				);
			}
			default:
				return null;
		}
	}, []);
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Vendor</BreadcrumbItem>
				<BreadcrumbItem className="text-[#03543F]">My Orders</BreadcrumbItem>
			</Breadcrumbs>
			<div className="space-y-4 mt-8">
				<h1 className="font-bold text-2xl text-[#03543F]">My Orders</h1>
				<div className="w-full md:w-[80%]">
					<p>
						List of all current and past orders. You can view detailed information about each order, including the vendor name, order date, status, and total amount.
					</p>
					<hr className="mt-6 text-[#A7B3A7] border-[1px] w-[1137px]" />
				</div>
			</div>

			<div className="mt-8">
				<div className="flex flex-row justify-between items-center mb-4">
					<div className="w-1/2 flex items-center gap-4">
						<Input
							classNames={{
								base: "h-12 w-full",
								mainWrapper: "h-full",
								input: "text-small",
								inputWrapper: "h-full font-normal text-default-500 bg-gray-50",
							}}
							placeholder="Search ..."
							endContent={<SearchIcon size={18} />}
							type="search"
							variant="bordered"
						/>
						<Button isIconOnly size="lg" className="bg-[#CFA16C]">
							<HiOutlineRefresh className="text-white w-5 h-5" />
						</Button>
					</div>
					<div className="flex items-center gap-2">
						<Button isIconOnly color="primary" onPress={() => { toggleView("grid") }} variant={currentView === "grid" ? "solid" : "bordered"}>
							<LayoutGrid />
						</Button>
						<Button isIconOnly color="primary" onPress={() => { toggleView("tabular") }} variant={currentView === "tabular" ? "solid" : "bordered"}>
							<Menu />
						</Button>
					</div>
				</div>
				{currentView === "tabular" ? (
					<div className="tabular-view-orders">

						<AppTable<IOrderItem> headerColumns={OrdersColumns} data={Orders} count={Orders.length} isLoading={false} renderCell={renderCell} title="Orders" showTopContent={false}>
						</AppTable>
					</div>
				) : (
					<div className="grid-view-orders">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{Orders.map((x) => (
								<Card className="shadow-none  space-x-2 p-4" key={x.id}>
									<div className="flex justify-end mr-4 cursor-pointer">
										<Image src='/images/menuIcon.svg' alt={x.id} width={24} height={24} />
									</div>
									<CardHeader className="p-4 flex flex-row">
										<Image alt={x.id} className="rounded-b-none" height={100} width={100} src={x.image} />
										<div className="flex flex-col ml-4">
											<p className="font-semibold my-auto text-[#6B7280]">{x.deliveryDate}</p>
											<h2 className="text-l font-semibold leading-6 capitalize text-[#5E896E]">{x.id}
												<Chip variant="faded" color="success" className="border-0 bg-green-100 text-primary-900 text-sm ml-2">
													{x.status}
												</Chip>
											</h2>
										</div>
									</CardHeader>
									<hr className="mt-6 text-[#A7B3A7] border-[1px] w-full" />
									<CardBody className="px-4">
										<div className="flex flex-col space-y-3">
											<div className="flex fel-row">
												<p className="text-l text-[#6B7280]">Product Name</p>
												<div className="ml-auto">
													<p className="text-xl text-[#1F2A37]">{x.product}</p>
												</div>
											</div>
											<div className="flex fel-row">
												<p className="text-l text-[#6B7280]">No of Orders</p>
												<div className="ml-auto">
													<p className="text-xl text-[#1F2A37]">4</p>
												</div>
											</div>
											<div className="flex fel-row">
												<p className="text-l text-[#6B7280]">Total Area</p>
												<div className="ml-auto">
													<p className="text-xl text-[#1F2A37]">---</p>
												</div>

											</div>
										</div>

									</CardBody>
									<hr className="mt-6 text-[#A7B3A7] border-[1px] w-full" />

									<CardFooter>
										<div className="flex justify-between items-center w-full">
											<div className="flex items-center gap-2">
												<div className="flex items-center justify-center rounded-lg bg-[#DEF7EC] w-[28px] h-[28px]">
													<Image src="/images/priceIcon.svg" width={20} height={20} alt="" />
												</div>
												<p className="text-base">Price Range</p>
											</div>
											<p className="text-[#111928] text-lg">Ksh 4-8M</p>
										</div>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				)
				}
			</div>
		</>
	)
}

export default MyOrders