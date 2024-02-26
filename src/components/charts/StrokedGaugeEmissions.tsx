import { useState } from "react";
import Chart from "react-apexcharts";

const StrokedGaugeEmissions = () => {
	const [series, setSeries] = useState([67]);
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
				labels: ["Total CO2 Saved"],
                colors: ["#FFFFFF"],
			}}
			type="radialBar"
			height={350}
			series={series}
		/>
	);
};

export default StrokedGaugeEmissions;
