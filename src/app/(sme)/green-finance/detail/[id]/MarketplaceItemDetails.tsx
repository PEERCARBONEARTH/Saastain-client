"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IGreenProduct } from "@/types/GreenProduct";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Image, Skeleton } from "@nextui-org/react";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { MdCookie } from "react-icons/md";
import useSWR from "swr";

interface IProps {
	id: string;
}

const MarketplaceItemDetails: FC<IProps> = ({ id }) => {
	const { data, isLoading, error } = useSWR<IGreenProduct>([IApiEndpoint.GET_GREEN_PRODUCT_BY_ID, { id }], swrFetcher, { keepPreviousData: true });

	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem>MarketPlace</BreadcrumbItem>
				<BreadcrumbItem>Product Details</BreadcrumbItem>
			</Breadcrumbs>
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

			{data && (
				<div className="grid grid-cols-1 md:grid-cols-12 gap-2 px-0 md:px-3 mt-5">
					<div className="col-auto md:col-span-8 xl:col-span-9">
						<Chip startContent={<MdCookie size={18} />} variant="faded" color="success" className="border-0 bg-green-100 text-primary-900 text-sm">
							{data?.categories}
						</Chip>
						<h1 className="text-xl font-bold my-2">{data?.name}</h1>
						<div className="" dangerouslySetInnerHTML={{ __html: data.description }} />
						<div className="my-4">
							<h5 className="text-lg font-bold">Summary Details</h5>
							<div className="mt-4">
								<Accordion selectionMode="multiple" variant="splitted">
									<AccordionItem title={"What it does?"} indicator={<LinkIcon />}>
										<div className="" dangerouslySetInnerHTML={{ __html: data.howItWorks }} />
									</AccordionItem>
									<AccordionItem title={"Advantages / Benefits"} indicator={<LinkIcon />}>
										<div className="" dangerouslySetInnerHTML={{ __html: data.advantages }} />
									</AccordionItem>
									<AccordionItem title={"Challenges"} indicator={<LinkIcon />}>
										<div className="" dangerouslySetInnerHTML={{ __html: data.disadvantages }} />
									</AccordionItem>
								</Accordion>
							</div>
							<div className="my-4">
								<div className="columns-2 gap-5">
									{data.images?.map((imgItem) => (
										<div key={imgItem.id} className="break-inside-avoid mb-4">
											<Image alt="Product Image" isZoomed src={imgItem?.url} />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className="order-first md:order-last col-auto  md:col-span-4 xl:col-span-3">
						<Card className="w-full px-4 py-5">
							<CardHeader>
								<h2 className="font-semibold  text-xl">Product Summary</h2>
							</CardHeader>
							<CardBody className="space-y-4">
								<p className="flex flex-col text-base">
									<span className="font-semibold">Product name :</span>
									<span className="text-gray-400 text-sm">{data.name}</span>
								</p>
								<p className="flex flex-col text-base">
									<span className="font-semibold">Manufacturer :</span>
									<span className="text-gray-400 text-sm">{data.vendor.companyName}</span>
								</p>
								<p className="flex flex-col text-base">
									<span className="font-semibold">Industry :</span>
									<span className="text-gray-400 text-sm">{data.categories}</span>
								</p>
								<p className="flex flex-col text-base">
									<span className="font-semibold">SDG Impact :</span>
									<span className="text-gray-400 text-sm"> SDG {data.sdg.map((item) => `${item.title}`).join(`, `)}</span>
								</p>
								<p className="flex flex-col text-base">
									<span className="font-semibold">Price :</span>
									<span className="text-gray-400 text-sm">
										KSh {data.priceRangeMin} - {data.priceRangeMax}
									</span>
								</p>
							</CardBody>
							<CardFooter>
								<Button color="primary" variant="solid" as={Link} href={AppEnumRoutes.APP_LOAN_REQUESTS_APPLY}>
									Request For Quotation
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			)}

			{error && (
				<div className="space-y-2 border p-2 rounded-md mb-10">
					<p className="text-danger font-bold">Error</p>
					<div className="text-danger text-sm">{"Product Details Not Found"}</div>
				</div>
			)}
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

export default MarketplaceItemDetails;
