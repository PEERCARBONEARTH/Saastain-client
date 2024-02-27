import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowNarrowRight } from "react-icons/hi";

interface GHGCardItemProps {
	title: string;
	image: string;
}

const GHGReports: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>GHG Reports - SaaStain</title>
			</Head>
			<Breadcrumbs>
				<BreadcrumbItem>Reports</BreadcrumbItem>
				<BreadcrumbItem>GHG Reports</BreadcrumbItem>
			</Breadcrumbs>
			<div className="my-8 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
				<h1 className="text-xl font-bold">Generate Report</h1>
				<Input
					classNames={{
						base: "max-w-full sm:max-w-[20rem] h-10",
						mainWrapper: "h-full",
						input: "text-small",
						inputWrapper: "h-full font-normal text-default-600 rounded-2xl",
					}}
					placeholder="Type to search..."
					size="sm"
					startContent={<SearchIcon size={18} />}
					type="search"
					variant="bordered"
				/>
			</div>
			<div className="mt-1 mb-10">
				<p className="text-gray-600">
					In this section, you can effortlessly generate ESG (Environmental, Social, and Governance) and Sustainability reports aligned with the GHG (Greenhouse Gas) protocol. Choose from a variety of reporting
					frameworks tailored to your business needs. Whether you're following GRI, SASB, TCFD, or other industry standards, our platform simplifies the reporting process.{" "}
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<GHGCardItem title="Carbon Disclosure Project" image="/images/reports/cdp.png" />
				<GHGCardItem title="Task Force on Climate-Related Financial Disclosures" image="/images/reports/TCFD.png" />
				<GHGCardItem title="Global Reporting Intiative" image="/images/reports/gri.png" />
			</div>
			<div className="flex items-center justify-end my-10">
				<Button color="primary" size="lg" endContent={<HiArrowNarrowRight />}>Continue</Button>
			</div>
		</>
	);
};

const GHGCardItem = ({ title, image }: GHGCardItemProps) => {
	return (
		<Card className="p-6 bg-[#FCFCFC]">
			<CardBody className="items-center justify-center">
				<Image src={image} alt="CDP" width={150} height={150} />
				<h2 className="text-lg font-medium mt-4 text-gray-500 text-center">{title}</h2>
				<Link href="#">
					<p className="text-blue-600 hover:underline mt-4 text-sm hover:underline-offset-4">View Framework Details</p>
				</Link>
			</CardBody>
		</Card>
	);
};

GHGReports.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default GHGReports;
