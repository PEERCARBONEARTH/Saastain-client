import { useState } from "react";
import Chart from "react-apexcharts";

interface IProps {
  dataSeries: number[];
}

const EquipmentPieChart = ({ dataSeries = [240, 1000, 508, 1500] }: IProps) => {
  const [series, setSeries] = useState(dataSeries);
  const [labels, setLabels] = useState(["Equipment A", "Equipment B", "Equipment C", "Equipment D"]);
  
  return (
    <Chart
      options={{
        labels: labels,
        legend: {
         position: 'bottom',
        },
        colors: ["#004d4d", "#008080", "#b3e6e6", "#16BDCA"],
      
        plotOptions: {
          pie: {
            expandOnClick: true,
            offsetX: 0,
            offsetY: 0,
            dataLabels: {
              offset: 0,
            },
          },
        },
        chart: {
          background: "transparent",
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
          }
        },
      }}
      series={series}
      type="pie"
      width="300"
    />
  );
};

export default EquipmentPieChart;