import React from "react";
import {Card, CardBody, Divider, Link, Image} from "@nextui-org/react";
import DonutChart from "../charts/DonutChart";
import ApexChart from "../charts/ColumnChart";

export default function CompanySummary() {
      return (
        <>
        <Card className="w-[full] h-[132px] mx-12">
        <CardBody>
            
          <div className="flex space-x-60">
            <div>
                <p className="text-small px-8">Total Emissions</p>
                <p className="text-3xl pt-6 px-6">100 <span className="text-primary-grey">tC02e</span></p>
            </div>

            <Divider orientation="vertical" />
            <div>
                <p className="text-small">Your Offset </p> <br/>
                <p className="text-3xl">7 <span className="text-primary-grey">tC02e</span></p>

            </div>
            <Divider orientation="vertical" />
            <div>
               <p className="text-small"> Your Reductions</p> <br/>
                <p className="text-3xl ">10 <span className="text-primary-grey">tC02e</span></p>
            </div>
          </div>
        </CardBody>
        </Card>

        <div className="pt-12 px-12 w-[full] gap-2 grid grid-cols-2 grid-rows-1">
            <Card>
                <CardBody>
                <div className="flex justify-between items-center p-4">
                    <p>Your Scope Breakdown</p>
                    </div>
                    
                    <div className="flex justify-between">
                        <div className="mx-12 space-y-4">

                        <div className="border-l-8 border-primary-600 pl-4">
                            <p className="text-xs text-primary-grey">Scope 1</p>
                            <h4 className="py-4 text-2xl font-bold">25,300 kg</h4>
                        </div>

                        <div className="border-l-8 border-primary-brown pl-4">
                            <p className="text-xs text-primary-grey">Scope 2</p>
                            <h4 className="py-4 text-2xl">32,000 kg</h4>
                        </div>

                        <div className="border-l-8 border-primary-green pl-4">
                           <p className="text-xs text-primary-grey">Scope 3</p>
                            <h4 className="py-4 text-2xl">75,000 kg</h4>
                        </div>

                        </div>
                        

                    <DonutChart/>

                    </div>
                   
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                <div className="flex justify-between items-center p-4">
                    <p>Your Emissions</p>
                    <p>FY2023</p>
                    </div>
                    <ApexChart/>
                </CardBody>
            </Card>
        </div>


        <div className="p-12 max-w-[full] gap-2 grid grid-cols-12 grid-rows-1">
            <Card className="col-span-12 sm:col-span-4 h-[195px]">
                <CardBody>
                    <div className="flex justify-between items-center">
                        <h3>
                            Net Zero</h3>
                        <Image
                            src="/images/external-link.svg"
                            width={20}
                            height={20}
                            alt=""
                            className="ml-auto"
                        />
                    </div>

                    <div className="items-center flex py-8">
                    <Image
                            src="/images/arrow-circle-up.svg"
                            alt=""
                            />
                            <h3 className="text-4xl px-4">1.3% above</h3>
                    </div>
                    <p className="text-xs">Industry average : 98t CO2e</p>
                </CardBody>
            </Card>

            <Card className="col-span-12 sm:col-span-4 h-[195px]">
                <CardBody>
                <div className="flex justify-between items-center">
                        <h3>
                            Bench Mark</h3>
                        <Image
                            src="/images/external-link.svg"
                            width={20}
                            height={20}
                            alt=""
                            className="ml-auto"
                        />
                    </div>

                    <div className="items-center flex py-8">
                    <Image
                            src="/images/arrow-circle-down.svg"
                            alt=""
                            />
                            <h3 className="text-4xl px-4">10% above</h3>
                    </div>
                    <p className="text-xs">Competitor average : 90t CO2e</p>

                </CardBody>
            </Card>

            <Card className="col-span-12 sm:col-span-4 h-[195px]">
                <CardBody>
                <div className="flex justify-between items-center">
                        <h3>
                            Baseline Yr</h3>
                        <Image
                            src="/images/external-link.svg"
                            width={20}
                            height={20}
                            alt=""
                            className="ml-auto"
                        />
                    </div>
                    <div className="items-center flex py-8">
                    <Image
                            src="/images/arrow-circle-up.svg"
                            alt=""
                            />
                            <h3 className="text-4xl px-4">1.3% above</h3>
                    </div>
                    <p className="text-xs">Baseline Emissions : 50t CO2e</p>

                </CardBody>
            </Card>

        </div>
        </>
      );
    }

