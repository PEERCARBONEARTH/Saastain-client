import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";

export default function CompanySummary() {
      return (
        <>
        <Card className="w-[full] h-[132px] mx-12">
        <CardBody>
            
          <div className="flex items-center space-x-60 text-xl">
            <div>
               <p>Total Emissions</p>  <br/>
                <p>100 tCO2e</p>

            </div>
            <Divider orientation="vertical" />
            <div>
                <p>Your Offset </p> <br/>
                <p>7 tCO2e</p>

            </div>
            <Divider orientation="vertical" />
            <div>
               <p> Your Reductions</p> <br/>
                <p>10 tCO2e</p>
            </div>
          </div>
        </CardBody>
        </Card>

        <div className="p-12 flex max-w-[full] gap-2 grid grid-cols-12 grid-rows-2 px-12">
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

