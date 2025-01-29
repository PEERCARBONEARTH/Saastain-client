import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ApexHorizontaChart = () => {
	const series = [
		{
			name: "Emissions",
			data: [30, 25, 100], 
		},
	];

	const options = {
		// chart: {
		// 	type: "bar", // Bar chart type
		// },
		plotOptions: {
			bar: {
				horizontal: true, 
				borderRadius: 4,
				dataLabels: {
					position: "center", 
				},
			},
		},
		dataLabels: {
			enabled: true,
			formatter: function (val) {
				return val + "t"; 
			},
			style: {
				fontSize: "12px",
				colors: ["#FFFFFF"], 
			},
		},
		xaxis: {
			labels:{
				show: false
			},
			axisBorder: {
				show: false, 
			},
			axisTicks: {
				show: false, 
			},
		},
		yaxis: {
			labels:{
				show: false
			},
			
			categories: ["Scope 1", "Scope 2", "Scope 3"], 
		},
		grid: {
			show: false, 
		},
		colors: ["#036672"], 
		tooltip: {
			enabled: true,
		},
	};

	return (
		<div>
			<ReactApexChart options={options} series={series} type="bar" height={200} />
		</div>
	);
};

export default ApexHorizontaChart;
