import { colors } from "@nextui-org/react";
import React from "react";
import dynamic from "next/dynamic";

const ReactDonutChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ApexChart = () => {
	const series = [
		{
			name: "Emissions",
			data: [30, 25, 45],
		},
	];

	const options = {
		plotOptions: {
			bar: {
				borderRadius: 10,
				dataLabels: {
					position: "top", // top, center, bottom
				},
				colors: {
					ranges: [
						{
							from: 0,
							to: 100,
							color: "#5E896E", // Set the default bar color here
						},
					],
					backgroundBarColors: [],
					backgroundBarOpacity: 1,
					backgroundBarRadius: 0,
				},
			},
		},
		dataLabels: {
			enabled: true,
			formatter: function (val) {
				return val + "t";
			},
			offsetY: +20,
			style: {
				fontSize: "12px",
				colors: ["#FCF5EB"],
			},
		},
		xaxis: {
			categories: ["Scope 1", "Scope 2", "Scope 3"],
			position: "bottom",
			style: {
				colors: ["#FCF5EB"],
			},
			offsetY: -40,

			tooltip: {
				enabled: true,
			},
		},
	};

	return (
		<div>
			<ReactDonutChart options={options} series={series} type="bar" height={350} />
		</div>
	);
};

export default ApexChart;
