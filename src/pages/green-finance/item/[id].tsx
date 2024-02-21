import { dummyMarketPlaceList } from "@/data/dummy-marketplace";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Image, Link } from "@nextui-org/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdCookie, MdShoppingCart } from "react-icons/md";

import NextImage from "next/image";

const ItemDetails: NextPageWithLayout = () => {
	// /green-financing/item/1  or /green-financing/items?id=1
	const router = useRouter();
	const { id } = router.query as { id: string };
	const [project, setProject] = useState(dummyMarketPlaceList.find((x) => x.id === parseInt(id)));

	console.log(
		dummyMarketPlaceList.find((x) => x.id === parseInt(id)),
		id
	);

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>MarketPlace</BreadcrumbItem>
				<BreadcrumbItem>Project Details</BreadcrumbItem>
			</Breadcrumbs>
			<Head>
				<title>{project?.project_name}</title>
			</Head>

			{project ? (
				<div className="grid grid-cols-1  md:grid-cols-12 gap-2">
					<div key={project.id} className="my-6 col-auto md:col-span-8 ">
						<Chip startContent={<MdCookie size={18} />} variant="faded" color="success" className=" border-0 bg-green-100 text-primary-900 text-sm">
							{project?.project_category}
						</Chip>
						<h1 className="text-xl font-bold  my-2">{project?.project_name}</h1>
						{project.description.map((x) => (
							<p className="leading my-4">{x}</p>
						))}

						<div>
							<h5 className="text-lg font-bold mt-4 mb-2">SDG Impact</h5>
							<div className="images flex justify-start items-center gap-3   flex-wrap">
								{project.sdgImpact.map((x) => (
									<Image alt={`SDG ${x}`} radius="sm" height={30} src={`/images/project/SDG-${x}.png`} />
								))}
							</div>
						</div>
						<div>
							<h5 className="text-lg font-bold mt-4 mb-2">SDG Impact</h5>

							<Accordion>
								{project.faqs.map((item) => (
									<AccordionItem key={item.question} aria-label="Accordion 1" title={item.question}>
										{item.description.map((desc) => (
											<p className="leading my-4">{desc}</p>
										))}
									</AccordionItem>
								))}
							</Accordion>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-12  gap-2">
							<div className="col-auto md:col-span-8">
								<Image
									alt={project.project_name}
									radius="sm"
									src={project.list_images[0]}
									classNames={{
										img: "w-full  opacity-1",
									}}
								/>
							</div>

							<div className="col-auto md:col-span-3  gap-10">
								<div className="grid grid-col-2 gap-4 h-full">
									<Image
										alt={project.project_name}
										radius="sm"
										src={project.list_images[1]}
										classNames={{
											img: "w-full h-full  opacity-1",
										}}
									/>
									<Image
										alt={project.project_name}
										radius="sm"
										src={project.list_images[2]}
										classNames={{
											img: "w-full h-full  opacity-1",
										}}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="order-first md:order-last  col-auto md:col-span-4">
						<Card className="shadow-none rounded-sm  space-x-2 px-4 py-4 fixed w-fit" key={project.id}>
							<CardHeader>
								<h2 className="font-semibold  text-xl">Product Summary</h2>
							</CardHeader>
							<CardBody className="space-y-4">
								<p className="flex flex-col text-base">
									<span className="font-semibold">Product name :</span>
									<span className="text-gray-400 text-sm">{project.project_name}</span>
								</p>
								<p className="flex flex-col text-base">
									<span className="font-semibold">Manufacturer :</span>
									<span className="text-gray-400 text-sm">{project.product_manufacturer}</span>
								</p>
								<p className="flex flex-col text-base">
									<span className="font-semibold">Industry :</span>
									<span className="text-gray-400 text-sm">{project.industry}</span>
								</p>
								<p className="flex flex-col text-base">
									<span className="font-semibold">SDG Impact :</span>
									<span className="text-gray-400 text-sm"> SDG {project.sdgImpact.map(sdg => `${sdg}`).join(', ')}</span>
								</p>
								<p className="flex flex-col text-base">
									<span className="font-semibold">Price :</span>
									<span className="text-gray-400 text-sm">{project.project_price}</span>
								</p>
							</CardBody>

							<CardFooter>
								<Button color="primary" variant="solid" className=" rounded-md w-full text-center border-0 hover:border-2 hover:bg-transparent hover:border-primary-600  hover:text-primary-600">
									Apply for Funding
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			) : (
				<>
					<p>Loading</p>
				</>
			)}
		</>
	);
};
ItemDetails.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ItemDetails;
