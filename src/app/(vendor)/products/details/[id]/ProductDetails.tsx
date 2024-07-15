"use client";

import AppImage from "@/components/images/AppImage";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { IGreenProduct } from "@/types/GreenProduct";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Link } from "@nextui-org/react";
import Image from "next/image";
import { FaClock } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import useSWR from "swr";

interface IProps {
	id: string;
}


export default function ProductDetails({ id }: IProps) {
	const { data: product, isLoading } = useSWR<IGreenProduct[]>([`${IApiEndpoint.GET_VENDOR_PRODUCTS_BY_ID}?id=${id}`], swrFetcher, { keepPreviousData: true });

	const HTMLComponent = ({ description }) => {
		return (
		  <div>
			<div dangerouslySetInnerHTML={{ __html: description }} />
		  </div>
		);
	  };

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Vendor</BreadcrumbItem>
				<BreadcrumbItem>Product Details</BreadcrumbItem>
			</Breadcrumbs>
			<div className="grid grid-cols-1  md:grid-cols-12 gap-2 mt-7">
				<div className="my-6 col-auto md:col-span-8">
					<Chip endContent={<FaClock size={18} />} color="primary" variant="flat">
						{product?.categories}
					</Chip>
					<h1 className="text-2xl font-bold mt-2">{product?.name}</h1>
					<div className="leading my-4">
						<HTMLComponent description={product?.description}/>
					</div>
					<h5 className="text-lg font-bold mt-4 mb-2">SDG Impact</h5>
					<div className="flex justify-start items-center gap-3 flex-wrap">
						{product?.sdg.map((sdgItem) => (
							<Image
								key={sdgItem.id}
								alt={`SDG ${sdgItem.title}`}
								src={`/images/sdg-pics/SDG-${sdgItem.title}.png`}
								width={50}
								height={50}
							/>
						))}
					</div>
					<div className="">
						<h5 className="text-lg font-bold mt-4 mb-2">Summary Details</h5>
						<Accordion>
							<AccordionItem
								title="What it does?"
								classNames={{
									heading: "bg-gray-200 rounded-t-md  px-2 text-base  font-semibold my-2",
									title: "text-[16px]",
								}}>
									<HTMLComponent description={product?.howItWorks}/>
							</AccordionItem>
							<AccordionItem
								title="Advantages of this product?"
								classNames={{
									heading: "bg-gray-200 rounded-t-md  px-2 text-base  font-semibold my-2",
									title: "text-[16px]",
								}}>
									<HTMLComponent description={product?.advantages}/>
							</AccordionItem>
							<AccordionItem
								title="Challenges"
								classNames={{
									heading: "bg-gray-200 rounded-t-md  px-2 text-base  font-semibold my-2",
									title: "text-[16px]",
								}}>
									<HTMLComponent description={product?.disadvantages}/>
							</AccordionItem>
						</Accordion>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-12  gap-2">
						<div className="col-auto md:col-span-8">
							<AppImage
								alt={product?.name}
								radius="sm"
								src={product?.images[0]?.url}
								classNames={{
									img: "w-full  opacity-1",
								}}
								width={500}
								height={500}
							/>
						</div>

						<div className="col-auto md:col-span-3  gap-10">
							<div className="grid grid-col-2 gap-4 h-full">
								<AppImage
									alt={product?.name}
									radius="sm"
									src={product?.images[1]?.url}
									classNames={{
										img: "w-full h-full  opacity-1",
									}}
									width={250}
									height={250}
								/>
								<AppImage
									alt={product?.name}
									radius="sm"
									src={product?.images[2]?.url}
									classNames={{
										img: "w-full h-full  opacity-1",
									}}
									width={250}
									height={250}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="order-first md:order-last  col-auto md:col-span-4 mt-5 md:mt-0">
					<Card className="space-x-2 px-4 py-4 w-full ">
						<CardHeader>
							<h2 className="font-semibold  text-xl">Product Summary</h2>
						</CardHeader>
						<CardBody className="space-y-4">
							<p className="flex flex-col text-base">
								<span className="font-semibold">Product name :</span>
								<span className="text-gray-400 text-sm">{product?.name}</span>
							</p>
							<p className="flex flex-col text-base">
								<span className="font-semibold">Industry :</span>
								<span className="text-gray-400 text-sm">{product?.categories}</span>
							</p>
							<p className="flex flex-col text-base">
								<span className="font-semibold">SDG Impact :</span>
								<span className="text-gray-400 text-sm">{product?.sdg.map(sdgItem => sdgItem.title).join(", ")}</span>
							</p>
							<p className="flex flex-col text-base">
								<span className="font-semibold">Price Range :</span>
								<span className="text-gray-400 text-sm">{product?.priceRangeMin}- {product?.priceRangeMax}</span>
							</p>
						</CardBody>
						<CardFooter>
							<Button color="primary" variant="solid" as={Link} href={"/"} endContent={<FiEdit3 />} className="w-full">
								Edit
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</>
	);
}
