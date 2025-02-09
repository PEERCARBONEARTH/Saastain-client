"use client";

import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/utils";
import { Button, Card, CardBody, CardFooter, CardHeader, Link } from "@heroui/react";
import { InfoIcon, MoveRightIcon } from "lucide-react";
import ReactEcharts from "echarts-for-react";
import { CSSProperties } from "react";
import { IoInformationSharp } from "react-icons/io5";

const chartOption = {
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow",
		},
	},
	legend: {},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "3%",
		containLabel: true,
	},
	xAxis: {
		type: "value",
		boundaryGap: [0, 0.01],
	},
	yAxis: {
		type: "category",
		data: ["Stationary", "Process", "Fleet", "Heating"],
	},
	series: [
		{
			type: "bar",
			data: [29034, 104970, 131744, 630230],
			itemStyle: {
				color: "#3C8F75",
				borderRadius: [0, 20, 20, 0],
			},
		},
	],
};

const emissionOption = {
	tooltip: {
		trigger: "item",
	},
	legend: {
		bottom: "5%",
		left: "center",
	},
	series: [
		{
			type: "pie",
			radius: ["20%", "70%"],
			avoidLabelOverlap: false,
			label: {
				show: false,
				position: "center",
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 20,
					fontWeight: "bold",
				},
			},
			labelLine: {
				show: false,
			},
			data: [
				{ value: 508, name: "Offset", itemStyle: { color: "#036672" } },
				{ value: 200, name: "Total Emissions", itemStyle: { color: "#EED2AD" } },
			],
		},
	],
};

const stackedBarOption = {
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow",
		},
	},
	legend: {
		data: ["Scope 1", "Scope 2"],
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "3%",
		containLabel: true,
	},
	xAxis: {
		type: "category",
		data: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
	},
	yAxis: {
		type: "value",
	},
	series: [
		{
			name: "Scope 1",
			data: [220, 182, 191, 234, 290, 330],
			type: "bar",
			stack: "Total",
			itemStyle: {
				color: "#D03801",
				// borderRadius: [20, 20, 0, 0],
			},
		},
		{
			name: "Scope 2",
			type: "bar",
			stack: "Total",
			data: [120, 132, 101, 134, 90, 230],
			itemStyle: {
				color: "#FCE96A",
				borderRadius: [20, 20, 0, 0],
			},
		},
	],
};

// this line chart is for scope 1 and 2 and has a different color scheme and background color
const scope1and2LineChart = {
	tooltip: {
		trigger: "axis",
	},
	legend: {
		data: ["Scope 1", "Scope 2"],
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "3%",
		containLabel: true,
	},
	xAxis: {
		type: "category",
		boundaryGap: false,
		data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
	},
	yAxis: {
		type: "value",
	},
	series: [
		{
			name: "Scope 1",
			type: "line",
			data: [220, 182, 191, 234, 290, 330, 310],
			itemStyle: {
				color: "#D03801",
			},
			smooth: true,
			areaStyle: {
				color: "#F98080",
				opacity: 0.3
			}
		},
		{
			name: "Scope 2",
			type: "line",
			data: [150, 232, 201, 154, 190, 330, 410],
			itemStyle: {
				color: "#FCE96A",
			},
			smooth: true,
			areaStyle: {
				color: "#047481",
				opacity: 0.2
			}
		},
	],
}

