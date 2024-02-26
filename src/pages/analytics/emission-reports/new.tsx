import CustomText from "@/components/typography/CustomText";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { Breadcrumbs, BreadcrumbItem, Tabs, Tab, Divider, Chip, Card, CardHeader, CardBody } from "@nextui-org/react";
import { ExternalLinkIcon, TrendingUp } from "lucide-react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { FaFileArrowDown } from "react-icons/fa6";
import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/helpers";

const RadialChartEmissions = dynamic(() => import("@/components/charts/RadialChartEmissions"), { ssr: false });
const StrokedGaugeEmissions = dynamic(() => import("@/components/charts/StrokedGaugeEmissions"), { ssr: false });
const EmissionsOverYearBarChart = dynamic(() => import("@/components/charts/EmissionsOverYearBarChart"), { ssr: false });
const EmissionsDonutChart = dynamic(() => import("@/components/charts/EmissionsDonutChart"), { ssr: false });
const EmissionsAreaLIneChart = dynamic(() => import("@/components/charts/EmissionsAreaLIneChart"), { ssr: false });
const EmissionsScope2DonutChart = dynamic(() => import("@/components/charts/EmissionsScope2DonutChart"), { ssr: false });

const locations = ["All Locations", "Location 1", "Location 2", "Location 3"];
const years = ["2024", "2023", "2022", "2021"];

