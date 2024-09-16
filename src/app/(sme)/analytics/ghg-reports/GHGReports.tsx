"use client";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowNarrowRight } from "react-icons/hi";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { useState } from "react";
import clsx from "clsx";

interface GHGCardItemProps {
	title: string;
	image: string;
	link: string;
	selecetedLink: string;
	selectReport: (link: string) => void;
}

const GHGReports = () => {
	const [link, setLink] = useState<string>("");
	const handleClick = (link: string) => {
		setLink(link);
	};

	const openReport = (link: string) => {
		window.open(link, "_blank");
		setLink("");
	};
	return (
		<AuthRedirectComponent>
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
				<GHGCardItem title="Carbon Disclosure Project" image="/images/reports/cdp.png" link=" https://www.cdp.net/en" selectReport={handleClick} selecetedLink={link} />
				<GHGCardItem title="Task Force on Climate-Related Financial Disclosures" image="/images/reports/TCFD.png" link="https://www.fsb-tcfd.org/" selectReport={handleClick} selecetedLink={link} />
				<GHGCardItem title="Global Reporting Intiative" image="/images/reports/gri.png" link="https://www.globalreporting.org/" selectReport={handleClick} selecetedLink={link} />
			</div>
			<div className="flex items-center justify-end my-10">
				<Button color="primary" size="lg" endContent={<HiArrowNarrowRight />} onClick={() => openReport(link)}>
					Continue
				</Button>
			</div>
		</AuthRedirectComponent>
	);
};

const GHGCardItem = ({ title, image, link, selectReport, selecetedLink }: GHGCardItemProps) => {
	const handleSelect = (link: string) => {
		selectReport(link);
	};
	return (
		<Card className={clsx("p-6 bg-[#FCFCFC]  hover:bg-green-50", { "bg-green-50": link === selecetedLink })} onPress={() => handleSelect(link)} isPressable>
			<CardBody className="items-center justify-center">
				<Image src={image} alt="CDP" width={150} height={150} />
				<h2 className="text-lg font-medium mt-4 text-gray-500 text-center">{title}</h2>
				<Link href={link}>
					<p className="text-blue-600 hover:underline mt-4 text-sm hover:underline-offset-4">View Framework Details</p>
				</Link>
			</CardBody>
		</Card>
	);
};

export default GHGReports;
