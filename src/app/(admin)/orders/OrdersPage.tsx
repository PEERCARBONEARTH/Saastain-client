"use client";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IOrder } from "@/types/Order";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, Skeleton } from "@nextui-org/react";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { HiDocumentText, HiDotsVertical, HiOutlineFilter, HiOutlineRefresh } from "react-icons/hi";
import useSWR from "swr";

const OrdersPage = () => {
	const { data: orders, isLoading } = useSWR<IOrder[]>([IApiEndpoint.GET_ALL_ORDERS], swrFetcher, { keepPreviousData: true });
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem>Orders</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-4 space-y-2">
				<h1 className="text-green-800 font-bold text-2xl">Orders</h1>
				<p className="text-sm">
					Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
					sunt explicabo
				</p>
			</div>
			<div className="w-full h-[1px] bg-gray-500 my-4"></div>
			<div className="flex items-center justify-between w-full">
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
				<Button color="primary" variant="bordered" startContent={<HiOutlineFilter className="w-5 h-5" />}>
					Filter
				</Button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
				{isLoading ? (
					[...Array.from({ length: 6 })].map((_, idx) => <GridSkeleton key={idx} />)
				) : orders?.length > 0 ? (
					orders?.map((orderItem) => <QuoteItem key={orderItem?.id} orderDetails={orderItem} />)
				) : (
					<Card className="w-full col-span-1 sm:col-span-2 md:col-span-3">
						<CardBody>
							<p className="text-center">No Orders Added Yet</p>
						</CardBody>
					</Card>
				)}
			</div>
		</>
	);
};

const QuoteItem = ({ orderDetails }: { orderDetails: IOrder }) => {
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
							<DropdownItem onPress={() => router.push(`/orders/details/${orderDetails?.id}`)} key="view">
								View Order
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</CardHeader>
			<CardBody>
				<div className="w-full flex items-center justify-between py-2 pb-4 border-b">
					<Image width={65} src="/images/quotes/img1.png" />
					<div className="">
						<p className="text-xs font-medium">{format(new Date(orderDetails?.createdAt), "MMM do, yyyy")}</p>
						<h2 className="text-bold text-saastain-green">{orderDetails?.orderCode}</h2>
					</div>
					<Chip size="sm" className="bg-yellow-100 text-yellow-800 capitalize">
						{orderDetails?.status}
					</Chip>
				</div>
				<div className="pt-2 space-y-4 pb-4 border-b">
					<div className="w-full flex items-center justify-between">
						<h3 className="text-gray-500 text-sm font-semibold">Product Name</h3>
						<h3 className="text-gray-800 text-sm font-semibold">{orderDetails?.product?.name}</h3>
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
						Ksh {orderDetails?.product?.priceRangeMin} - {orderDetails?.product?.priceRangeMax}
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

export default OrdersPage;
