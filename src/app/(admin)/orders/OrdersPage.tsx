"use client";

import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { HiDocumentText, HiDotsVertical, HiOutlineFilter, HiOutlineRefresh } from "react-icons/hi";

const OrdersPage = () => {
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
				{[...Array.from({ length: 10 })].map((_, idx) => (
					<QuoteItem key={idx} />
				))}
			</div>
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
							<DropdownItem onPress={() => router.push("/orders/details/1")} key="view">
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

export default OrdersPage;
