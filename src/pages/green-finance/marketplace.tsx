import { dummyMarketPlaceList } from "@/data/dummy-marketplace";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link, Image, Chip } from "@nextui-org/react";

import Head from "next/head";

import { MdCookie, MdFilterListAlt, MdSearch, MdShoppingCart } from "react-icons/md";

const MarketPlace: NextPageWithLayout = () => {
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Green Financing</BreadcrumbItem>
				<BreadcrumbItem>Marketplace</BreadcrumbItem>
			</Breadcrumbs>
			<Head>
				<title>Our Marketplace</title>
			</Head>
			<h1 className="text-xl font-bold  my-4">Our Marketplace</h1>
			<p className="text-base my-2">
				Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
				explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit
			</p>
			<div className="container">
				<div className="flex justify-between ">
					<Input
						isClearable
						size="sm"
						classNames={{
							label: "text-black/50 ",
							input: ["", "text-black/90 ", "placeholder:text-default-700/50"],
							innerWrapper: "bg-transparent",
							inputWrapper: [
								"bg-default",
								"w-2/4",
								"border-2 border-gray-400",
								"backdrop-blur-xl",
								"backdrop-saturate-200",
								"hover:bg-default-200/70",

								"group-data-[focused=true]:bg-default-200/50",

								"!cursor-text",
							],
						}}
						placeholder="Type to search..."
						startContent={<MdSearch className="text-black/50 mb-0.5 text-slate-400 pointer-events-none flex-shrink-0" />}
					/>

					<Button color="primary" startContent={<MdFilterListAlt className="w-5 h-5" />} size="sm">
						Filter Data
					</Button>
				</div>
			</div>

			<div className="container my-10">
				<div className="filter"></div>
				<div className="marketplace">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{
	dummyMarketPlaceList.map((x)=>(
		<Card className="shadow-none  space-x-2">
		<CardHeader className="p-0">
			<Image alt="Carbon Project  Name" className="rounded-b-none" radius="sm" height={100} src="/images/carbon-project.jpg" />
		</CardHeader>
		<CardBody className="px-4">
			<div className="flex  justify-between  flex-col-reverse md:flex-row">
				<p className="font-semibold my-auto">Kenya</p>
				<Chip startContent={<MdCookie size={18} />} variant="faded" color="success" className="border-0 bg-green-100 text-primary-900 text-sm">
					Clean Cooking
				</Chip>
			</div>

			<div className="my-4 space-y-4">
				<h2 className="text-xl  font-bold leading-6">Meko Friendly Steam Cooking System</h2>
				<p className="text-gray-700 text">Accelerate the cooking speed with energy cost and without burning or scorching</p>
				<div className="flex justify-start ">
					<Button isIconOnly color="primary" aria-label="Shopping Cart" className="rounded-full">
						<MdShoppingCart className="w-4 h-4" />
					</Button>
					<p className="ml-2 my-auto text-base font-bold">From $3000</p>
				</div>
			</div>
		</CardBody>
		
		<CardFooter>
			<Button color="primary" variant="bordered" className=" rounded-md w-3/4 text-center">Learn More</Button>
		</CardFooter>
	</Card>
		
	))
}

					</div>
				</div>
			</div>
		</>
	);
};

MarketPlace.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default MarketPlace;
