import { useState } from "react";
import Chart from "react-apexcharts";

interface IProps {
	dataSeries: number[];
}

const DashboardDonutChart = ({dataSeries}: IProps) => {
	const [series, setSeries] = useState(dataSeries);
	const [labels, setLabels] = useState(["Scope 1", "Scope 2", "Scope 3"]);
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
				colors: ["#5E896E", "#CFA16C", "#014737"],
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
			width="280"
		/>
	);
};

export default DashboardDonutChart;
