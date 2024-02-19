import { Button, Card, CardBody } from "@nextui-org/react";
import Image from "next/image";

export default function AddDataCards() {
    return(
        <div className="max-w-[full] gap-6 grid grid-cols-12 grid-rows-2 ">
        <Card className="col-span-12 sm:col-span-4 h-[195px] mb-12 bg-[#FCF5EB]">
            <CardBody>
                <div className="flex justify-between items-center">
                    <h3 className="text-xs pl-4">Scope 1</h3>
                </div>
                <h3 className="text-normal py-2">Stationary Combustion</h3>
                <p className="text-small py-2">Record emissions data from stationary sources such as heating, cooling, boilers and power generation</p>
                
					<Image
						src="/images/Side-link.svg"
						width={50}
						height={20}
						alt="Picture of the author"
                        className="ml-auto mr-12"
					/>
						
            </CardBody>
        </Card>

        <Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
            <CardBody>
                <div className="flex justify-between items-center">
                    <h3 className="text-xs pl-4">Scope 1</h3>
                </div>
                <h3 className="text-normal py-2">Fleet Emissions</h3>
                <p className="text-small py-2">
                Track emissions data related to mobile sources, including your vehicles, transportation activities and mobile machines
                    </p>
                
					<Image
						src="/images/Side-link.svg"
						width={50}
						height={20}
						alt="Picture of the author"
                        className="ml-auto mr-12"
					/>
						
            </CardBody>
        </Card>

        <Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
            <CardBody>
                <div className="flex justify-between items-center">
                    <h3 className="text-xs pl-4">Scope 1</h3>
                </div>
                <h3 className="text-normal py-2">Processing Emissions</h3>
                <p className="text-small py-2">
                Record emissions data associated with industrial activities , processing activities and chemical reactions in your processes.
                    </p>
                
					<Image
						src="/images/Side-link.svg"
						width={50}
						height={20}
						alt="Picture of the author"
                        className="ml-auto mr-12"
					/>
						
            </CardBody>
        </Card>

        <Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
            <CardBody>
                <div className="flex justify-between items-center">
                    <h3 className="text-xs pl-4">Scope 2</h3>
                </div>
                <h3 className="text-normal py-2">Fugitive Emissions</h3>
                <p className="text-small py-2">
                Track emissions arising from unintentional leaks, venting, or other fugitive sources such as your refrigerations.
                    </p>
                
					<Image
						src="/images/Side-link.svg"
						width={50}
						height={20}
						alt="Picture of the author"
                        className="ml-auto mr-12"
					/>
						
            </CardBody>
        </Card>

        <Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
            <CardBody>
                <div className="flex justify-between items-center">
                    <h3 className="text-xs pl-4">Scope 2</h3>
                </div>
                <h3 className="text-normal py-2">Heating & Cooling</h3>
                <p className="text-small py-2">
                Record emissions related to your company’s temperature control systems, including heating and cooling.
                    </p>
                
					<Image
						src="/images/Side-link.svg"
						width={50}
						height={20}
						alt="Picture of the author"
                        className="ml-auto mr-12"
					/>
						
            </CardBody>
        </Card>

        <Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
            <CardBody>
                <div className="flex justify-between items-center">
                    <h3 className="text-xs pl-4">Scope 2</h3>
                </div>
                <h3 className="text-normal py-2">Electricity Consumptions</h3>
                <p className="text-small py-2">
                Track emissions from your electricity and energy usage
                    </p>
                
					<Image
						src="/images/Side-link.svg"
						width={50}
						height={20}
						alt="Picture of the author"
                        className="ml-auto mr-12"
					/>
						
            </CardBody>
        </Card>

        <Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
            <CardBody>
                <div className="flex justify-between items-center">
                    <h3 className="text-xs pl-4">Scope 3</h3>
                </div>
                <h3 className="text-normal py-2">Employee Commuting</h3>
                <p className="text-small py-2">
                Measure emissions from employee transportation to and from work.
                </p>
                
					<Image
						src="/images/Side-link.svg"
						width={50}
						height={20}
						alt="Picture of the author"
                        className="ml-auto mr-12"
					/>
						
            </CardBody>
        </Card>

        <Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
            <CardBody>
                <div className="flex justify-between items-center">
                    <h3 className="text-xs pl-4">Scope 3</h3>
                </div>
                <h3 className="text-normal py-2">Business Travel</h3>
                <p className="text-small py-2">
                Track emissions associated with corporate travel and transportation.
                </p>
                
					<Image
						src="/images/Side-link.svg"
						width={50}
						height={20}
						alt="Picture of the author"
                        className="ml-auto mr-12"
					/>
						
            </CardBody>
        </Card>

        <Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
            <CardBody>
                <div className="flex justify-between items-center">
                    <h3 className="text-xs pl-4">Scope 3</h3>
                </div>
                <h3 className="text-normal py-2">Purchased Goods & Services</h3>
                <p className="text-small py-2">
                Estimate emissions from all goods and services procured and purchased by your company.
                    </p>
                
					<Image
						src="/images/Side-link.svg"
						width={50}
						height={20}
						alt="Picture of the author"
                        className="ml-auto mr-12"
					/>				
            </CardBody>
        </Card>

        </div>
    )
}