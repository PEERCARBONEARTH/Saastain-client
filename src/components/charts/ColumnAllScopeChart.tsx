import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ApexColumnStackedChart = () => {
	const series = [
        {
			name: "Stationary Emission",
			data: [45, 10, 20, 40], 
		},
        {
			name: "Fleet Emission",
			data: [25, 50, 200, 20], 
		},
		{
			name: "Process Emission",
			data: [30, 20, 20, 100], 
		},
		
	];

	const options = {
		chart: {
			// type: "bar" as "bar",
			stacked: true, 
		},
		plotOptions: {
			bar: {
				horizontal: false, 
				borderRadius: 10,
				columnWidth: "50%", 
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
			categories: [" 2020", "2021", "2022"], 
            labels: {
                show: false
            },
            axisTicks: {
				show: false, 
			},
            axisBorder: {
				show: false, 
			},
		},
		yaxis: {
            labels: {
                show: false
            }
		},
        grid: {
			show: false, 
		},

		colors: ["#E4FCE6","#CC8830","#036672" ], 
		tooltip: {
			enabled: true,
			shared: true,
            intersect: false,
		},
		legend: {
			position: "bottom" as "bottom", 
		},
	};

	return (
		<div>
			<ReactApexChart options={options} series={series} type="bar" height={350} />
		</div>
	);
};

export default ApexColumnStackedChart;