const NewDashboard = () => {
	return (
		<>
			<div className="space-y-3">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-sm font-medium">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis magnam voluptatibus soluta fugiat delectus ad sed nesciunt ex.</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 mt-7">
				<div className="flex items-center gap-5 w-full">
					<p className="font-bold">Filter By:</p>
					<AppSelect options={generateOptions(["Branch 1", "Branch 2", "Branch 3"])} placeholder="Branch" />
					<AppSelect options={generateOptions(["2025", "2024", "2023"])} placeholder="Year" />
				</div>
				<div className="flex items-center justify-end">
					<Button color="primary" className="bg-primary-700">
						Your Carbon Status
					</Button>
				</div>
			</div>
			<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				<Card className="py-5 px-3">
					<CardHeader className="font-bold text-lg">Total Carbon Footprint</CardHeader>
					<CardBody>
						<h1 className="text-5xl font-semibold">300 K</h1>
						<div className="mt-4">
							<p className="text-sm">Emissions in tCO2e</p>
						</div>
					</CardBody>
					<CardFooter>
						<Link href="/dashboard" underline="hover" size="sm" showAnchorIcon color="warning" anchorIcon={<MoveRightIcon className="w-4 h-4 ml-1" />}>
							View Emissions
						</Link>
					</CardFooter>
				</Card>
				<Card className="py-5 px-3">
					<CardHeader className="font-bold text-lg">Total Branches</CardHeader>
					<CardBody>
						<h1 className="text-5xl font-semibold">4</h1>
						<div className="mt-4">
							<p className="text-sm">Company branches</p>
						</div>
					</CardBody>
					<CardFooter>
						<Link href="/dashboard" underline="hover" size="sm" showAnchorIcon color="warning" anchorIcon={<MoveRightIcon className="w-4 h-4 ml-1" />}>
							More Branches
						</Link>
					</CardFooter>
				</Card>
				<Card className="py-5 px-3">
					<CardHeader>
						<div className="flex items-center justify-center w-full">
							<h1 className="font-bold text-lg">Yearly Goal</h1>
						</div>
					</CardHeader>
					<CardBody>
						<div className="w-full flex items-center justify-center">
							<div style={{ "--value": "84" } as CSSProperties} role="progressbar" aria-valuenow={84} aria-valuemax={100} aria-valuemin={0} className="custom-half-pie-dashboard"></div>
						</div>
					</CardBody>
					<CardFooter>
						<Link href="/dashboard" underline="hover" size="sm" showAnchorIcon color="warning" anchorIcon={<MoveRightIcon className="w-4 h-4 ml-1" />}>
							View Goals
						</Link>
					</CardFooter>
				</Card>
			</div>
			<div className="mt-5 grid grid-cols-1 md:grid-cols-9 gap-4">
				<div className="col-auto md:col-span-4">
					<Card className="h-full">
						<CardHeader>
							<div className="flex items-center justify-between w-full">
								<h1>Lastest Emissions</h1>
								<Button className="rounded-full" size="sm" isIconOnly>
									<IoInformationSharp />
								</Button>
							</div>
						</CardHeader>
						<ReactEcharts option={chartOption} />
					</Card>
				</div>
				<div className="col-auto md:col-span-3">
					<Card className="">
						<CardHeader>
							<div className="flex items-center justify-between w-full">
								<h1>Lastest Emissions</h1>
								<Button className="rounded-full" size="sm" isIconOnly>
									<IoInformationSharp />
								</Button>
							</div>
						</CardHeader>
						<ReactEcharts option={emissionOption} />
						<CardFooter>
							<div className="flex items-center justify-end">
								<Link href="/dashboard" underline="hover" size="sm" showAnchorIcon color="warning" anchorIcon={<MoveRightIcon className="w-4 h-4 ml-1" />}>
									View Emissions
								</Link>
							</div>
						</CardFooter>
					</Card>
				</div>
				<div className="col-auto md:col-span-2">
					<Card className="h-full">
						<CardHeader>Emissions Per Branch</CardHeader>
						<CardFooter>
							<div className="flex items-center justify-end">
								<Link href="/dashboard" underline="hover" size="sm" showAnchorIcon color="warning" anchorIcon={<MoveRightIcon className="w-4 h-4 ml-1" />}>
									View Branches
								</Link>
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
			<div className="mt-5 grid grid-cols-1 md:grid-cols-9 gap-4">
				<div className="col-auto md:col-span-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between w-full">
								<h1 className="text-lg font-bold">Total Emissions Per Scope</h1>
								<AppSelect options={generateOptions(["3 months", "6 months", "1 year"])} placeholder="Time Period" baseClassName="w-[30%]" />
							</div>
						</CardHeader>
						<CardBody>
							<ReactEcharts option={stackedBarOption} />
						</CardBody>
					</Card>
				</div>
				<div className="col-auto md:col-span-5">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between w-full">
								<h1 className="text-lg font-bold">Impact over time</h1>
								<AppSelect options={generateOptions(["3 months", "6 months", "1 year"])} placeholder="Time Period" baseClassName="w-[30%]" />
							</div>
						</CardHeader>
						<CardBody>
							<ReactEcharts option={scope1and2LineChart} />
						</CardBody>
					</Card>
				</div>
			</div>
		</>
	);
};

export default NewDashboard;
