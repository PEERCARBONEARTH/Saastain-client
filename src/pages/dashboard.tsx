import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/helpers";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Spacer } from "@nextui-org/react";
import { MdAdd } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import dynamic from "next/dynamic";
import { HiExternalLink } from "react-icons/hi";
import { HiOutlineArrowDownCircle, HiOutlineArrowUpCircle } from "react-icons/hi2";
import Head from "next/head";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import { ScopeDataKeys, TScopeOneDataTotals, TScopeTwoDataTotals } from "@/types/Analytics";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";

const DashboardDonutChart = dynamic(() => import("@/components/charts/DashboardDonutChart"), { ssr: false });

const AppDashboard: NextPageWithLayout = () => {
	const [selectedYear, setSelectedYear] = useState("2024");
	const { data: scopeOneTotals } = useSWR<TScopeOneDataTotals>([IApiEndpoint.GET_TOTAL_SCOPE_ONE_DATA_BY_YEAR, { year: selectedYear }], swrFetcher, { keepPreviousData: true });
	const { data: scopeTwoTotals } = useSWR<TScopeTwoDataTotals>([IApiEndpoint.GET_TOTAL_SCOPE_TWO_DATA_BY_YEAR, { year: selectedYear }], swrFetcher, { keepPreviousData: true });

	const totalEmissions = useMemo(() => {
		if (scopeOneTotals === undefined || scopeTwoTotals === undefined) return 0;
		// all emissions
		const { bioEnergy, fuels, fugitive, processEmission, fleet } = scopeOneTotals[ScopeDataKeys.CURRENT_YEAR];
		const { electricityTotal, heatAndSteamTotal } = scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR];

		let total = bioEnergy + fuels + fugitive + processEmission + fleet + electricityTotal + heatAndSteamTotal;

		// ensure to  3 decimal places
		return total.toFixed(3);
	}, [scopeOneTotals, scopeTwoTotals]);

	const totalScopeOne = useMemo(() => {
		if (scopeOneTotals === undefined) return 0;

		const { bioEnergy, fuels, fugitive, processEmission, fleet } = scopeOneTotals[ScopeDataKeys.CURRENT_YEAR];

		let total = bioEnergy + fuels + fugitive + processEmission + fleet;

		// ensure to  3 decimal places
		return total.toFixed(3);
	}, [scopeOneTotals]);

	const totalScopeTwo = useMemo(() => {
		if (scopeTwoTotals === undefined) return 0;
		const { electricityTotal, heatAndSteamTotal } = scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR];

		let total = electricityTotal + heatAndSteamTotal;

		// ensure to  3 decimal places
		return total.toFixed(3);
	}, [scopeTwoTotals]);

	return (
		<AuthRedirectComponent>
			<Head>
				<title>Dashboard - SaaStain</title>
			</Head>
			<h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
			<div className="flex flex-col md:flex-row items-center justify-between my-4">
				<AppSelect label="Choose a branch" options={generateOptions(["Branch 1", "Branch 2", "Branch 3"])} baseClassName="md:max-w-[300px]" placeholder="All branches" />
				<Spacer y={6} className="md:hidden" />
				<AppSelect
					label="Choose a year"
					options={generateOptions(["2021", "2022", "2023", "2024"].reverse())}
					baseClassName="md:max-w-[300px]"
					placeholder="FY2024"
					value={selectedYear}
					onChange={(e) => setSelectedYear(e.target.value)}
				/>
			</div>
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between my-4 space-y-4 md:space-y-0">
				<h1 className="text-2xl font-bold">
					Carbon Footprints record in <span className="text-[#669679]">FY{selectedYear}</span> for <span className="text-[#669679]">All Branches</span>{" "}
				</h1>
				<div className="flex space-x-2">
					<Button color="primary" startContent={<MdAdd className="w-4 h-4" />} size="sm" variant="bordered" as={Link} href={AppEnumRoutes.APP_ADD_DATA}>
						Add
					</Button>
					<Button color="primary" startContent={<FaRegSave className="w-4 h-4" />} size="sm">
						Export
					</Button>
				</div>
			</div>
			<div className="my-4 py-2 md:py-3 bg-white shadow-xl rounded-2xl border border-gray-200">
				<div className="px-2 md:px-12">
					<div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0">
						<div className="space-y-4">
							<p className="font-normal">Total Emission</p>
							<h3 className="text-2xl font-bold">
								{totalEmissions}{" "}
								<span className="text-[#A7B3A7]">
									tCO<sub>2</sub>e
								</span>{" "}
							</h3>
						</div>
						<Divider orientation="vertical" className="h-auto bg-[#97b79a] hidden md:block" />
						<div className="space-y-4">
							<p className="font-normal">Your Total Positive Impact</p>
							<h3 className="text-2xl font-bold">
								7{" "}
								<span className="text-[#A7B3A7]">
									tCO<sub>2</sub>e
								</span>
							</h3>
						</div>
						<Divider orientation="vertical" className="h-auto bg-[#97b79a] hidden md:block" />
						<div className="space-y-4">
							<p className="font-normal">Your Reductions</p>
							<h3 className="text-2xl font-bold">
								10{" "}
								<span className="text-[#A7B3A7]">
									tCO<sub>2</sub>e
								</span>{" "}
							</h3>
						</div>
					</div>
				</div>
			</div>
			<div className="my-4 py-2 md:py-3 bg-white shadow-xl rounded-2xl border border-gray-200 mt-10 px-4 md:px-8">
				<div className="flex justify-between flex-col md:flex-row">
					<div>
						<h1 className="text-lg font-semibold mt-4">Scope Break Down</h1>
						<div className="flex flex-col md:flex-row my-3 items-center">
							<div className="space-y-8">
								<div className="flex space-x-8">
									<Divider orientation="vertical" className="h-auto bg-[#5E896E] w-2" />
									<div className="space-y-4">
										<p className="text-[#A7B3A7] text-[14px]">Scope 1 - Direct Emissions</p>
										<p className="text-[#374151] font-bold text-[30px]">
											{totalScopeOne} <span className="text-sm">tCO2</span>
										</p>
									</div>
								</div>
								<div className="flex space-x-8">
									<Divider orientation="vertical" className="h-auto bg-[#CFA16C] w-2" />
									<div className="space-y-4">
										<p className="text-[#A7B3A7] text-[14px]">Scope 2 - Indirect Emissions</p>
										<p className="text-[#374151] font-bold text-[30px]">
											{totalScopeTwo} <span className="text-sm">tCO2</span>
										</p>
									</div>
								</div>
								<div className="flex space-x-8">
									<Divider orientation="vertical" className="h-auto bg-[#014737] w-2" />
									<div className="space-y-4">
										<p className="text-[#014737] text-[14px]">Scope 3 - Other Indirect Emissions</p>
										<p className="text-[#374151] font-bold text-[30px]">
											0 <span className="text-sm">tCO2</span>
										</p>
									</div>
								</div>
							</div>
							<DashboardDonutChart dataSeries={[Number(totalScopeOne) ?? 0, Number(totalScopeTwo) ?? 0, 0]} />
						</div>
					</div>
					<Divider orientation="vertical" className="h-auto bg-[#97b79a]" />
					<div className="py-8 flex space-x-4">
						<div className="w-[130px] bg-[#5E896E] max-h-[300px] h-full rounded-xl flex flex-col items-center justify-between p-4">
							<p className="text-white">{totalScopeOne}t</p>
							<p className="text-xs text-white">Scope 1</p>
						</div>
						<div className="w-[130px] bg-[#CFA16C] max-h-[300px] h-full rounded-xl flex flex-col items-center justify-between p-4">
							<p className="text-white">{totalScopeTwo}t</p>
							<p className="text-xs text-white">Scope 2</p>
						</div>
						<div className="w-[78px] bg-[#014737] max-h-[300px] h-auto md:h-full rounded-xl flex flex-col items-start justify-between p-4">
							<p className="text-white">45t</p>
							<p className="text-xs text-white">Scope 3</p>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row items-center justify-between mt-10 space-y-5 md:space-y-4">
				<Card className="max-w-[350px] w-full">
					<CardHeader className="flex">
						<h3>Net Zero</h3>
						<HiExternalLink className="w-5 h-5 ml-auto text-[#5E896E]" />
					</CardHeader>
					<CardBody>
						<div className="flex items-center space-x-4">
							<HiOutlineArrowUpCircle className="text-[#5E896E] w-10 h-10" />
							<p className="text-2xl font-bold">1.3% above</p>
						</div>
					</CardBody>
					<CardFooter>
						<p className="text-sm text-gray-500">
							Industry average : 98t CO<sub>2</sub>e
						</p>
					</CardFooter>
				</Card>
				<Card className="max-w-[350px] w-full">
					<CardHeader className="flex">
						<h3>Benchmarks</h3>
						<HiExternalLink className="w-5 h-5 ml-auto text-[#5E896E]" />
					</CardHeader>
					<CardBody>
						<div className="flex items-center space-x-4">
							<HiOutlineArrowDownCircle className="text-red-500 w-10 h-10" />
							<p className="text-2xl font-bold">10% below</p>
						</div>
					</CardBody>
					<CardFooter>
						<p className="text-sm text-gray-500">
							Competitor average : 90t CO<sub>2</sub>e
						</p>
					</CardFooter>
				</Card>
				<Card className="max-w-[350px] w-full">
					<CardHeader className="flex">
						<h3>Baseline Year</h3>
						<HiExternalLink className="w-5 h-5 ml-auto text-[#5E896E]" />
					</CardHeader>
					<CardBody>
						<div className="flex items-center space-x-4">
							<HiOutlineArrowUpCircle className="text-[#5E896E] w-10 h-10" />
							<p className="text-2xl font-bold">1.3% above</p>
						</div>
					</CardBody>
					<CardFooter>
						<p className="text-sm text-gray-500">
							Baseline emissions : 50t CO<sub>2</sub>e
						</p>
					</CardFooter>
				</Card>
			</div>
		</AuthRedirectComponent>
	);
};

AppDashboard.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default AppDashboard;
