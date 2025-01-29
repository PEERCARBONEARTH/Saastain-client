import { useState } from "react";
import Chart from "react-apexcharts";

interface IProps {
  dataSeries: number[];
  dataLabels: string[];
}

const StrokedGaugeRadicalEmissions = ({ dataLabels, dataSeries }: IProps) => {
  return (
    <div className="relative">
      {/* <h2 className="text-lg font-medium mb-4">Scope 1 Categories</h2> */}
      <Chart
        options={{
          plotOptions: {
            radialBar: {
              startAngle: -135,
              endAngle: 135,
              hollow: {
                margin: 0,
                size: '70%',
              },
              track: {
                background: "#f2f2f2",
                strokeWidth: '80%',
                margin: 0,
              },
              dataLabels: {
                show: true,
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
                total: {
                  show: true,
                  label: 'Total Value',
                  formatter: function (w) {
                    return 'Label'
                  }
                }
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
          },
          tooltip: {
            enabled: true,
            shared: false,
            followCursor: true,
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
              return '<div class="arrow_box">' +
                '<span>' + w.config.labels[seriesIndex] + ': ' +
                series[seriesIndex] + '%</span>' +
                '</div>';
            }
          },
          stroke: {
            lineCap: 'round'
          },
          labels: dataLabels,
          colors: ["#FDB600" ,"#FFA5DA", "#0096FF", "#5BD222"],
          legend: {
            // show: true,
            position: 'bottom',
          }
        }}
        type="radialBar"
        height={350}
        series={dataSeries}
      />
      <div className="flex items-center justify-center gap-4 mt-2">
        {dataLabels.map((label, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ 
                backgroundColor: ["#FDB600", "#5BD222", "#0096FF"][index]
              }}
            />
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrokedGaugeRadicalEmissions;