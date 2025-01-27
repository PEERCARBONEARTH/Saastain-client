'use client'
import React from 'react'
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const EmissionsOverviewDonut = () => {
  const options = {
    chart: {
      type: 'donut',
    },
    labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    colors: ['#036672', '#E4FCE6', '#CC8830'],
    legend: {
      show: false
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(0) + '%'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '30%',
        }
      }
    }
  };

  const series = [34, 33, 33];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-normal font-bold">Total Emissions</h3>
        <button className="text-gray-400 hover:text-gray-500">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <Chart
        options={options}
        series={series}
        type="donut"
        height={250}
      />
    </div>
  )
}

export const EmissionsBarChart = () => {
  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    colors: ['#036672', '#E4FCE6', '#CC8830'],
    xaxis: {
      categories: ['2021', '2022', '2023', '2024'],
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: false
    }
  };

  const series = [
    {
      name: 'Scope 1',
      data: [400, 200, 600, 600]
    },
    {
      name: 'Scope 2',
      data: [300, 200, 100, 100]
    },
    {
      name: 'Scope 3',
      data: [200, 100, 50, 50]
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-normal font-bold">Emissions (tCo2E) By Year and Scope</h3>
        <button className="text-gray-400 hover:text-gray-500">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <Chart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </div>
  )
}

export const EmissionsScopeProgress = () => {
  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
        borderRadius: 4,
      },
    },
    colors: ['#036672'], 
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val + ' tCO2e';
      },
      style: {
        colors: ['#fff']
      },
      offsetX: 10
    },
    xaxis: {
      categories: ['Scope 1', 'Scope 2', 'Scope 3'],
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '14px'
        }
      }
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return val + ' tCO2e';
        }
      }
    }
  };

  const series = [{
    name: 'Emissions',
    data: [300, 200, 100]
  }];

  return (
    <div className="flex gap-8">
      <div className="flex-col items-center p-6">
        <div>
          <h2 className="text-4xl font-bold">85% <span className='font-semibold text-lg text-gray-600'>of your</span></h2>
          <p className="text-lg font-semibold text-gray-600">emissions came from <br/> Scope 1</p>
        </div>
        <button className="mt-4 text-white bg-[#22614A] hover:bg-[#0D4A47] px-4 py-2 rounded-lg text-sm">
          Explore Scope 1 →
        </button>
      </div>

      <div className="flex-1">
        <Chart
          options={options}
          series={series}
          type="bar"
          height={200}
        />
      </div>
    </div>
  );
};

export const EmissionsTrackingChart = () => {
  const [selectedScope, setSelectedScope] = React.useState("Scope 1");

  const scopes = [
    { label: "Scope 1", value: "Scope 1" },
    { label: "Scope 2", value: "Scope 2" },
    { label: "Scope 3", value: "Scope 3" },
  ];

  const options = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      width: [2, 2, 2],
      curve: 'smooth',
      dashArray: [0, 0, 4]
    },
    colors: ['#115E59', '#88BDAB', '#CC8830'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    yaxis: {
      min: 0,
      max: 30,
      tickAmount: 3,
      labels: {
        formatter: (value: number) => `${value}M`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y: number) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " tCO2e";
          }
          return y;
        }
      }
    },
    markers: {
      size: 4,
      hover: {
        size: 6
      }
    }
  };

  const series = [
    {
      name: 'Scope 1',
      data: [10, 15, 12, 18, 15, 20, 18]
    },
    {
      name: 'Scope 2',
      data: [8, 12, 10, 15, 12, 17, 15]
    },
    {
      name: 'Scope 3',
      data: [5, 8, 7, 11, 9, 14, 12]
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-normal font-bold">Emissions Progressing Tracking</h3>
        <button className="text-gray-400 hover:text-gray-500">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <Chart
        options={options}
        series={series}
        type="line"
        height={300}
      />
      
      <div className="flex items-center justify-between gap-2 mt-4">
        <div className="text-lg text-gray-500">Filter your emissions based on your emission factors</div>
        <Select
          size="sm"
          variant="bordered"
          selectedKeys={[selectedScope]}
          className="max-w-[150px]"
          onChange={(e) => setSelectedScope(e.target.value)}
          aria-label="Select emission scope"
        >
          {scopes.map((scope) => (
            <SelectItem key={scope.value} value={scope.value}>
              {scope.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  )
}

export const EmissionsPerBranchChart = () => {
  const options = {
    chart: {
      type: 'pie',
    },
    labels: ['Branch A', 'Branch B', 'Branch C'],
    colors: ['#115E59', '#0D9488', '#E2F6F3'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'left',
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: {
        formatter: function (value: number) {
          return value + ' t';
        }
      }
    }
  };

  const series = [200, 500, 500];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className=" font-bold">Emission Per Branch</h3>
        <button className="text-gray-400 hover:text-gray-500">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <Chart
        options={options}
        series={series}
        type="pie"
        height={250}
      />
      <div className="mt-4 space-y-2">
        {options.labels.map((label, index) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: options.colors[index] }}
              />
              <span className="text-sm">{label}</span>
            </div>
            <span className="text-sm">{series[index]}t</span>
          </div>
        ))}
      </div>
    </div>
  )
}
