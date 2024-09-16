"use client";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
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
	selectReport: (link: string, title: string) => void;
}
interface GHGModalProps {
	title: string;
	link: string;
}

const GHGReports = () => {
	const [link, setLink] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const handleClick = (link: string, title: string) => {
		setLink(link);
		setTitle(title);
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
				<GHGModal title={title} link={link} />
			</div>
		</AuthRedirectComponent>
	);
};

const GHGCardItem = ({ title, image, link, selectReport, selecetedLink }: GHGCardItemProps) => {
	return (
		<Card className={clsx("p-6 bg-[#FCFCFC]  hover:bg-green-50", { "bg-green-50": link === selecetedLink })} onPress={() => selectReport(link, title)} isPressable>
			<CardBody className="items-center justify-center">
				<Image src={image} alt="CDP" width={150} height={150} />
				<h2 className="text-lg font-medium mt-4 text-gray-500 text-center">{title}</h2>
				<Link href={link} target="_blank">
					<p className="text-blue-600 hover:underline mt-4 text-sm hover:underline-offset-4">View Framework Details</p>
				</Link>
			</CardBody>
		</Card>
	);
};

const GHGModal = ({ title, link }: GHGModalProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<div className="flex flex-wrap gap-3">
				<Button onPress={onOpen} color="primary" size="lg" endContent={<HiArrowNarrowRight />} isDisabled={!link}>
					Continue
				</Button>
			</div>
			<Modal size="xl" isOpen={isOpen} onClose={onClose}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-gray-600">{title} Report</ModalHeader>
							<ModalBody className="text-gray-600 space-y-4">
								<p>
									To ensure accuracy and alignment with industry standards in your ESG and Sustainability reporting, please contact our{" "}
									<Link href="mailto:support@saastain.app" className="font-bold mx-1 text-[#5E896E]">
										support team
									</Link>
									or your dedicated sustainability expert.
								</p>
								<p>They will assist you in generating a custom report tailored to your selected framework and business needs.</p>
								<div className="space-y-4">
									<p>Contact Information:</p>

									<div>
										<dl className="flex flex-col sm:flex-row gap-1">
											<dt className=" mr-2">
												<span className="block font-bold ">Email:</span>
											</dt>
											<dd>
												<ul>
													<li className=" inline-flex items-start text-sm text-gray-800">
														<Link href="mailto:support@saastain.app" className="font-bold text-[#5E896E]">
															support@saastain.app
														</Link>
													</li>
												</ul>
											</dd>
										</dl>
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="success" onPress={onClose}>
									Dismiss
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
export default GHGReports;
