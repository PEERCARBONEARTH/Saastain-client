"use client";

import { BreadcrumbItem, Breadcrumbs, Tab, Tabs } from "@nextui-org/react";
import BoilersAndFurnacesTab from "./BoilersAndFurnacesTab";
import { StationaryCombustionAddVariant } from "@/types/Appliances";
import GeneratorsTab from "./GeneratorsTab";
import KitchenAppliancesTab from "./KitchenAppliancesTab";
import HeatingAppliancesTab from "./HeatingAppliancesTab";
import { FleetAddVariant } from "@/types/Fleet";
import PassengerVehiclesTab from "./PassengerVehiclesTab";
import DeliveryVehiclesTab from "./DeliveryVehiclesTab";

const TeamEquipments = () => {
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Configuration</BreadcrumbItem>
				<BreadcrumbItem>Team</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-4">
				<h1 className="text-2xl font-bold text-primary-800">Team Equipments</h1>
				<div className="mt-2">
					<hr className="border-saastain-gray border-1" />
				</div>
				<div className="mt-6 space-y-2">
					<h2 className="text-lg font-semibold text-primary-800">Manage Equipments</h2>
					<p className="text-sm text-gray-600 w-full md:w-[80%]">
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
					</p>
				</div>
				<div className="mt-6">
					<Tabs aria-label="Team Equipments Tabs" color="primary" variant="underlined">
						<Tab key={StationaryCombustionAddVariant.BOILERS_FURNACES} title={"Boilers And Furnaces"}>
							<BoilersAndFurnacesTab />
						</Tab>
						<Tab key={StationaryCombustionAddVariant.GENERATORS} title={"Generators"}>
							<GeneratorsTab />
						</Tab>
						<Tab key={StationaryCombustionAddVariant.KITCHEN_APPLIANCES} title={"Kitchen Appliances"}>
							<KitchenAppliancesTab />
						</Tab>
						<Tab key={StationaryCombustionAddVariant.HEATER} title={"Heater"}>
							<HeatingAppliancesTab />
						</Tab>
						<Tab key={FleetAddVariant.PASSENGER} title={"Passenger Vehicles"}>
							<PassengerVehiclesTab />
						</Tab>
						<Tab key={FleetAddVariant.DELIVERY} title={"Delivery Vehicles"}>
							<DeliveryVehiclesTab />
						</Tab>
					</Tabs>
				</div>
			</div>
		</>
	);
};

export default TeamEquipments;
