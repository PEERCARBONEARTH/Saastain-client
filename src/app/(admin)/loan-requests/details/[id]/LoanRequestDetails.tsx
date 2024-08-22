"use client";

import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { getInitials } from "@/utils";
import { Avatar, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@nextui-org/react";
import { CheckIcon, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import { HiCheckCircle, HiEye, HiOutlineCloudUpload, HiDocumentText, HiDotsVertical, HiUser, HiMail, HiPhone } from "react-icons/hi";
const StrokedGaugeEmissions = dynamic(() => import("@/components/charts/StrokedGaugeChart"), { ssr: false });

const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024;

const LoanRequestDetails = ({ id }: { id: string }) => {
	const [isClimateRiskGenerated, setIsClimateRiskGenerated] = useState<boolean>(false);
	const onGenerate = () => setIsClimateRiskGenerated(true);

	const onDrop = (acceptedFiles: File[]) => {};

	const docSizeValidator = (file: File) => {
		if (file.size > MAX_FILE_SIZE_BYTES) {
			return {
				code: ErrorCode.FileTooLarge,
				message: "Image is larger tham 10MB",
			};
		}

		return null;
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, validator: docSizeValidator });

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem>SME's Name Loan Application</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-4 flex items-center justify-between">
				<h1 className="text-green-800 font-bold text-2xl">SME's Name Loan Application</h1>
				<div className="space-x-2 flex">
					<Button color="warning">Reject</Button>
					<Button color="primary" endContent={<CheckIcon className="w-5 h-5" />}>
						Approve
					</Button>
				</div>
			</div>
            <hr className="my-4 border-primary" />
			{!isClimateRiskGenerated && (
				<div className="my-2">
					<Card className="bg-yellow-100">
						<CardHeader>
							<div className="flex items-center gap-3">
								<HiCheckCircle className="w-6-h-6 text-yellow-700" />
								<h2 className="text-yellow-700 font-extrabold">Climate Report Required</h2>
							</div>
						</CardHeader>
						<CardBody>
							<p className="text-sm">
								Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of
								content.
							</p>
						</CardBody>
						<CardFooter>
							<div className="flex items-center justify-end w-full">
								<Button onPress={onGenerate} className="bg-yellow-700 text-white" endContent={<HiEye className="w-5 h-5" />}>
									Generate
								</Button>
							</div>
						</CardFooter>
					</Card>
				</div>
			)}
			<div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10">
				<div className="col-auto md:col-span-9">
					<div className="flex items-start gap-6">
						<div className="">
							<Avatar showFallback getInitials={getInitials} name="SME Name" radius="lg" className="w-28 h-28 text-5xl bg-gray-900 text-white" />
						</div>
						<div className="space-y-2">
							<h1 className="text-saastain-green font-bold text-2xl">Company Profile</h1>
							<p className="text-[#374151ß] text-sm">
								Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae
								vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
							</p>
						</div>
					</div>
					{isClimateRiskGenerated && (
						<div className="space-y-2 mt-10">
							<h1 className="text-saastain-green font-bold text-2xl">Climate Risk Summary</h1>
							<p className="text-[#374151ß] text-sm">
								Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae
								vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
							</p>
						</div>
					)}
					<div className="mt-10">
						<h1 className="text-saastain-green font-bold text-2xl">Sustainability Perfomance Targets</h1>
						<div className="border border-gray-300 rounded-lg mt-3">
							<div className="px-2 py-2.5 grid grid-cols-2 border-b border-gray-300 bg-[#F9FAFB] rounded-t-lg">
								<h1 className="uppercase">Sustainability perfomance target</h1>
								<h1 className="uppercase">Key Performance Indicators</h1>
							</div>
							{[...Array.from({ length: 6 })].map((_, idx) => (
								<div key={idx} className="px-2 py-3 grid grid-cols-2 border-b border-gray-300 last:border-none">
									<h1 className="text-sm">Sustainability perfomance target one here</h1>
									<h1 className="text-sm">Emissions Reductions</h1>
								</div>
							))}
						</div>
					</div>
					<div className="mt-10">
						<div className="space-y-2">
							<h1 className="font-bold text-2xl">SDGs</h1>
							<p className="text-[#374151ß] text-sm">
								Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
							</p>
						</div>
						<div className="mt-3">
							<div className="flex items-center gap-2 flex-wrap">
								{[...Array.from({ length: 4 })].map((_, idx) => (
									<Image src="/images/project/SDG-3.png" width={80} key={idx} />
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="col-auto md:col-span-3">
					<div className="border border-dashed border-primary flex items-center justify-center p-4 text-center rounded-xl cursor-pointer mt-2" {...getRootProps()}>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p>Drop files here ...</p>
						) : (
							<div className="flex flex-col items-center gap-3">
								<HiOutlineCloudUpload className="w-8 h-8" />
								<p className="text-primary">Click to upload your report or drag and drop</p>
							</div>
						)}
					</div>
					<div className="mt-5">
						<div className="bg-primary rounded-xl">
							<StrokedGaugeEmissions label="Climate Risk Score" value={81} />
						</div>
					</div>
					<div className="mt-5">
						<div className="px-3 py-3 rounded-xl border">
							<h1 className="font-bold text-base">Reports</h1>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<HiDocumentText />
									<p className="text-sm truncate">Credit Risk Report</p>
								</div>
								<Dropdown>
									<DropdownTrigger>
										<Button size="sm" isIconOnly variant="light">
											<HiDotsVertical />
										</Button>
									</DropdownTrigger>
									<DropdownMenu className="saastain font-nunito" aria-label="Docs Actions">
										<DropdownItem key="view">View</DropdownItem>
										<DropdownItem key="download">Download</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</div>
							<div className="mt-4">
								<div className="w-full h-[1px] bg-primary-500 my-4"></div>
								<div className="flex items-center justify-end">
									<Button size="sm" variant="bordered" color="primary">
										Download All
									</Button>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-5">
						<div className="px-3 py-3 rounded-xl border">
							<div className="flex items-center justify-between">
								<h1 className="font-bold text-base text-primary">Loan Summary</h1>
								<ChevronDown className="text-primary" />
							</div>
							<div className="mt-4 space-y-3">
								<div className="flex items-center justify-between">
									<p className="text-sm text-gray-500">Product Name</p>
									<p className="text-xs text-gray-800 truncate font-semibold">Meko Steam Cooking</p>
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm text-gray-500">Loan Type</p>
									<p className="text-xs text-gray-800 truncate font-semibold">Green Loan</p>
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm text-gray-500">Amount Requested</p>
									<p className="text-xs text-gray-800 truncate font-semibold">Ksh 4,000,000 </p>
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm text-gray-500">Industry</p>
									<p className="text-xs text-gray-800 truncate font-semibold">Clean Cooking</p>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-5">
						<div className="px-3 py-3 rounded-xl border">
							<div className="flex items-center justify-between">
								<h1 className="font-bold text-base text-primary">Green Lender</h1>
								<ChevronDown className="text-primary" />
							</div>
							<div className="mt-4 space-y-3">
								<div className="flex items-center gap-4">
									<HiUser className="w-5 h-5" />
									<p className="text-sm text-gray-700">Lender Name</p>
								</div>
								<div className="flex items-center gap-4">
									<HiMail className="w-5 h-5" />
									<p className="text-sm text-gray-700">lender@gmail.com</p>
								</div>
								<div className="flex items-center gap-4">
									<HiPhone className="w-5 h-5" />
									<p className="text-sm text-gray-700">+254 723 345 678</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoanRequestDetails;
