'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const RecordsPage = () => {
  const [showOffsetModal, setShowOffsetModal] = useState(false)

  const emissionsData = [
    { category: 'Car', value: 66934, percentage: '> 5%', color: '#00838F' },
    { category: 'Energy', value: 66934, percentage: '~1%', color: '#C62828' },
    { category: 'Waste', value: 66934, percentage: '~1%', color: '#2E7D32' },
    { category: 'Flights', value: 66934, percentage: '~1%', color: '#E91E63' },
    { category: 'Trains', value: 66934, percentage: '~1%', color: '#1976D2' },
    { category: 'Delivery Vehicles', value: 66934, percentage: '~1%', color: '#FDD835' },
    { category: 'Passenger Vehicles', value: 66934, percentage: '~1%', color: '#F4511E' },
  ]

  const chartOptions = {
    chart: {
      type: 'donut',
      width: '100%'
    },
    colors: emissionsData.map(item => item.color),
    labels: emissionsData.map(item => item.category),
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: '',
              formatter: () => {
                return '2,234\n\nmetric tonnes of\nCO2E'
              },
              style: {
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: 'inherit'
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 380
        }
      }
    }]
  }

  const series = emissionsData.map(item => item.value)

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="p-4 bg-white">
        <Link href="/dtb-event/start" className="inline-flex items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>

      {/* Event Card */}
      <div className="mx-4 mt-4">
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            src="/images/dtb-event/event-banner.jpg"
            alt="Event banner"
            width={400}
            height={200}
            className="w-full object-cover h-[160px]"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h2 className="text-2xl font-bold">Event Name</h2>
            <div className="flex gap-2 mt-2 text-sm">
              <span>Location</span>
              <span>•</span>
              <span>Date</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Emissions */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-semibold mb-4">Total Emissions</h3>
        <div className="bg-white rounded-lg p-4">
          <div className="w-full max-w-2xl mx-auto">
            <Chart 
              options={chartOptions}
              series={series}
              type="donut"
              height={400}
            />
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-semibold mb-4">Breakdown</h3>
        <div className="space-y-3">
          {emissionsData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.category}</span>
                <span className="text-xs text-gray-500">{item.percentage}</span>
              </div>
              <span className="text-sm">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <div className="px-4 mt-8 pb-8">
        <button 
          onClick={() => setShowOffsetModal(true)}
          className="w-full bg-[#0A3A2F] text-white py-3 rounded-lg flex items-center justify-center gap-2"
        >
          Download Certificate
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>

      {/* Offset Modal */}
      {showOffsetModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowOffsetModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#0A3A2F] text-white p-6 rounded-t-3xl z-50 transform transition-transform duration-300 ease-out">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Would you like to offset your emissions
            </h3>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowOffsetModal(false)}
                className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-center"
              >
                No
              </button>
              <Link
                href="/dtb-event/check-email"
                className="flex-1 py-3 px-4 rounded-lg bg-white text-[#0A3A2F] text-center"
              >
                Yes
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RecordsPage 