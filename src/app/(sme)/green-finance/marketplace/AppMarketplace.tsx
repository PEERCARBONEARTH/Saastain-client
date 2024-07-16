"use client";
import { dummyMarketPlaceList } from "@/data/dummy-marketplace";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Input, Image, Chip, Skeleton } from "@nextui-org/react";
import { MdCookie, MdFilterListAlt, MdShoppingCart } from "react-icons/md";
import { SearchIcon } from "lucide-react";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import Link from "next/link";
import useSWR from "swr";
import { IGreenProduct } from "@/types/GreenProduct";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";

const AppMarketPlace = () => {
	const { data, isLoading } = useSWR<IGreenProduct[]>([IApiEndpoint.GET_GREEN_PRODUCTS], swrFetcher, { keepPreviousData: true });

	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem>Green Financing</BreadcrumbItem>
				<BreadcrumbItem>Marketplace</BreadcrumbItem>
			</Breadcrumbs>
			<h1 className="text-xl font-bold  my-4">Our Marketplace</h1>
			<p className="text-base my-2">
				Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
				explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit
			</p>

			<div className="container">
				<div className="flex items-center justify-between my-4 ">
					<Input
						classNames={{
							base: "w-3/5 h-10",
							mainWrapper: "h-full",
							input: "text-small ",
							inputWrapper: "h-full font-normal text-default-600 rounded-md ",
						}}
						placeholder="Search ..."
						size="sm"
						endContent={<SearchIcon size={18} />}
						type="search"
						variant="bordered"
					/>

					<Button color="primary" startContent={<MdFilterListAlt className="w-4 h-4" />} size="md" className="rounded-md">
						Filter Data
					</Button>
				</div>
			</div>

			<div className="container my-10">
				<div className="filter"></div>
				<div className="marketplace">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{isLoading && (
							<>
								{dummyMarketPlaceList?.map((_, idx) => (
									<ProductSkeleton key={idx} />
								))}
							</>
						)}
						{data && data?.length > 0 && (
							<>
								{data?.map((product) => (
									<ProductCardItem item={product} key={product.id} />
								))}
							</>
						)}
					</div>
				</div>
			</div>
		</AuthRedirectComponent>
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

const ProductCardItem = ({ item }: { item: IGreenProduct }) => {
	return (
		<Card className="shadow-none  space-x-2">
			<CardHeader className="p-0">
				<Image isZoomed alt={item.images?.[0].id} className="rounded-b-none" radius="sm" height={100} src={item.images?.[0].url} fallbackSrc={"https://via.placeholder.com/300x200"} />
			</CardHeader>
			<CardBody className="px-4">
				<div className="flex  justify-between  flex-col-reverse md:flex-row">
					<p className="font-semibold my-auto">{"Kenya"}</p>
					<Chip startContent={<MdCookie size={18} />} variant="faded" color="success" className="border-0 bg-green-100 text-primary-900 text-sm">
						{item.categories}
					</Chip>
				</div>

				<div className="my-4 space-y-4">
					<h2 className="text-xl  font-bold leading-6 capitalize">{item.name}</h2>
					<div className="line-clamp-6 text-gray-700" dangerouslySetInnerHTML={{ __html: item.description }} />
					<div className="flex justify-start ">
						<Button isIconOnly color="primary" aria-label="Shopping Cart" className="rounded-full">
							<MdShoppingCart className="w-4 h-4" />
						</Button>
						<p className="ml-2 my-auto text-base font-bold">
							Ksh {item.priceRangeMin} - {item.priceRangeMax}
						</p>
					</div>
				</div>
			</CardBody>

			<CardFooter>
				<Button as={Link} href={`/green-finance/detail/${item.id}`} color="primary" variant="bordered" className=" rounded-md w-full text-center hover:bg-primary-600  hover:text-white">
					Learn More
				</Button>
			</CardFooter>
		</Card>
	);
};

export default AppMarketPlace;
