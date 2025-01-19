"use client";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { AppKey } from "@/types/Global";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, Skeleton } from "@heroui/react";
import { ChevronRight, LayoutGridIcon, MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { HiOutlineRefresh, HiDotsVertical, HiDocumentText } from "react-icons/hi";
import { IOrder as IProductOrder } from "@/types/Order";
import useSWR from "swr";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useSession } from "next-auth/react";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import { format } from "date-fns";
import { formatCurrency } from "@/utils";

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

type IViewType = "grid" | "table";



const MyProjects = () => {
	const [currentView, setCurrentView] = useState<IViewType>("grid");

	const { didHydrate } = useDidHydrate();
	const { data: session } = useSession();

	const account = useMemo(() => {
		if (didHydrate) {
			return session?.user;
		}

		return null;
	}, [session, didHydrate]);

	const renderCell = useCallback((item: IProductOrder, columnKey: AppKey) => {
		switch (columnKey) {
			case "orderId":
				return (
					<Link href={`${AppEnumRoutes.APP_PROJECT_DETAILS}/${item.id}`}>
						<span className="underline underline-offset-4" >{item?.orderCode}</span>
					</Link>
				);
			case "productName":
				return <span>{item?.product?.name}</span>;
			case "deliveryDate":
				return <span>{"---"}</span>;
			case "status":
				return (
					<Chip className="capitalize" size="sm" color="primary" variant="flat">
						{item.status}
					</Chip>
				);
			case "category":
				return (
					<Chip size="sm" color="secondary" variant="flat">
						{item.product?.categories}
					</Chip>
				);
			case "actions":
				return (
					<>
						<Button as={Link} href={`${AppEnumRoutes.APP_PROJECT_DETAILS}/${item?.id}`} color="primary" size="sm" endContent={<ChevronRight className="w-4 h-4" />}>
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

	const { data: myOrders, isLoading } = useSWR<IProductOrder[]>([`${IApiEndpoint.GET_ORDERS_BY_COMPANY}/${account?.company?.id}`], swrFetcher, { keepPreviousData: true });

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
					{isLoading ? (
						[...Array.from({ length: 6 })].map((_, idx) => <GridSkeleton key={idx} />)
					) : myOrders?.length > 0 ? (
						myOrders?.map((orderItem) => <QuoteItem key={orderItem?.id} orderItem={orderItem} />)
					) : (
						<>
							<Card className="w-full col-span-1 sm:col-span-2 md:col-span-3">
								<CardBody>
									<p className="text-center">No Projects Added Yet</p>
								</CardBody>
							</Card>
						</>
					)}
				</div>
			)}
			{currentView === "table" && (
				<div className="mt-5">
					<AppTable<IProductOrder> count={myOrders?.length ?? 0} data={myOrders ?? []} isLoading={isLoading} renderCell={renderCell} title="Orders" showTopContent={false} headerColumns={headerColumns} />
				</div>
			)}
		</>
	);
};

const QuoteItem = ({ orderItem }: { orderItem: IProductOrder }) => {
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
							<DropdownItem as={Link} href={`${AppEnumRoutes.APP_PROJECT_DETAILS}/${orderItem?.id}`} key="view">
								View Details
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</CardHeader>
			<CardBody>
				<div className="w-full flex items-center justify-between py-2 pb-4 border-b">
					<Image width={65} src={orderItem?.product?.images?.[0]?.url} />
					<div className="">
						<p className="text-xs font-medium">{format(new Date(orderItem?.createdAt), "MMM do, yyyy")}</p>
						<h2 className="text-bold text-saastain-green">{orderItem?.orderCode}</h2>
					</div>
					<Chip size="sm" className="bg-yellow-100 text-yellow-800 capitalize">
						{orderItem?.status}
					</Chip>
				</div>
				<div className="pt-2 space-y-4 pb-4 border-b">
					<div className="w-full flex items-center justify-between">
						<h3 className="text-gray-500 text-sm font-semibold">Product Name</h3>
						<h3 className="text-gray-800 text-sm font-semibold">{orderItem?.product?.name}</h3>
					</div>
					<div className="w-full flex items-center justify-between">
						<h3 className="text-gray-500 text-sm font-semibold">No of Order</h3>
						<h3 className="text-gray-800 text-sm font-semibold">{orderItem?.quoteDetails?.length > 0 ? orderItem?.quoteDetails?.[0]?.variantsInfo?.length : 0}</h3>
					</div>
					<div className="w-full flex items-center justify-between">
						<h3 className="text-gray-500 text-sm font-semibold">Total Area</h3>
						<h3 className="text-gray-800 text-sm font-semibold">{orderItem?.quoteDetails?.length > 0 ? orderItem?.quoteDetails?.[0]?.totalArea : "----"}</h3>
					</div>
				</div>
			</CardBody>
			<CardFooter>
				<div className="w-full flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-green-100 p-2 rounded-lg">
							<HiDocumentText className="w-6 h-6 text-saastain-green" />
						</div>
						<p className="text-gray-500 text-sm">{orderItem?.quoteDetails?.length > 0 ? "Quote Amount" : "Price Range"}</p>
					</div>
					<p className="text-gray-800 text-sm">
						{orderItem?.quoteDetails?.length > 0 ? (
							formatCurrency(Number(orderItem?.quoteDetails?.[0]?.totalCost))
						) : (
							<>
								{formatCurrency(Number(orderItem?.product?.priceRangeMin))} - {formatCurrency(Number(orderItem?.product?.priceRangeMax))}
							</>
						)}
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

export default MyProjects;
