import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import CustomText from "@/components/typography/CustomText";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { Avatar, AvatarGroup, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, Chip, Divider, Progress, Tab, Tabs } from "@nextui-org/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { Key } from "@react-types/shared";
import { mitigationProjects } from "@/data/mitigation-projects";
import { MoreHorizontal, MoreHorizontalIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { MdAdd } from "react-icons/md";
import Link from "next/link";
import ComingSoon from "@/components/coming-soon";
import Head from "next/head";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";

const NetZeroLineChart = dynamic(() => import("@/components/charts/NetZeroLineChart"), { ssr: false });

const columns: IAppTableColumn[] = [
	{
		name: "Project",
		uid: "projectName",
	},
	{
		name: "Team",
		uid: "team",
	},
	{
		name: "Deadline",
		uid: "deadline",
	},
	{
		name: "Progress",
		uid: "progress",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const NetZero: NextPageWithLayout = () => {
	const renderCell = useCallback((item, columnKey: Key) => {
		const value = item[columnKey];

		if (columnKey === "actions") {
			return (
				<div className="flex space-x-2">
					<Button size="sm" color="primary">
						View
					</Button>
				</div>
			);
		}

		if (columnKey === "team") {
			return (
				<AvatarGroup isBordered>
					<Avatar size="sm" src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
					<Avatar size="sm" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
					<Avatar size="sm" src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
					<Avatar size="sm" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
					<Avatar size="sm" src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
				</AvatarGroup>
			);
		}

		return <CustomText>{value}</CustomText>;
	}, []);
	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem>Net Zero</BreadcrumbItem>
				<BreadcrumbItem>Overview</BreadcrumbItem>
			</Breadcrumbs>
			<Head>
				<title>Net Zero - SaaStain</title>
			</Head>
			<Tabs variant="underlined" aria-label="Net zero tabs" className="mt-8" color="primary">
				<Tab key={"overview"} title={<h2 className="text-lg font-semibold">Overview</h2>}>
					<div className="grid grid-cols-1 md:grid-cols-8 gap-4">
						<div className="col-span-6">
							<Card className="bg-[#FCF5EB] py-2 px-3">
								<CardBody className="flex flex-row justify-between items-center">
									<div className="space-y-4">
										<p className="font-normal text-[#5E896E]">Total positive impact so far</p>
										<h2 className="font-bold text-2xl text-[#5E896E]">35,000 kg CO2e</h2>
									</div>
									<Image src={"/images/greenhouse-effect-img1.png"} alt="Greenhouse Effect" width={60} height={60} />
								</CardBody>
								<CardFooter>
									<p className="text-xs">That's the same as manufacturing 13,860 plastic bootles</p>
								</CardFooter>
							</Card>
							<div className="mt-10">
								<NetZeroLineChart />
							</div>
							<div className="mt-10">
								<AppTable
									headerColumns={columns}
									data={mitigationProjects}
									count={mitigationProjects.length}
									renderCell={renderCell}
									title="Projects"
									isLoading={false}
									showBottomContent={false}
									showTopContent={false}
								/>
							</div>
						</div>
						<div className="col-span-2">
							<div className="flex">
								<Divider orientation="vertical" className="h-auto bg-gray-500" />
								<div>
									<div className="py-5 w-[250px] px-4 space-y-8 h-[200px]">
										<div className="flex justify-between items-start">
											<h1 className="text-2xl font-bold text-[#5E896E]">
												350
												<sup>
													tC0 <sub>2</sub>e{" "}
												</sup>{" "}
											</h1>
											<Chip size="sm" color="primary" endContent={<TrendingUpIcon className="w-3 h-3" />}>
												+1.5%
											</Chip>
										</div>
										<p className="text-[#5E896E]">Your Annual Target</p>
									</div>
									<Divider />
								</div>
							</div>
							<div className="flex">
								<Divider orientation="vertical" className="h-auto bg-gray-500" />
								<div>
									<div className="py-5 w-[250px] px-4 space-y-8 h-[200px]">
										<div className="flex justify-between items-start">
											<h1 className="text-2xl font-bold text-[#5E896E]">
												10<sup>%</sup>{" "}
											</h1>
											<Chip size="sm" color="primary" endContent={<TrendingUpIcon className="w-3 h-3" />}>
												+1.5%
											</Chip>
										</div>
										<p className="text-[#5E896E]">Year To Date Performance</p>
									</div>
									<Divider />
								</div>
							</div>
							<div className="flex">
								<Divider orientation="vertical" className="h-auto bg-gray-500" />
								<div>
									<div className="py-5 w-[250px] px-4 space-y-8 h-[200px]">
										<div className="flex justify-between items-start">
											<h1 className="text-2xl font-bold text-[#5E896E]">
												4350
												<sup>
													tC0 <sub>2</sub>e{" "}
												</sup>{" "}
											</h1>
											<Chip size="sm" color="danger" endContent={<TrendingDownIcon className="w-3 h-3" />}>
												-1.5%
											</Chip>
										</div>
										<p className="text-[#5E896E]">Emission Avoided Target</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Tab>
				<Tab key={"mitigation-plans"} title={<h2 className="text-lg font-semibold">Mitigations Plans</h2>}>
					<div className="my-4">
						<div className="flex items-center justify-between">
							<h1 className="text-2xl font-semibold">My Mitigation Plans</h1>
							<Button color="primary" startContent={<MdAdd className="w-6 h-6" />} as={Link} href="/action-plan/new-plan">
								New Plan
							</Button>
						</div>
						<div className="my-4 px-4 rounded-b-xl bg-[#F3FAF7] border-t-2 border-[#5E896E] py-5">
							<div className="flex justify-between">
								<div className="w-full px-3">
									<div className="flex items-center justify-between">
										<h3 className="font-semibold">Todo(2)</h3>
										<Button isIconOnly color="primary" variant="light" size="sm">
											<MoreHorizontalIcon />
										</Button>
									</div>
									<div className="bg-white rounded-xl shadow-lg px-6 py-5 space-y-5 mb-4">
										<p className="text-[#5E896E] font-semibold">Electrification of Fleet</p>
										<Progress value={0} color="primary" showValueLabel classNames={{ track: "bg-green-50" }} />
										<div className="bg-[#5E896E] rounded-xl px-3 py-2 space-y-3">
											<p className="text-[#EED2AD] font-light text-sm">Avg Marginal Cost</p>
											<p className="text-[#EED2AD] font-bold">-7.40$/tCO2e</p>
										</div>
										<div className="bg-green-100 rounded-xl px-3 py-2 space-y-3">
											<p className="text-green-800 font-light text-sm">Total Abatement Potential</p>
											<p className="text-green-800 font-bold">130,487tCO2e</p>
										</div>
										<div className="bg-green-100 rounded-xl px-3 py-2 space-y-3">
											<p className="text-green-800 font-light text-sm">Capex</p>
											<p className="text-green-800 font-bold">$8.675.01</p>
										</div>
									</div>
									<div className="bg-white rounded-xl shadow-lg px-6 py-5 space-y-5 mb-4">
										<p className="text-[#5E896E] font-semibold">Night Power Switch </p>
										<Progress value={0} color="primary" showValueLabel classNames={{ track: "bg-green-50" }} />
										<div className="bg-[#5E896E] rounded-xl px-3 py-2 space-y-3">
											<p className="text-[#EED2AD] font-light text-sm">Avg Marginal Cost</p>
											<p className="text-[#EED2AD] font-bold">-7.40$/tCO2e</p>
										</div>
										<div className="bg-green-100 rounded-xl px-3 py-2 space-y-3">
											<p className="text-green-800 font-light text-sm">Total Abatement Potential</p>
											<p className="text-green-800 font-bold">130,487tCO2e</p>
										</div>
										<div className="bg-green-100 rounded-xl px-3 py-2 space-y-3">
											<p className="text-green-800 font-light text-sm">Capex</p>
											<p className="text-green-800 font-bold">$8.675.01</p>
										</div>
									</div>
								</div>
								<div className="w-full px-3">
									<div className="flex items-center justify-between">
										<h3 className="font-semibold">In Progress (5)</h3>
										<Button isIconOnly color="primary" variant="light" size="sm">
											<MoreHorizontalIcon />
										</Button>
									</div>
									<div className="bg-white rounded-xl shadow-lg px-6 py-5 space-y-5 mb-4">
										<p className="text-[#5E896E] font-semibold">Night Power Switch </p>
										<Progress value={60} color="primary" showValueLabel classNames={{ track: "bg-green-50" }} />
										<div className="bg-[#5E896E] rounded-xl px-3 py-2 space-y-3">
											<p className="text-[#EED2AD] font-light text-sm">Avg Marginal Cost</p>
											<p className="text-[#EED2AD] font-bold">-7.40$/tCO2e</p>
										</div>
										<div className="bg-green-100 rounded-xl px-3 py-2 space-y-3">
											<p className="text-green-800 font-light text-sm">Total Abatement Potential</p>
											<p className="text-green-800 font-bold">130,487tCO2e</p>
										</div>
										<div className="bg-green-100 rounded-xl px-3 py-2 space-y-3">
											<p className="text-green-800 font-light text-sm">Capex</p>
											<p className="text-green-800 font-bold">$8.675.01</p>
										</div>
									</div>
									<div className="bg-white rounded-xl shadow-lg px-6 py-5 space-y-5 mb-4">
										<p className="text-[#5E896E] font-semibold">Night Power Switch </p>
										<Progress value={60} color="primary" showValueLabel classNames={{ track: "bg-green-50" }} />
										<div className="bg-[#5E896E] rounded-xl px-3 py-2 space-y-3">
											<p className="text-[#EED2AD] font-light text-sm">Avg Marginal Cost</p>
											<p className="text-[#EED2AD] font-bold">-7.40$/tCO2e</p>
										</div>
										<div className="bg-green-100 rounded-xl px-3 py-2 space-y-3">
											<p className="text-green-800 font-light text-sm">Total Abatement Potential</p>
											<p className="text-green-800 font-bold">130,487tCO2e</p>
										</div>
										<div className="bg-green-100 rounded-xl px-3 py-2 space-y-3">
											<p className="text-green-800 font-light text-sm">Capex</p>
											<p className="text-green-800 font-bold">$8.675.01</p>
										</div>
									</div>
								</div>
								<div className="w-full px-3">
									<div className="flex items-center justify-between">
										<h3 className="font-semibold">Completed (10)</h3>
										<Button isIconOnly color="primary" variant="light" size="sm">
											<MoreHorizontalIcon />
										</Button>
									</div>
									<div className="bg-white rounded-xl shadow-lg px-6 py-5 space-y-5 mb-4">
										<p className="text-[#5E896E] font-semibold">Green electrification plan </p>
										<Progress value={100} color="primary" showValueLabel classNames={{ track: "bg-green-50" }} />
										<div className="bg-[#5E896E] rounded-xl px-3 py-2 space-y-3">
											<p className="text-[#EED2AD] font-light text-sm">Avg Marginal Cost</p>
											<p className="text-[#EED2AD] font-bold">-7.40$/tCO2e</p>
										</div>
										<div className="bg-green-100 rounded-xl px-3 py-2 space-y-3">
											<p className="text-green-800 font-light text-sm">Total Abatement Potential</p>
											<p className="text-green-800 font-bold">130,487tCO2e</p>
										</div>
										<div className="bg-green-100 rounded-xl px-3 py-2 space-y-3">
											<p className="text-green-800 font-light text-sm">Capex</p>
											<p className="text-green-800 font-bold">$8.675.01</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Tab>
				<Tab key={"track"} title={<h2 className="text-lg font-semibold">Track</h2>}>
					<ComingSoon />
				</Tab>
			</Tabs>
		</AuthRedirectComponent>
	);
};

NetZero.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default NetZero;