const NewEmissionReports: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Emission Reports</title>
			</Head>
			<Breadcrumbs>
				<BreadcrumbItem>Reports</BreadcrumbItem>
				<BreadcrumbItem>Emission Reports</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-10">
				<Tabs aria-label="Emission Reports" variant="underlined" color="primary">
					<Tab key={"emissions-overview"} title="Emissions Overview">
						<div className="my-4 py-2 md:py-5 bg-[#FCF5EB] shadow-xl rounded-2xl border border-gray-200">
							<div className="py-2 px-5 mb-4">
								<h3 className="font-bold">Emission Breakdown</h3>
							</div>
							<div className="px-6 md:px-12">
								<div className="flex justify-between flex-col md:flex-row">
									<TopCardItem title="Total Emission" value="100" />
									<Divider orientation="vertical" className="h-auto bg-[#97b79a] hidden md:block" />
									<TopCardItem title="Total Scope 1" value="89" />
									<Divider orientation="vertical" className="h-auto bg-[#97b79a] hidden md:block" />
									<TopCardItem title="Total Scope 2" value="11" />
									<Divider orientation="vertical" className="h-auto bg-[#97b79a] hidden md:block" />
									<TopCardItem title="Total Scope 3" value="7" />
								</div>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-8 gap-4 mt-10">
							<div className="col-auto md:col-span-6">
								<div className="space-y-5">
									<div className="bg-white rounded-xl shadow-sm">
										<div className="flex flex-row items-center">
											<RadialChartEmissions />
											<div className="space-y-2">
												<RadialChartStats value={44} label="Stationary Combustion" color="#58A9FB" />
												<RadialChartStats value={55} label="Fugitive Emissions" color="#00E396" />
												<RadialChartStats value={67} label="Process Emission" color="#FF9800" />
												<RadialChartStats value={83} label="Fleet Emissions" color="#03543F" />
												<RadialChartStats value={90} label="Heat & Steam" color="#1C64F2" />
												<RadialChartStats value={100} label="Electricity" color="#40D4D4" />
											</div>
										</div>
									</div>
									<div className="px-3 bg-white rounded-xl shadow-md py-4">
										<div className="px-3">
											<h3 className="font-bold">Emissions Over Year</h3>
										</div>
										<EmissionsOverYearBarChart />
									</div>
								</div>
							</div>
							<div className="col-auto md:col-span-2">
								<div className="space-y-5">
									<div className="bg-primary rounded-xl">
										<StrokedGaugeEmissions />
									</div>
									<Card className="bg-[#FCF5EB] py-5 px-3">
										<CardHeader className="font-bold">Equivalence Relation</CardHeader>
										<CardBody className="space-y-5">
											<div className="flex items-start space-x-2">
												<div className="p-2 bg-[#CFA16C] rounded-xl text-white">190</div>
												<div className="space-y-1">
													<p className="text-xs text-primary">Equivalent to</p>
													<h3 className="text-primary">Acres of Forests</h3>
												</div>
											</div>
											<div className="flex items-start space-x-2">
												<div className="p-2 bg-[#CFA16C] rounded-xl text-white">201</div>
												<div className="space-y-1">
													<p className="text-xs text-primary">Equivalent to</p>
													<h3 className="text-primary">Powering of Houses</h3>
												</div>
											</div>
											<div className="flex items-start space-x-2">
												<div className="p-2 bg-[#CFA16C] rounded-xl text-white">3201</div>
												<div className="space-y-1">
													<p className="text-xs text-primary">Equivalent to</p>
													<h3 className="text-primary">Charging of Smart Phones</h3>
												</div>
											</div>
										</CardBody>
									</Card>
									<Card className="py-5 px-3">
										<CardHeader>
											<div className="flex items-center justify-between w-full">
												<h2 className="text-lg font-semibold">Actions</h2>
												<ExternalLinkIcon className="w-5 h-5 ml-auto text-[#5E896E]" />
											</div>
										</CardHeader>
										<CardBody>
											<div className="flex space-x-5 items-center">
												<FaFileArrowDown className="w-8 h-8 text-primary" />
												<p>Export PDF</p>
											</div>
											<div className="mt-4">
												<p className="text-primary-200">Export this report in pdf</p>
											</div>
										</CardBody>
									</Card>
								</div>
							</div>
						</div>
					</Tab>
					<Tab key={"scope-one"} title="Scope 1">
						<div className="flex items-center justify-between gap-8">
							<AppSelect label="Choose a location" options={generateOptions(locations)} />
							<AppSelect label="Choose a year" placeholder="FY2024" options={generateOptions(years)} />
						</div>
						<div className="mt-10 bg-white px-3 py-4 rounded-xl">
							<div className="my-4 pl-5">
								<h2 className="font-semibold text-xl">Your Scope Breakdown</h2>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
								<EmissionsDonutChart />
								<div className="flex items-start w-full">
									<Divider orientation="vertical" className="h-auto md:h-[250px] w-[2px] bg-primary" />
									<div className="px-2 w-full">
										<div className="flex items-center justify-between bg-gray-100 w-full px-4 py-3 rounded-t-xl">
											<p className="text-sm font-semibold">Emission Breakdown</p>
											<p className="text-sm font-semibold">Emission tCO2e</p>
										</div>
										<div className="py-3 px-4 space-y-8">
											<div className="flex items-center justify-between w-full">
												<div className="flex items-center space-x-3">
													<div className="w-4 h-4 bg-red-500 rounded-full"></div>
													<span className="text-sm">Stationary Combustion</span>
												</div>
												<div className="flex items-center space-x-2">
													<p className="text-sm">24000</p>
													<span>
														<Chip size="sm" color="success">
															<CustomText className="text-white">15%</CustomText>
														</Chip>
													</span>
												</div>
											</div>
											<div className="flex items-center justify-between w-full">
												<div className="flex items-center space-x-3">
													<div className="w-4 h-4 bg-[#CFA16C] rounded-full"></div>
													<span className="text-sm">Fugitive Emissions</span>
												</div>
												<div className="flex items-center space-x-2">
													<p className="text-sm">24000</p>
													<span>
														<Chip size="sm" color="success">
															<CustomText className="text-white">15%</CustomText>
														</Chip>
													</span>
												</div>
											</div>
											<div className="flex items-center justify-between w-full">
												<div className="flex items-center space-x-3">
													<div className="w-4 h-4 bg-[#3F83F8] rounded-full"></div>
													<span className="text-sm">Process Emissions</span>
												</div>
												<div className="flex items-center space-x-2">
													<p className="text-sm">24000</p>
													<span>
														<Chip size="sm" color="success">
															<CustomText className="text-white">15%</CustomText>
														</Chip>
													</span>
												</div>
											</div>
											<div className="flex items-center justify-between w-full">
												<div className="flex items-center space-x-3">
													<div className="w-4 h-4 bg-[#5E896E] rounded-full"></div>
													<span className="text-sm">Fleet Emissions</span>
												</div>
												<div className="flex items-center space-x-2">
													<p className="text-sm">24000</p>
													<span>
														<Chip size="sm" color="success">
															<CustomText className="text-white">15%</CustomText>
														</Chip>
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-10 grid grid-cols-1 md:grid-cols-8 gap-4">
							<div className="col-auto md:col-span-6">
								<div className="px-3 py-4 bg-white rounded-xl">
									<div className="pl-4">
										<h3 className="font-semibold">Progress Tracking</h3>
									</div>
									<EmissionsAreaLIneChart />
								</div>
							</div>
							<div className="col-auto md:col-span-2">
								<div className="space-y-4">
									<div className="bg-primary rounded-xl">
										<StrokedGaugeEmissions />
									</div>
									<Card className="py-5 px-3">
										<CardHeader>
											<div className="flex items-center justify-between w-full">
												<h2 className="text-lg font-semibold">Actions</h2>
												<ExternalLinkIcon className="w-5 h-5 ml-auto text-[#5E896E]" />
											</div>
										</CardHeader>
										<CardBody>
											<div className="flex space-x-5 items-center">
												<FaFileArrowDown className="w-8 h-8 text-primary" />
												<p>Export PDF</p>
											</div>
											<div className="mt-4">
												<p className="text-primary-200">Export this report in pdf</p>
											</div>
										</CardBody>
									</Card>
								</div>
							</div>
						</div>
					</Tab>
					<Tab key={"scope-two"} title={"Scope 2"}>
						<div className="flex items-center justify-between gap-8">
							<AppSelect label="Choose a location" options={generateOptions(locations)} />
							<AppSelect label="Choose a year" placeholder="FY2024" options={generateOptions(years)} />
						</div>
						<div className="mt-10">
							<div className="bg-white px-3 py-4 rounded-xl">
								<div className="my-4 pl-5">
									<h2 className="font-semibold text-xl">Your Scope Breakdown</h2>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
									<EmissionsScope2DonutChart />
									<div className="flex items-start w-full">
										<Divider orientation="vertical" className="h-auto md:h-[250px] w-[2px] bg-primary" />
										<div className="px-2 w-full">
											<div className="flex items-center justify-between bg-gray-100 w-full px-4 py-3 rounded-t-xl">
												<p className="text-sm font-semibold">Emission Breakdown</p>
												<p className="text-sm font-semibold">Emission tCO2e</p>
											</div>
											<div className="py-3 px-4 space-y-8">
												<div className="flex items-center justify-between w-full">
													<div className="flex items-center space-x-3">
														<div className="w-4 h-4 bg-primary rounded-full"></div>
														<span className="text-sm">Electricity</span>
													</div>
													<div className="flex items-center space-x-2">
														<p className="text-sm">74000</p>
														<span>
															<Chip size="sm" color="success">
																<CustomText className="text-white">15%</CustomText>
															</Chip>
														</span>
													</div>
												</div>
												<div className="flex items-center justify-between w-full">
													<div className="flex items-center space-x-3">
														<div className="w-4 h-4 bg-red-500 rounded-full"></div>
														<span className="text-sm">Heat & Cooling</span>
													</div>
													<div className="flex items-center space-x-2">
														<p className="text-sm">25100</p>
														<span>
															<Chip size="sm" color="success">
																<CustomText className="text-white">15%</CustomText>
															</Chip>
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-10 grid grid-cols-1 md:grid-cols-8 gap-4">
								<div className="col-auto md:col-span-6">
									<div className="px-3 py-4 bg-white rounded-xl">
										<div className="pl-4">
											<h3 className="font-semibold">Progress Tracking</h3>
										</div>
										<EmissionsAreaLIneChart />
									</div>
								</div>
								<div className="col-auto md:col-span-2">
									<div className="space-y-4">
										<div className="bg-primary rounded-xl">
											<StrokedGaugeEmissions />
										</div>
										<Card className="py-5 px-3">
											<CardHeader>
												<div className="flex items-center justify-between w-full">
													<h2 className="text-lg font-semibold">Actions</h2>
													<ExternalLinkIcon className="w-5 h-5 ml-auto text-[#5E896E]" />
												</div>
											</CardHeader>
											<CardBody>
												<div className="flex space-x-5 items-center">
													<FaFileArrowDown className="w-8 h-8 text-primary" />
													<p>Export PDF</p>
												</div>
												<div className="mt-4">
													<p className="text-primary-200">Export this report in pdf</p>
												</div>
											</CardBody>
										</Card>
									</div>
								</div>
							</div>
						</div>
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

const TopCardItem = ({ title, value }: { title: string; value: string }) => {
	return (
		<div className="space-y-4">
			<div className="flex items-center space-x-2">
				<p className="font-semibold text-primary text-sm">{title}</p>
				<Chip size="sm" color="primary">
					<div className="flex items-center space-x-1">
						<CustomText>--%</CustomText>
						<TrendingUp size={16} className="font-bold" />
					</div>
				</Chip>
			</div>
			<h3 className="text-2xl font-bold">
				{value}{" "}
				<span className="text-[#A7B3A7]">
					tCO<sub>2</sub>e
				</span>{" "}
			</h3>
		</div>
	);
};

const RadialChartStats = ({ value, label, color }: { value: number; label: string; color: string }) => {
	return (
		<div className="flex space-x-1">
			<Divider orientation="vertical" className="h-auto w-1" style={{ backgroundColor: color }} />
			<div className="space-y-1">
				<p className="text-xs">{value}</p>
				<p className="text-xs">{label}</p>
			</div>
		</div>
	);
};

NewEmissionReports.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default NewEmissionReports;
