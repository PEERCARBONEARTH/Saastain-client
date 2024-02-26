import { useState } from "react";
import Chart from "react-apexcharts";

const EmissionsOverYearBarChart = () => {
	const [series, setSeries] = useState([
		{
			data: [44, 55, 41, 64, 22, 43, 21, 49, 45, 55, 41, 64],
			name: "Scope 1",
		},
		{
			data: [53, 32, 33, 52, 13, 44, 32, 39, 52, 91, 45, 33],
			name: "Scope 2",
		},
		{
			data: [52, 33, 34, 53, 14, 45, 33, 40, 53, 92, 46, 34],
			name: "Scope 3",
		},
	]);

	return (
		<Chart
			options={{
				plotOptions: {
					bar: {
						horizontal: false,
						dataLabels: {
							position: "top",
						},
					},
				},
				dataLabels: {
					enabled: true,
					offsetX: -6,
					style: {
						fontSize: "12px",
						colors: ["#fff"],
					},
				},
				stroke: {
					show: true,
					width: 1,
					colors: ["#fff"],
				},
				tooltip: {
					shared: true,
					intersect: false,
				},
				xaxis: {
					categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				},
				colors: ["#E4FCE6", "#CFA16C", "#5E896E"],
			}}
			type="bar"
			series={series}
			height={350}
		/>
	);
};

export default EmissionsOverYearBarChart;
