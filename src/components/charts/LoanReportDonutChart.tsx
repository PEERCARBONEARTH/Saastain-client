import { useState } from "react";
import Chart from "react-apexcharts";

const LoanReportDonutChart = () => {
	const [series, setSeries] = useState([82285.41, 380996.6]);
	const [labels, setLabels] = useState(["Total Refunded", "Total Remaining"]);
	return (
		<Chart
			options={{
				labels: labels,

				tooltip: {
					y: {
						formatter: function (value) {
							return "$" + value + " USD";
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
				colors: ["#A7B3A7", "#5E896E"],
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

export default LoanReportDonutChart;
