import { useState } from "react";
import Chart from "react-apexcharts";

interface IProps {
	dataSeries: number[];
	dataLabels: string[];
}

const RadialChartEmissions = ({ dataLabels, dataSeries }: IProps) => {
	return (
		<Chart
			options={{
				labels: dataLabels,
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
								fontSize: "12px",
							},
							total: {
								show: false,
								label: "Total",
							},
						},
					},
				},
				responsive: [
					{
						breakpoint: 480,
						options: {
							chart: {
								width: 300,
							},
							legend: {
								position: "bottom",
							},
						},
					},
				],
			}}
			series={dataSeries}
			type="radialBar"
			width={450}
		/>
	);
};

export default RadialChartEmissions;
