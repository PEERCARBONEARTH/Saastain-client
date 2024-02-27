import Chart from "react-apexcharts";

interface IProps {
	scopeOne: number[];
	scopeTwo: number[];
}

const EmissionsOverYearBarChart = ({ scopeOne, scopeTwo }: IProps) => {
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
				yaxis: {
					labels: {
						// @ts-expect-error
						formatter: function (val: number) {
							return val;
						},
					},
				},
				colors: ["#5e896e", "#CFA16C"],
			}}
			type="bar"
			series={[
				{
					name: "Scope 1",
					data: scopeOne,
				},
				{
					name: "Scope 2",
					data: scopeTwo,
				},
			]}
			height={350}
		/>
	);
};

export default EmissionsOverYearBarChart;
