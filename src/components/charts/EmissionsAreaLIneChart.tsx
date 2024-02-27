import { useState } from "react";
import Chart from "react-apexcharts";

const EmissionsAreaLIneChart = () => {
	const [series, setSeries] = useState([
		{
			name: "Baseline",
			type: "column",
			data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 20],
			color: "#5E896E",
		},
		{
			name: "Emmissions",
			type: "area",
			data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 22],
			color: "#EED2AD",
		},
	]);
	const [labels, setLabels] = useState(["Jan '24", "Feb '24", "Mar '24", "Apr '24", "May '24", "Jun '24", "Jul '24", "Aug '24", "Sep '24", "Oct '24", "Nov '24", "Dec '24"]);

	return (
		<Chart
			options={{
				stroke: {
					width: [0, 2, 5],
					curve: "smooth",
				},
				plotOptions: {
					bar: {
						columnWidth: "50%",
					},
				},
				labels: labels,
				markers: {
					size: 0,
				},
				yaxis: {
					title: {
						text: "Total CO2e (kg)",
					},
				},
				xaxis: {
					title: {
						text: "Months",
					},
				},
				tooltip: {
					shared: true,
					intersect: false,
					y: {
						formatter: function (y) {
							if (typeof y !== "undefined") {
								return y.toFixed(0) + " kg";
							}
							return y;
						},
					},
				},
			}}
			type="line"
			series={series}
			height={400}
		/>
	);
};

export default EmissionsAreaLIneChart;
