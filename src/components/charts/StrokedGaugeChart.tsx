import { useState } from "react";
import Chart from "react-apexcharts";

interface IProps {
	value: number;
	label: string;
}

const StrokedGaugeChart = ({ value, label }: IProps) => {
	const [series, setSeries] = useState([value]);
	return (
		<Chart
			options={{
				plotOptions: {
					radialBar: {
						startAngle: -135,
						endAngle: 135,
						dataLabels: {
							name: {
								fontSize: "16px",
								fontFamily: "Nunito, sans-serif",
								color: undefined,
								offsetY: 120,
							},
							value: {
								offsetY: 76,
								fontSize: "22px",
								color: "#CFA16C",
								formatter: function (val) {
									return val + "%";
								},
							},
						},
					},
				},
				fill: {
					type: "gradient",
					gradient: {
						shade: "dark",
						shadeIntensity: 0.15,
						inverseColors: false,
						opacityFrom: 1,
						opacityTo: 1,
						stops: [0, 50, 65, 91],
					},
					colors: ["#CFA16C"],
				},
				stroke: {
					dashArray: 4,
				},
				labels: [label],
				colors: ["#FFFFFF"],
			}}
			type="radialBar"
			height={350}
			series={series}
		/>
	);
};

export default StrokedGaugeChart;
