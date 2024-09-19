"use client";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppKey } from "@/types/Global";
import { statusColors, statusTextColor } from "@/types/OrderStatus";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, Skeleton } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import { LayoutGrid, Menu, SearchIcon } from "lucide-react";
import { HiDocumentText, HiDotsVertical, HiOutlineRefresh } from "react-icons/hi";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { IOrder } from "@/types/Order";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { format } from "date-fns";
import Link from "next/link";

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
	const [currentView, setCurrentView] = useState<IViewType>("grid");

	const toggleView = (toView: IViewType) => {
		if (currentView === toView) return;
		setCurrentView(toView);
	};

	const renderCell = useCallback((item: IOrder, columnKey: AppKey) => {
		switch (columnKey) {
			case "id":
				return (
					<Link href={`${AppEnumRoutes.APP_ORDER_DETAILS}/${item?.id}`}>
						<p className="text-[#6B7280] underline">{item.orderCode}</p>
					</Link>
				);
			case "product":
				return <p className="text-[#014737]">{item?.product?.name}</p>;
			case "category":
				return (
					<Chip size="sm" style={{ backgroundColor: "#EDEBFE", color: "#5521B5" }}>
						{item?.product?.categories}
					</Chip>
				);
			case "customer":
				return <p>{item?.company?.companyName}</p>;
			case "deliveryDate":
				return <p>{"---"}</p>;
			case "status": {
				const backgroundColor = statusColors[item.status] || "#ccc";
				const textColor = statusTextColor[item.status] || "#ccc";
				return (
					<Chip size="sm" style={{ backgroundColor, color: textColor }} className="capitalize">
						{item.status}
					</Chip>
				);
			}
			default:
				return null;
		}
	}, []);

	const { didHydrate } = useDidHydrate();
	const { data: session } = useSession();

	const account = useMemo(() => {
		if (didHydrate) {
			return session?.user;
		}

		return null;
	}, [didHydrate, session]);

	const { data: myOrders, isLoading } = useSWR<IOrder[]>([`${IApiEndpoint.GET_ORDERS_BY_VENDOR}/${account?.vendorProfile?.id}`], swrFetcher, { keepPreviousData: true });

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Home</BreadcrumbItem>
				<BreadcrumbItem className="text-[#03543F]">My Orders</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-4 space-y-2">
				<h1 className="text-green-800 font-bold text-2xl">My Orders</h1>
				<p className="text-sm">List of all current and past orders. You can view detailed information about each order, including the vendor name, order date, status, and total amount.</p>
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
						placeholder="Search ..."
						endContent={<SearchIcon size={18} />}
						type="search"
						variant="bordered"
					/>
					<Button isIconOnly size="lg" className="bg-saastain-brown">
						<HiOutlineRefresh className="text-white w-5 h-5" />
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Button
						isIconOnly
						color="primary"
						size="sm"
						onPress={() => {
							toggleView("grid");
						}}
						variant={currentView === "grid" ? "solid" : "bordered"}>
						<LayoutGrid />
					</Button>
					<Button
						isIconOnly
						color="primary"
						size="sm"
						onPress={() => {
							toggleView("tabular");
						}}
						variant={currentView === "tabular" ? "solid" : "bordered"}>
						<Menu />
					</Button>
				</div>
			</div>
			{currentView === "grid" && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
					{isLoading ? (
						[...Array.from({ length: 6 })].map((_, idx) => <GridSkeleton key={idx} />)
					) : myOrders?.length > 0 ? (
						myOrders?.map((orderItem) => <QuoteItem key={orderItem?.id} orderItem={orderItem} />)
					) : (
						<>
							<Card className="w-full col-span-1 sm:col-span-2 md:col-span-3">
								<CardBody>
									<p className="text-center">No Orders Added Yet</p>
								</CardBody>
							</Card>
						</>
					)}
				</div>
			)}
			{currentView === "tabular" && (
				<div className="mt-5">
					<AppTable<IOrder> headerColumns={OrdersColumns} data={myOrders ?? []} count={myOrders?.length ?? 0} isLoading={isLoading} renderCell={renderCell} title="Orders" showTopContent={false} />
				</div>
			)}
		</>
	);
};

const QuoteItem = ({ orderItem }: { orderItem: IOrder }) => {
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
							<DropdownItem as={Link} href={`${AppEnumRoutes.APP_ORDER_DETAILS}/${orderItem?.id}`} key="view">
								View Order
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</CardHeader>
			<CardBody>
				<div className="w-full flex items-center justify-between py-2 pb-4 border-b">
					{/* <Image width={65} src="/images/quotes/img1.png" /> */}
					<Image width={65} src={orderItem?.product?.images?.[0].url} />

					<div className="">
						<p className="text-xs font-medium">{format(new Date(orderItem?.createdAt), "MMM do, yyyy")}</p>
						<h2 className="text-bold text-saastain-green">{orderItem?.orderCode}</h2>
					</div>
					<Chip size="sm" className="bg-yellow-100 text-yellow-800">
						{orderItem?.status}
					</Chip>
				</div>
				<div className="pt-2 space-y-4 pb-4 border-b">
					<div className="w-full flex items-center justify-between">
						<h3 className="text-gray-500 text-sm font-semibold">Product Name</h3>
						<h3 className="text-gray-800 text-sm font-semibold">{orderItem?.product?.name ?? "----"}</h3>
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
					<p className="text-gray-800 text-sm">
						Ksh {orderItem?.product?.priceRangeMin} - {orderItem?.product?.priceRangeMax}
					</p>
				</div>
			</CardFooter>
		</Card>
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

export default MyOrders;
