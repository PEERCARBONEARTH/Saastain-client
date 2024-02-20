import { dummyMarketPlaceList } from "@/data/dummy-marketplace";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link, Image, Chip } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";

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
				<div className="flex justify-between my-4 ">
					
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

{
	dummyMarketPlaceList.map((x)=>(
		<Card className="shadow-none  space-x-2" key={x.id}>
		<CardHeader className="p-0">
			<Image alt={x.project_name} className="rounded-b-none" radius="sm" height={100} src="/images/carbon-project.jpg" />
		</CardHeader>
		<CardBody className="px-4">
			<div className="flex  justify-between  flex-col-reverse md:flex-row">
				<p className="font-semibold my-auto">{x.project_location}</p>
				<Chip startContent={<MdCookie size={18} />} variant="faded" color="success" className="border-0 bg-green-100 text-primary-900 text-sm">
					{x.project_category}
				</Chip>
			</div>

			<div className="my-4 space-y-4">
				<h2 className="text-xl  font-bold leading-6 capitalize">{x.project_name}</h2>
				<p className="text-gray-700 text">{x.project_description}</p>
				<div className="flex justify-start ">
					<Button isIconOnly color="primary" aria-label="Shopping Cart" className="rounded-full">
						<MdShoppingCart className="w-4 h-4" />
					</Button>
					<p className="ml-2 my-auto text-base font-bold">{x.project_price}</p>
				</div>
			</div>
		</CardBody>
		
		<CardFooter>
			<Button   as={Link}  href={`/green-finance/item/${x.id}`}  color="primary" variant="bordered" className=" rounded-md w-3/4 text-center hover:bg-primary-600  hover:text-white">Learn More</Button>
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
