import { useState } from "react";
import Chart from "react-apexcharts";

const NetZeroLineChart = () => {
	const [series, setSeries] = useState([
		{
			name: "Scope 1",
			data: [31, 40, 28, 51, 42, 109, 100],
		},
		{
			name: "Scope 2",
			data: [11, 32, 45, 32, 34, 52, 41],
		},
	]);
	const [categories, setCategories] = useState(["2020", "2019", "2020", "2021", "2022", "2023", "2024"]);
	return (
		<Chart
			options={{
				chart: {
					height: 350,
					type: "area",
				},
				dataLabels: {
					enabled: false,
				},
				stroke: {
					curve: "smooth",
				},
				xaxis: {
					categories: categories,
				},
			}}
			series={series}
			type="area"
			height={350}
		/>
	);
};

export default NetZeroLineChart;
