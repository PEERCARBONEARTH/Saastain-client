'use client'
import AuthRedirectComponent from '@/components/auth/AuthRedirectComponent'
import { Tab, Tabs, Card, CardBody, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem } from '@nextui-org/react'
import React from 'react'
import { EmissionsOverviewDonut, EmissionsBarChart, EmissionsScopeProgress, EmissionsTrackingChart, EmissionsPerBranchChart } from '@/components/charts/EmissionsOverviewCharts'
import { HiOutlineDocumentDownload } from "react-icons/hi";

const EmissionReportsNew = () => {
  const [selectedBranch, setSelectedBranch] = React.useState("All Branches");
  const [selectedYear, setSelectedYear] = React.useState("2024");

  const branches = [
    { label: "Branches", value: "Branches" },
    { label: "Branch 1", value: "Branch 1" },
    { label: "Branch 2", value: "Branch 2" },
  ];

  const years = [
    { label: "2024", value: "2024" },
    { label: "2023", value: "2023" },
    { label: "2022", value: "2022" },
  ];

  return (
    <div>
      <div>
        <h1 className='text-2xl font-bold'>Emissions Overview</h1>
        <p className='text-sm'>View your emissions here</p>
      </div>
      <div className='mt-10'>
        <Tabs 
          aria-label="Emission Reports" 
          variant="underlined" 
          color="primary"
        >
          <Tab key="all-emissions" title="All Emissions">
            <div className="mt-8 space-y-6">
 
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <Card className="w-full">
                  <CardBody>
                    <EmissionsOverviewDonut />
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#036672]"></div>
                          <span className="text-sm">Scope 1</span>
                        </div>
                        <span className="text-sm">200t</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#E4FCE6]"></div>
                          <span className="text-sm">Scope 2</span>
                        </div>
                        <span className="text-sm">230t</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#CC8830]"></div>
                          <span className="text-sm">Scope 3</span>
                        </div>
                        <span className="text-sm">230t</span>
                      </div>
                      <button className="w-full text-sm text-[#CC8830] hover:text-[#C2410C] text-right mt-4">
                        Download Report →
                      </button>
                    </div>
                  </CardBody>
                </Card>

                <div className='space-y-2'>
                <Card className="w-full">
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                          <p className='font-bold'>Total Emissions in <br/> (tCo2E)</p>
                      </div>
                      <div className='items-center py-4 pr-8'>
                        <h3 className="text-3xl font-bold">40000</h3>
                        <p className="text-sm text-gray-500">Emissions in tCO2e</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="w-full lg:col-span-3">
                  <CardBody>
                    <EmissionsBarChart />
                  </CardBody>
                </Card>
                </div>
              </div>
              <Card className="w-full">
                  <CardBody>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text- font-bold">Emissions tCO2e Per Year</h3>
                      <Button color="primary" size="sm" variant="flat" className='text-white bg-[#22614A]'>
                        Add More Data
                      </Button>
                    </div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full min-w-full text-sm text-gray-500">
                        <thead>
                          <tr className="bg-[#DFEEEA] text-gray-500">
                            <th className="px-4 py-2 text-center">SCOPE</th>
                            <th className="px-4 py-2 text-left bg-[#EED2AD]">BASELINE TARGET</th>
                            <th className="px-4 py-2 text-left">2022 TCO2e</th>
                            <th className="px-4 py-2 text-left">2023 TCO2e</th>
                            <th className="px-4 py-2 text-left">2024 TCO2e</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="px-4 py-3 text-center">Scope 1</td>
                            <td className="px-4 py-3 text-[#CC8830]">10t</td>
                            <td className="px-4 py-3">40 t</td>
                            <td className="px-4 py-3">40 t</td>
                            <td className="px-4 py-3">40 t</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3 text-center">Scope 2</td>
                            <td className="px-4 py-3 text-[#CC8830] ">14t</td>
                            <td className="px-4 py-3">300t</td>
                            <td className="px-4 py-3">300t</td>
                            <td className="px-4 py-3">300t</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3 text-center">Scope 3</td>
                            <td className="px-4 py-3 text-[#CC8830]">3k</td>
                            <td className="px-4 py-3">400 t</td>
                            <td className="px-4 py-3">400 t</td>
                            <td className="px-4 py-3">400 t</td>
                          </tr>
                          <tr className="bg-[#DFEEEA]">
                            <td className="px-4 py-3 font-bold text-center text-black">Total</td>
                            <td className="px-4 py-3 bg-[#EED2AD] font-medium"></td>
                            <td className="px-4 py-3 font-bold text-black">4000t</td>
                            <td className="px-4 py-3 font-bold text-black">3000t</td>
                            <td className="px-4 py-3 font-bold text-black">6000t</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                
                <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <p className="text-sm font-bold w-[200px]">Filter By:</p>
                  <Select
                    variant="bordered"
                    selectedKeys={[selectedBranch]}
                    className="w-[400px]"
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    aria-label="Select branch"
                  >
                    {branches.map((branch) => (
                      <SelectItem key={branch.value} value={branch.value}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    variant="bordered"
                    selectedKeys={[selectedYear]}
                    className="max-w-full"
                    onChange={(e) => setSelectedYear(e.target.value)}
                    aria-label="Select year"
                  >
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <Button color="primary" className='bg-[#22614A]'>
                  Analyze your emission
                </Button>
              </div>

              <div className='flex justify-between space-x-4 '>
                <Card className="w-full bg-[#EDFAFA]">
                    <CardBody>
                        <EmissionsScopeProgress />
                  </CardBody>
                </Card>

                <Card className="w-1/4">
                  <CardBody>
                  <div className="flex-col justify-end mt-4">
                    <div className="items-center gap-4">
                        <HiOutlineDocumentDownload size={30} color='#5E896E'/>
                        <p className='py-4 font-bold'>Export as Pdf</p>

                      <p className="text-sm text-gray-500 ">Export this report in pdf</p>
                      <div className='text-right py-4'>
                      <Button variant="light" className="text-[#F97316] text-right">
                        Open →
                      </Button>
                      </div>
                      
                    </div>
                  </div>
                </CardBody>
              </Card>
              </div>

              <div className="flex gap-6">
                <Card className="w-2/3 bg-[#EDFAFA]">
                  <CardBody>
                    <EmissionsTrackingChart />
                  </CardBody>
                </Card>

                <Card className="w-1/3">
                  <CardBody>
                    <EmissionsPerBranchChart />
                  </CardBody>
                </Card>
              </div>

            </div>
          </Tab>

          
          <Tab key="scope-one" title="Scope 1">
            <div>
              <p>Scope 1 Emissions</p>
            </div>
          </Tab>
          <Tab key="scope-two" title="Scope 2">
            <div>
              <p>Scope 2 Emissions</p>
            </div>
          </Tab>
          <Tab key="scope-three" title="Scope 3">
            <div>
              <p>Scope 3 Emissions</p>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default EmissionReportsNew;
