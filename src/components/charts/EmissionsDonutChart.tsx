import { useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IProps {
	dataSeries: number[];
}

const EmissionsDonutChart = ({dataSeries}: IProps) => {
	const [series, setSeries] = useState(dataSeries);
	const [labels, setLabels] = useState(["Stationary Combustion", "Fugitive Emissions", "Process Emission", "Fleet Emissions"]);
	return (
		<Chart
			options={{
				labels: labels,

				tooltip: {
					y: {
						formatter: function (value) {
							return value + " kg";
						},
					},
				},
				legend: {
					show: false,
					position: "right",
					horizontalAlign: "left",
					itemMargin: {
						horizontal: 10,
						vertical: 5,
					},
				},
				colors: ["#5E896E", "#CFA16C", "#014737", "#9B1C1C"],
				plotOptions: {
					pie: {
						donut: {
							size: "50%", // Increase or decrease to adjust the width of the donut
						},
					},
				},
			}}
			series={series}
			type="donut"
			width={350}
			height={350}
		/>
	);
};

export default EmissionsDonutChart;
