import { useState } from "react";
import Chart from "react-apexcharts";

const RadialChartEmissions = () => {
	const [series, setSeries] = useState([44, 55, 67, 83, 90, 100]);
	const [labels, setLabels] = useState(["Stationary Combustion", "Fugitive Emissions", "Process Emission", "Fleet Emissions", "Heat & Steam", "Electricity"]);

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
				colors: ["#58A9FB", "#00E396", "#FF9800", "#03543F", "#1C64F2", "#40D4D4"],
				plotOptions: {
					radialBar: {
						dataLabels: {
							name: {
								fontSize: "12px",
							},
							value: {
								fontSize: "16px",
							},
							total: {
								show: false,
								label: "Total",
							},
						},
					},
				},
			}}
			series={series}
			type="radialBar"
			width={450}
		/>
	);
};

export default RadialChartEmissions;
