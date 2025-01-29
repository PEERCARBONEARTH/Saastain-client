"use client";
import CustomText from "@/components/typography/CustomText";
import { Breadcrumbs, BreadcrumbItem, Tabs, Tab, Divider, Chip, Card, CardHeader, CardBody, Button, Checkbox, } from "@nextui-org/react";
import { ExternalLinkIcon, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
import { FaFileArrowDown } from "react-icons/fa6";
import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/helpers";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { useEffect, useMemo, useState } from "react";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import useDidHydrate from "@/hooks/useDidHydrate";
import toast from "react-hot-toast";
import { IApiEndpoint, getEndpoint } from "@/types/Api";
import { useSession } from "next-auth/react";
import axios from "axios";
import { API_URL } from "@/env";
import DownloadEmissionsModal from "@/components/modals/DownloadEmissionsReportModal";
import { HiInformationCircle } from "react-icons/hi";
import StrokedGaugeRadicalEmissions from "@/components/charts/StrokedGaugeRadicalChart";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import ApexHorizontaChart from "@/components/charts/HorizontalChart";
import ApexChart from "@/components/charts/ColumnChart";
import ApexColumnStackedChart from "@/components/charts/ColumnAllScopeChart";
import { IoIosArrowRoundForward } from "react-icons/io";
import EquipmentPieChart from "@/components/charts/EquipmentPieChart";

const RadialChartEmissions = dynamic(() => import("@/components/charts/RadialChartEmissions"), { ssr: false });
const StrokedGaugeEmissions = dynamic(() => import("@/components/charts/StrokedGaugeEmissions"), { ssr: false });
const EmissionsOverYearBarChart = dynamic(() => import("@/components/charts/EmissionsOverYearBarChart"), { ssr: false });
const EmissionsDonutChart = dynamic(() => import("@/components/charts/EmissionsDonutChart"), { ssr: false });
const EmissionsAreaLIneChart = dynamic(() => import("@/components/charts/EmissionsAreaLIneChart"), { ssr: false });
const EmissionsScope2DonutChart = dynamic(() => import("@/components/charts/EmissionsScope2DonutChart"), { ssr: false });

const locations = ["All Locations", "Location 1", "Location 2", "Location 3"];
const years = ["2024", "2023", "2022", "2021"];

enum ScopeDataKeys {
	CURRENT_YEAR = "current-year",
	BASE_YEAR = "base-year",
}

interface ScopeOneDataValues {
	bioEnergy: number;
	fuels: number;
	fugitive: number;
	processEmission: number;
	fleet: number;
}

interface ScopeTwoDataValues {
	electricityTotal: number;
	heatAndSteamTotal: number;
	cooling: number;
	year: number;
}

type TScopeOneDataTotals = {
	[ScopeDataKeys.CURRENT_YEAR]: ScopeOneDataValues;
	[ScopeDataKeys.BASE_YEAR]: ScopeOneDataValues;
};

type TScopeTwoDataTotals = {
	[ScopeDataKeys.CURRENT_YEAR]: ScopeTwoDataValues;
	[ScopeDataKeys.BASE_YEAR]: ScopeTwoDataValues;
};

interface ScopeOneMonthlyData {
	totalCo2EmittedBioEnergy: string | null;
	totalCo2EmittedFuels: string | null;
	totalCo2EmittedFugitive: string | null;
	totalCo2EmittedProcessEmission: string | null;
	totalCo2EmittedVehicles: string | null;
	month: number;
}

interface ScopeTwoMonthlyData {
	month: number;
	value: number;
}

type TScopeOneMonthlyData = {
	[ScopeDataKeys.CURRENT_YEAR]: ScopeOneMonthlyData[];
	[ScopeDataKeys.BASE_YEAR]: ScopeOneMonthlyData[];
};

type TScopeTwoMonthlyData = {
	[ScopeDataKeys.CURRENT_YEAR]: ScopeTwoMonthlyData[];
	[ScopeDataKeys.BASE_YEAR]: ScopeTwoMonthlyData[];
};

// month is 1 based to match the month number
const matchNumberToMonth = (month: number) => {
	switch (month) {
		case 1:
			return "January";
		case 2:
			return "February";
		case 3:
			return "March";
		case 4:
			return "April";
		case 5:
			return "May";
		case 6:
			return "June";
		case 7:
			return "July";
		case 8:
			return "August";
		case 9:
			return "September";
		case 10:
			return "October";
		case 11:
			return "November";
		case 12:
			return "December";
		default:
			return "";
	}
};

const prepareScopeOneMonthlyDataTest = (data: TScopeOneMonthlyData) => {
	if (!data) {
		return {
			labels: [],
			series: [],
		};
	}
	const currentScopeOneMonthlyData = data[ScopeDataKeys.CURRENT_YEAR] as ScopeOneMonthlyData[];

	if (currentScopeOneMonthlyData?.length === 0) {
		return {
			labels: [],
			series: [],
		};
	}

	// Create an array of all months
	const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

	// Create a map of month to data
	const monthDataMap = new Map<number, number>();
	currentScopeOneMonthlyData.forEach(({ month, ...rest }) => {
		const values = Object.values(rest).filter((val) => val !== null) as string[];
		const numVals = values.map(Number);
		const summedNums = numVals.reduce((acc, cur) => acc + cur, 0);
		monthDataMap.set(month, Number(summedNums.toFixed(0)));
	});

	// Generate labels and series in the correct order
	const labels = allMonths.map((month) => matchNumberToMonth(month));
	const series = allMonths.map((month) => monthDataMap.get(month) || 0);

	return {
		labels,
		series,
	};
};

const prepareScopeTwoMonthlyTest = (data: TScopeTwoMonthlyData) => {
	if (!data) {
		return {
			labels: [],
			series: [],
		};
	}
	const currentScopeTwoMonthlyData = data[ScopeDataKeys.CURRENT_YEAR] as ScopeTwoMonthlyData[];

	if (currentScopeTwoMonthlyData?.length === 0) {
		return {
			labels: [],
			series: [],
		};
	}

	// Create an array of all months
	const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

	// Create a map of month to data
	const monthDataMap = new Map<number, number>();
	currentScopeTwoMonthlyData.forEach(({ month, value }) => {
		monthDataMap.set(month, value);
	});

	// Generate labels and series in the correct order
	const labels = allMonths.map((month) => matchNumberToMonth(month));
	const series = allMonths.map((month) => monthDataMap.get(month) || 0);

	return {
		labels,
		series,
	};
};

const CategoryEmissionsColumns: IAppTableColumn[] = [
	{
		name: "select",
		uid: "select",
	},
	{
		name: "CATEGORY",
		uid: "category",
	},
	{
		name: "Emission Factor",
		uid: "emissionFactor",
	},
	{
		name: "2021 TCO2e",
		uid: "2021",
	},
	{
		name: "2022 TCO2e",
		uid: "2022",
	},
	{
		name: "2023 TCO2e",
		uid: "2023",
	}
];

const data = [
	{
		name: 'Stationary Emission',
		value: 70,
		fill: '#8884d8'
	},
	{
		name: 'Fleet Emission',
		value: 50,
		fill: '#FFA5DA'
	},
	{
		name: 'Process Emission',
		value: 90,
		fill: '#0096FF'
	},
	{
		name: 'Fugitive Emission',
		value: 90,
		fill: '#5BD222'
	}

];

const emissionsDataPerYear = [
	{
		id: "1",
		category: "Stationary Combustion",
		emissionFactor: "2.6",
		"2021": 12543.8,
		"2022": 13287.5,
		"2023": 12876.3
	},
	{
		id: "2",
		category: "Mobile Combustion",
		emissionFactor: "2.3",
		"2021": 8765.4,
		"2022": 9234.6,
		"2023": 8987.2
	},
	{
		id: "3",
		category: "Process Emissions",
		emissionFactor: "1.8",
		"2021": 15678.9,
		"2022": 14567.8,
		"2023": 13987.6
	},
	{
		id: "4",
		category: "Fugitive Emissions",
		emissionFactor: "0.4",
		"2021": 5432.1,
		"2022": 5678.9,
		"2023": 5234.5
	},
	{
		id: "5",
		category: "Agricultural Sources",
		emissionFactor: "0.9",
		"2021": 34,
		"2022": 3789.4,
		"2023": 3567.8
	},
];

interface ICategoryEmissions {
	id: string;
	category: string;
	emissionFactor: string;
	"2021": number;
	"2022": number;
	"2023": number;
}



const computeScopeOneItemPercent = (value: number, total: number) => {
	return (value / total) * 100;
};

const generateSlug = (companyName: string): string => {
	return companyName.toLowerCase().replace(/\s+/g, "-");
};

const EmissionReports = () => {
	const [scopeTwoTotals, setScopeTwoTotals] = useState<TScopeTwoDataTotals>({
		[ScopeDataKeys.CURRENT_YEAR]: {
			electricityTotal: 0,
			heatAndSteamTotal: 0,
			cooling: 0,
			year: 2024,
		},
		[ScopeDataKeys.BASE_YEAR]: {
			electricityTotal: 0,
			heatAndSteamTotal: 0,
			cooling: 0,
			year: 2023,
		},
	});

	const [scopeOneTotals, setScopeOneTotals] = useState<TScopeOneDataTotals>({
		[ScopeDataKeys.CURRENT_YEAR]: {
			bioEnergy: 0,
			fuels: 0,
			fugitive: 0,
			processEmission: 0,
			fleet: 0,
		},
		[ScopeDataKeys.BASE_YEAR]: {
			bioEnergy: 0,
			fuels: 0,
			fugitive: 0,
			processEmission: 0,
			fleet: 0,
		},
	});

	const [scopeOneMonthlyData, setScopeOneMonthlyData] = useState<TScopeOneMonthlyData>({
		[ScopeDataKeys.CURRENT_YEAR]: [],
		[ScopeDataKeys.BASE_YEAR]: [],
	});

	const [scopeTwoMonthlyData, setScopeTwoMonthlyData] = useState<TScopeTwoMonthlyData>({
		[ScopeDataKeys.CURRENT_YEAR]: [],
		[ScopeDataKeys.BASE_YEAR]: [],
	});

	const { getScopeOneTotalDataByYear, getScopeTwoTotalDataByYear, getScopeOneTotalDataByYearMonthly, getScopeTwoTotalDataByYearMonthly } = useAccountingDataUtils();
	const { didHydrate } = useDidHydrate();
	const { data: session, status } = useSession();
	const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

	const openDownloadModal = () => {
		setIsDownloadModalOpen(true);
	};

	const closeDownloadModal = () => {
		setIsDownloadModalOpen(false);
	};

	const userInfo = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const fetchScopeOneData = async () => {
		try {
			const resp = await getScopeOneTotalDataByYear<TScopeOneDataTotals>({ year: "2024" });

			if (resp?.status === "success") {
				setScopeOneTotals(resp.data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const fetchScopeTwoData = async () => {
		try {
			const resp = await getScopeTwoTotalDataByYear<TScopeTwoDataTotals>({ year: "2024" });

			if (resp?.status === "success") {
				setScopeTwoTotals(resp.data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));

	// Modify the renderEmissionsDataCell function to handle the checkbox column
	const renderEmissionsDataCell = (item: ICategoryEmissions, columnKey: string) => {
		switch (columnKey) {
			case "select":
				return (
					<Checkbox
						isSelected={selectedKeys.has(item.id)}
						onValueChange={(isSelected) => {
							const newSelected = new Set(selectedKeys);
							if (isSelected) {
								newSelected.add(item.id);
							} else {
								newSelected.delete(item.id);
							}
							setSelectedKeys(newSelected);
						}}
					/>
				);
			case "category":
				return item.category;
			case "emissionFactor":
				return item.emissionFactor;
			case "2021":
				return item["2021"].toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
			case "2022":
				return item["2022"].toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
			case "2023":
				return item["2023"].toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
			default:
				return null;
		}
	};
	const fetchScopeOneMonthlyData = async () => {
		try {
			const resp = await getScopeOneTotalDataByYearMonthly<TScopeOneMonthlyData>({ year: "2024" });

			if (resp?.status === "success") {
				console.log(resp.data);
				setScopeOneMonthlyData(resp.data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const fetchScopeTwoMonthlyData = async () => {
		try {
			const resp = await getScopeTwoTotalDataByYearMonthly<TScopeTwoMonthlyData>({ year: "2024" });

			if (resp?.status === "success") {
				setScopeTwoMonthlyData(resp.data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (didHydrate) {
			fetchScopeOneData();
			fetchScopeTwoData();
			fetchScopeOneMonthlyData();
			fetchScopeTwoMonthlyData();
		}
	}, [didHydrate]);

	const totalEmissions = useMemo(() => {
		// all emissions
		const { bioEnergy, fuels, fugitive, processEmission, fleet } = scopeOneTotals[ScopeDataKeys.CURRENT_YEAR];
		const { electricityTotal, heatAndSteamTotal } = scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR];

		let total = bioEnergy + fuels + fugitive + processEmission + fleet + electricityTotal + heatAndSteamTotal;

		// ensure to  3 decimal places
		return total.toFixed(3);
	}, [scopeOneTotals, scopeTwoTotals]);

	const totalScopeOne = useMemo(() => {
		const { bioEnergy, fuels, fugitive, processEmission, fleet } = scopeOneTotals[ScopeDataKeys.CURRENT_YEAR];

		let total = bioEnergy + fuels + fugitive + processEmission + fleet;

		// ensure to  3 decimal places
		return total.toFixed(3);
	}, [scopeOneTotals]);

	const totalScopeTwo = useMemo(() => {
		const { electricityTotal, heatAndSteamTotal } = scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR];

		let total = electricityTotal + heatAndSteamTotal;

		// ensure to  3 decimal places
		return total.toFixed(3);
	}, [scopeTwoTotals]);

	const radialChartValues = useMemo(() => {
		const stationaryCombustion = scopeOneTotals[ScopeDataKeys.CURRENT_YEAR]?.fuels;
		const fugitiveEmissions = scopeOneTotals[ScopeDataKeys.CURRENT_YEAR]?.fugitive;
		const processEmission = scopeOneTotals[ScopeDataKeys.CURRENT_YEAR]?.processEmission;
		const fleetEmissions = scopeOneTotals[ScopeDataKeys.CURRENT_YEAR]?.fleet;
		const heatAndSteam = scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.heatAndSteamTotal;
		const electricity = scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.electricityTotal;

		// compute the percentage of each value
		let total = stationaryCombustion + fugitiveEmissions + processEmission + fleetEmissions + heatAndSteam + electricity;

		const stationaryCombustionPercent = (stationaryCombustion / total) * 100;
		const fugitiveEmissionsPercent = (fugitiveEmissions / total) * 100;
		const processEmissionPercent = (processEmission / total) * 100;
		const fleetEmissionsPercent = (fleetEmissions / total) * 100;
		const heatAndSteamPercent = (heatAndSteam / total) * 100;
		const electricityPercent = (electricity / total) * 100;

		return {
			series: [stationaryCombustionPercent, fugitiveEmissionsPercent, processEmissionPercent, fleetEmissionsPercent, heatAndSteamPercent, electricityPercent],
			labels: ["Stationary Combustion", "Fugitive Emissions", "Process Emission", "Fleet Emissions", "Heat & Steam", "Electricity"],
		};
	}, [scopeOneTotals, scopeTwoTotals]);

	const scopeOneMonthlyChartData = useMemo(() => {
		return prepareScopeOneMonthlyDataTest(scopeOneMonthlyData);
	}, [scopeOneMonthlyData]);

	const scopeTwoMonthlyChartData = useMemo(() => {
		return prepareScopeTwoMonthlyTest(scopeTwoMonthlyData);
	}, [scopeTwoMonthlyData]);

	const downloadEmissionReport = async (period: string) => {
		const reportName = `${generateSlug(userInfo?.company?.companyName || "")}-emissions-report.pdf`;
		const id = toast.loading("Downloading report...");
		try {
			const resp = await axios.get<Blob>(`${API_URL}${getEndpoint(IApiEndpoint.DOWNLOAD_EMISSIONS_REPORT_NEW)}`, {
				headers: {
					Accept: "application/json",
				},
				responseType: "blob",
				params: {
					companyId: userInfo?.company?.id,
					companyName: userInfo?.company?.companyName,
					period,
				},
			});

			toast.success("Report downloaded successfully", { id });

			const arrBuffer = await resp.data.arrayBuffer();

			const blob = new Blob([arrBuffer], { type: "application/pdf" });

			const url = window.URL.createObjectURL(blob);

			const link = document.createElement("a");

			link.href = url;

			link.setAttribute("download", reportName);

			document.body.appendChild(link);

			link.click();

			setTimeout(() => window.URL.revokeObjectURL(url), 3000);
		} catch (err) {
			console.error(err);
			toast.error("An error occurred while trying to download the report", { id });
		}
	};

	return (
		<AuthRedirectComponent>
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
									<TopCardItem title="Total Emission" value={totalEmissions} />
									<Divider orientation="vertical" className="h-auto bg-[#97b79a] hidden md:block" />
									<TopCardItem title="Total Scope 1" value={totalScopeOne} />
									<Divider orientation="vertical" className="h-auto bg-[#97b79a] hidden md:block" />
									<TopCardItem title="Total Scope 2" value={totalScopeTwo} />
									<Divider orientation="vertical" className="h-auto bg-[#97b79a] hidden md:block" />
									<TopCardItem title="Total Scope 3" value="0" />
								</div>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-8 gap-4 mt-10">
							<div className="col-auto md:col-span-6">
								<div className="space-y-5">
									<div className="bg-white rounded-xl shadow-sm py-5">
										<div className="flex flex-col md:flex-row items-center">
											<RadialChartEmissions dataLabels={radialChartValues?.labels} dataSeries={radialChartValues?.series} />
											<div className="md:space-y-4 grid grid-cols-2 gap-4 md:gap-0 md:block">
												<RadialChartStats value={scopeOneTotals[ScopeDataKeys.CURRENT_YEAR]?.fuels} label="Stationary Combustion" color="#58A9FB" />
												<RadialChartStats value={scopeOneTotals[ScopeDataKeys.CURRENT_YEAR]?.fugitive} label="Fugitive Emissions" color="#00E396" />
												<RadialChartStats value={scopeOneTotals[ScopeDataKeys.CURRENT_YEAR]?.processEmission} label="Process Emission" color="#FF9800" />
												<RadialChartStats value={scopeOneTotals[ScopeDataKeys.CURRENT_YEAR]?.fleet} label="Fleet Emissions" color="#03543F" />
												<RadialChartStats value={scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.heatAndSteamTotal} label="Heat & Steam" color="#1C64F2" />
												<RadialChartStats value={scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.electricityTotal} label="Electricity" color="#40D4D4" />
											</div>
										</div>
									</div>
									<div className="px-3 bg-white rounded-xl shadow-md py-4">
										<div className="px-3">
											<h3 className="font-bold">Emissions Over Year</h3>
										</div>
										<EmissionsOverYearBarChart scopeOne={scopeOneMonthlyChartData.series} scopeTwo={scopeTwoMonthlyChartData.series} />
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
									<ActionsCard onClick={openDownloadModal} />
									<DownloadEmissionsModal isOpen={isDownloadModalOpen} onClose={closeDownloadModal} onDownload={downloadEmissionReport} companyName={userInfo?.company?.companyName || ""} />
								</div>
							</div>
						</div>
					</Tab>
					<Tab key={"scope-one"} title="Scope 1">
						<div className="flex items-center justify-between gap-3 m-4">
							<h2 className="font-semibold text-xl text-[#374151]" >Filter By:</h2>
							<div className="flex flex-1 justify-between gap-3 ml-4">
								<div className="flex gap-3">
									<AppSelect placeholder="Branch" baseClassName="min-w-[200px]" options={generateOptions(locations)} />
									<AppSelect placeholder="Year" baseClassName="min-w-[200px]" options={generateOptions(years)} />
								</div>
								<Button className="bg-[#22614A] hover:bg-green-800">Analyze your emission</Button>
							</div>
						</div>
						<div className="w-full mb-6">
							<div className="flex items-center justify-between gap-3">
								<div className="mt-10 bg-white px-3 py-4 rounded-xl">
									<div className="my-4 pl-5 flex items-center justify-between gap-6">
										<h2 className="font-semibold text-lg text-[#343A40]">Scope 1 Categories</h2>
										<HiInformationCircle />
									</div>
									<div>
										<StrokedGaugeRadicalEmissions dataLabels={data.map(item => item.name)} dataSeries={data.map(item => item.value)} />
										<div className="flex items-center justify-between gap-3">
											<p className="h-2 w-2"></p>
										</div>
									</div>
								</div>
								<div className="w-2/3">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-12">
										<div>
											<h2 className="text-lg font-semibold text-gray-800">
												Total Emissions in
											</h2>
											<h2>
												(tCO2E)
											</h2>
										</div>
										<div className="ml-8">
											<p className="text-4xl font-bold">40000</p>
											<p className="text-sm text-gray-500">Emissions in tCO2e</p>
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-12">
										<div className="mt-4">
											<p className="text-lg font-semibold">Total Equipments / Branches</p>
											<p className="text-4xl font-bold mt-2">4</p>
											<p className="text-sm text-gray-500">Registered equipments</p>
										</div>
										<div>
											<StrokedGaugeEmissions />
										</div>
									</div>
								</div>
							</div>
						</div>
						<AppTable
							title="Category Emissions tCO2e  Per Year"
							headerColumns={CategoryEmissionsColumns}
							data={emissionsDataPerYear}
							renderCell={renderEmissionsDataCell}
							selectionMode="single"
							selectedKeys={selectedKeys}
							showTopContent={false}
							columnsToShowOnMobile={["selected", "category", "emissionFactor",]}
						/>
						<div className="mt-6 w-full flex items-center justify-center gap-4">
							<div className="bg-[#EDFAFA] p-3 flex flex-col">
								<p><span className="font-extrabold text-4xl">85%</span> of your emissions came  from   Stationary Combustion</p>
								{/* <ApexChart /> */}
								<ApexHorizontaChart />

								<button className="h-[46px] text-[#133726] rounded-lg border border-[#133726] p-2  ml-auto flex items-center">Download Report
									<IoIosArrowRoundForward className="ml-3" />
								</button>
							</div>
							<div className="w-2/3">
								<ApexColumnStackedChart />
							</div>
						</div>
						<div className="flex items-center justify-between gap-2 mt-10">
							<div className="mt-10 bg-white px-3 py-4 rounded-xl">
								<div className="my-4 pl-5 flex items-center justify-between gap-4">
									<h2 className="font-normal text-lg text-[#343A40]">Total Emissions Per Category</h2>
									<HiInformationCircle />
								</div>
								<div>
									<ApexHorizontaChart />
								</div>
							</div>
							<div className="mt-10 bg-white px-3 py-4 rounded-xl">
								<div className="my-4 pl-5 flex items-center justify-between gap-4">
									<h2 className="font-normal text-lg text-[#343A40]">Organization Equipment's</h2>
									<HiInformationCircle />
								</div>
								<div>
									<EquipmentPieChart dataSeries={[240, 1000, 508, 1500]} />
								</div>
							</div>
							<div className="mt-10 bg-white px-3 py-4 rounded-xl">
								<div className="my-4 pl-5 flex items-center justify-between gap-4">
									<h2 className="font-normal text-lg text-[#343A40]">Total Emissions Per Category</h2>
									<HiInformationCircle />
								</div>
								<div>
									<ApexHorizontaChart />
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
									<EmissionsScope2DonutChart dataSeries={[scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.heatAndSteamTotal, scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.electricityTotal]} />
									<div className="flex items-start w-full">
										<Divider orientation="vertical" className="h-auto md:h-[250px] w-[2px] bg-primary" />
										<div className="px-2 w-full">
											<div className="flex items-center justify-between bg-gray-100 w-full px-4 py-3 rounded-t-xl">
												<p className="text-sm font-semibold">Emission Breakdown</p>
												<p className="text-sm font-semibold">Emission kgCO2e</p>
											</div>
											<div className="py-3 px-4 space-y-8">
												<ScopeBreakdownItem
													title="Electricity"
													value={scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.electricityTotal}
													percent={
														isNaN(Number(computeScopeOneItemPercent(scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.electricityTotal, parseInt(totalScopeTwo))?.toFixed(2)))
															? 0
															: computeScopeOneItemPercent(scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.electricityTotal, parseInt(totalScopeTwo))?.toFixed(2)
													}
													bgColor="#5E896E"
												/>
												<ScopeBreakdownItem
													title="Heat & Steam"
													value={scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.heatAndSteamTotal}
													percent={
														isNaN(Number(computeScopeOneItemPercent(scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.heatAndSteamTotal, parseInt(totalScopeTwo))?.toFixed(2)))
															? 0
															: computeScopeOneItemPercent(scopeTwoTotals[ScopeDataKeys.CURRENT_YEAR]?.heatAndSteamTotal, parseInt(totalScopeTwo))?.toFixed(2)
													}
													bgColor="#CFA16C"
												/>
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
										<ActionsCard />
									</div>
								</div>
							</div>
						</div>
					</Tab>
				</Tabs>
			</div>
		</AuthRedirectComponent>
	);
};

const TopCardItem = ({ title, value }: { title: string; value: string | number }) => {
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
					kgCO<sub>2</sub>e
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

const ScopeBreakdownItem = ({ title, value, percent, bgColor }: { title: string; value: string | number; percent: string | number; bgColor?: string }) => {
	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center space-x-3">
				<div className="w-4 h-4 rounded-full" style={{ backgroundColor: bgColor }}></div>
				<span className="text-sm">{title}</span>
			</div>
			<div className="flex items-center space-x-2">
				<p className="text-sm">{value} </p>
				<span>
					<Chip size="sm" color="success">
						<CustomText className="text-white">{percent}%</CustomText>
					</Chip>
				</span>
			</div>
		</div>
	);
};

const ActionsCard = ({ onClick }: { onClick?: VoidFunction }) => {
	return (
		<Card className="py-5 px-3">
			<CardHeader>
				<div className="flex items-center justify-between w-full">
					<h2 className="text-lg font-semibold">Actions</h2>
					<Button isIconOnly color="primary" variant="light" onPress={onClick}>
						<ExternalLinkIcon className="w-5 h-5]" />
					</Button>
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
	);
};

export default EmissionReports;
