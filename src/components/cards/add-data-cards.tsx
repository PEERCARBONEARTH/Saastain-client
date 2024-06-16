import { Button, Card, CardBody } from "@nextui-org/react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

export default function AddDataCards() {
	return (
		<div className="max-w-[full] gap-6 grid grid-cols-12 grid-rows-2 ">
			<Card className="col-span-12 sm:col-span-4 h-[195px] mb-12 bg-[#FCF5EB]">
				<CardBody>
					<div className="flex justify-between items-center">
						<h3 className="text-xs pl-4">Scope 1</h3>
					</div>
					<h3 className="text-normal py-2">Stationary Combustion</h3>
					<p className="text-small py-2">Record emissions data from stationary sources such as heating, cooling, boilers and power generation</p>
					<Link href={"/accounting/add-data/stationary-combustion"} className="ml-auto">
						<Button color="primary" startContent={<FaArrowRightLong className="w-4 h-4" />} size="md" className="w-[0.5px] bg-[#CFA16C] ml-auto mr-12" />
					</Link>
				</CardBody>
			</Card>

			<Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
				<CardBody>
					<div className="flex justify-between items-center">
						<h3 className="text-xs pl-4">Scope 1</h3>
					</div>
					<h3 className="text-normal py-2">Fleet Emissions</h3>
					<p className="text-small py-2">Track emissions data related to mobile sources, including your vehicles, transportation activities and mobile machines</p>

					<Link href={"/accounting/add-data/fleet-emissions"} className="ml-auto">
						<Button color="primary" startContent={<FaArrowRightLong className="w-4 h-4" />} size="md" className="w-[0.5px] bg-[#CFA16C] ml-auto mr-12" />
					</Link>
				</CardBody>
			</Card>

			<Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
				<CardBody>
					<div className="flex justify-between items-center">
						<h3 className="text-xs pl-4">Scope 1</h3>
					</div>
					<h3 className="text-normal py-2">Processing Emissions</h3>
					<p className="text-small py-2">Record emissions data associated with industrial activities , processing activities and chemical reactions in your processes.</p>

					<Link href={"/accounting/add-data/processing-emissions"} className="ml-auto">
						<Button color="primary" startContent={<FaArrowRightLong className="w-4 h-4" />} size="md" className="w-[0.5px] bg-[#CFA16C] ml-auto mr-12" />
					</Link>
				</CardBody>
			</Card>

			<Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
				<CardBody>
					<div className="flex justify-between items-center">
						<h3 className="text-xs pl-4">Scope 2</h3>
					</div>
					<h3 className="text-normal py-2">Fugitive Emissions</h3>
					<p className="text-small py-2">Track emissions arising from unintentional leaks, venting, or other fugitive sources such as your refrigerations.</p>

					<Link href={"/accounting/add-data/fugitive-emission"} className="ml-auto">
						<Button color="primary" startContent={<FaArrowRightLong className="w-4 h-4" />} size="md" className="w-[0.5px] bg-[#CFA16C] ml-auto mr-12" />
					</Link>
				</CardBody>
			</Card>

			<Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
				<CardBody>
					<div className="flex justify-between items-center">
						<h3 className="text-xs pl-4">Scope 2</h3>
					</div>
					<h3 className="text-normal py-2">Heating & Cooling</h3>
					<p className="text-small py-2">Record emissions related to your company’s temperature control systems, including heating and cooling.</p>

					<Link href={"/accounting/add-data/heat-and-cooling"} className="ml-auto">
						<Button color="primary" startContent={<FaArrowRightLong className="w-4 h-4" />} size="md" className="w-[0.5px] bg-[#CFA16C] ml-auto mr-12" />
					</Link>
				</CardBody>
			</Card>

			<Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
				<CardBody>
					<div className="flex justify-between items-center">
						<h3 className="text-xs pl-4">Scope 2</h3>
					</div>
					<h3 className="text-normal py-2">Electricity Consumptions</h3>
					<p className="text-small py-2">Track emissions from your electricity and energy usage</p>

					<Link href={"/accounting/add-data/electricity"} className="ml-auto">
						<Button color="primary" startContent={<FaArrowRightLong className="w-4 h-4" />} size="md" className="w-[0.5px] bg-[#CFA16C] ml-auto mr-12" />
					</Link>
				</CardBody>
			</Card>

			{/* <Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
				<CardBody>
					<div className="flex justify-between items-center">
						<h3 className="text-xs pl-4">Scope 3</h3>
					</div>
					<h3 className="text-normal py-2">Employee Commuting</h3>
					<p className="text-small py-2">Measure emissions from employee transportation to and from work.</p>

					<Link href={"/accounting/add-data/fugitive-emission"} className="ml-auto">
						<Button color="primary" startContent={<FaArrowRightLong className="w-4 h-4" />} size="md" className="w-[0.5px] bg-[#CFA16C] ml-auto mr-12" />
					</Link>
				</CardBody>
			</Card>

			<Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
				<CardBody>
					<div className="flex justify-between items-center">
						<h3 className="text-xs pl-4">Scope 3</h3>
					</div>
					<h3 className="text-normal py-2">Business Travel</h3>
					<p className="text-small py-2">Track emissions associated with corporate travel and transportation.</p>

					<Link href={"/accounting/add-data/fugitive-emission"} className="ml-auto">
						<Button color="primary" startContent={<FaArrowRightLong className="w-4 h-4" />} size="md" className="w-[0.5px] bg-[#CFA16C] ml-auto mr-12" />
					</Link>
				</CardBody>
			</Card>

			<Card className="col-span-12 sm:col-span-4 h-[195px] bg-[#FCF5EB]">
				<CardBody>
					<div className="flex justify-between items-center">
						<h3 className="text-xs pl-4">Scope 3</h3>
					</div>
					<h3 className="text-normal py-2">Purchased Goods & Services</h3>
					<p className="text-small py-2">Estimate emissions from all goods and services procured and purchased by your company.</p>

					<Link href={"/accounting/add-data/fugitive-emission"} className="ml-auto">
						<Button color="primary" startContent={<FaArrowRightLong className="w-4 h-4" />} size="md" className="w-[0.5px] bg-[#CFA16C] ml-auto mr-12" />
					</Link>
				</CardBody>
			</Card> */}
		</div>
	);
}
