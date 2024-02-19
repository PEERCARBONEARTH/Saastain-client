import { useState } from "react";
import Chart from "react-apexcharts";

const DonutChart = () => {
	const [series, setSeries] = useState([25300, 32000, 75000]);
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
			}}
			series={series}
			type="donut"
			width="280"
		/>
	);
};

export default DonutChart;
