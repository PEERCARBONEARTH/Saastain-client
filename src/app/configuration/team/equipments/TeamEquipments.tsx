"use client";

import { BreadcrumbItem, Breadcrumbs, Tab, Tabs } from "@heroui/react";
import BoilersAndFurnacesTab from "./BoilersAndFurnacesTab";
import { StationaryCombustionAddVariant } from "@/types/Appliances";
import GeneratorsTab from "./GeneratorsTab";
import KitchenAppliancesTab from "./KitchenAppliancesTab";
import HeatingAppliancesTab from "./HeatingAppliancesTab";
import { FleetAddVariant } from "@/types/Fleet";
import PassengerVehiclesTab from "./PassengerVehiclesTab";
import DeliveryVehiclesTab from "./DeliveryVehiclesTab";
import useSWR from "swr";
import { IBranch } from "@/types/Company";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { FugitiveAddVariant, ProcessingEmissionAddVariant } from "@/types/ProcessingAndFugitive";
import ProcessingFugitiveEquipmentsTab from "./ProcessingFugitiveEquipmentsTab";
import { ProcessingEquipmentCategory } from "@/types/EquipmentMobility";

const TeamEquipments = () => {
	const { data: session } = useSession();
	const id = session?.user?.company?.id;
	const { data: branchInfo } = useSWR<IBranch[]>(!id ? null : [IApiEndpoint.GET_COMPANY_BRANCHES, { id }], swrFetcher, {
		keepPreviousData: true,
	});

	return (
		<AuthRedirectComponent>
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
						In this section you can be able to configure all the equipments, vehicles and appliances that are used by your organization in order to track your emissions easily.
					</p>
				</div>
				<div className="mt-6">
					<Tabs fullWidth aria-label="Team Equipments Tabs" color="primary" variant="underlined">
						<Tab key={StationaryCombustionAddVariant.BOILERS_FURNACES} title={"Boilers And Furnaces"}>
							<BoilersAndFurnacesTab branchesData={branchInfo} />
						</Tab>
						<Tab key={StationaryCombustionAddVariant.GENERATORS} title={"Generators"}>
							<GeneratorsTab branchesData={branchInfo} />
						</Tab>
						<Tab key={StationaryCombustionAddVariant.KITCHEN_APPLIANCES} title={"Kitchen Appliances"}>
							<KitchenAppliancesTab branchesData={branchInfo} />
						</Tab>
						<Tab key={StationaryCombustionAddVariant.HEATER} title={"Heating Appliances"}>
							<HeatingAppliancesTab branchesData={branchInfo} />
						</Tab>
						<Tab key={FleetAddVariant.PASSENGER} title={"Passenger Vehicles"}>
							<PassengerVehiclesTab branchesData={branchInfo} />
						</Tab>
						<Tab key={FleetAddVariant.DELIVERY} title={"Delivery Vehicles"}>
							<DeliveryVehiclesTab branchesData={branchInfo} />
						</Tab>
						<Tab key={ProcessingEmissionAddVariant.CHEMICAL_REACTIONS} title={"Chemical Reactions"}>
							<ProcessingFugitiveEquipmentsTab branchesData={branchInfo} category={ProcessingEquipmentCategory.PROCESSING} subCategory={ProcessingEmissionAddVariant.CHEMICAL_REACTIONS} />
						</Tab>
						<Tab key={ProcessingEmissionAddVariant.INDUSTRIAL_EQUIPMENTS} title={"Industrial Equipments"}>
							<ProcessingFugitiveEquipmentsTab branchesData={branchInfo} category={ProcessingEquipmentCategory.PROCESSING} subCategory={ProcessingEmissionAddVariant.INDUSTRIAL_EQUIPMENTS} />
						</Tab>
						<Tab key={FugitiveAddVariant.AIR_CONDITIONING_SYSTEMS} title={"Air Conditioning System"}>
							<ProcessingFugitiveEquipmentsTab branchesData={branchInfo} category={ProcessingEquipmentCategory.FUGITIVE} subCategory={FugitiveAddVariant.AIR_CONDITIONING_SYSTEMS} />
						</Tab>
						<Tab key={FugitiveAddVariant.REFRIGERATION_UNITS} title={"Refrigeration Units"}>
							<ProcessingFugitiveEquipmentsTab branchesData={branchInfo} category={ProcessingEquipmentCategory.FUGITIVE} subCategory={FugitiveAddVariant.REFRIGERATION_UNITS} />
						</Tab>
						<Tab key={FugitiveAddVariant.LEAK_DETECTION} title={"Leak Detection & Repair"}>
							<ProcessingFugitiveEquipmentsTab branchesData={branchInfo} category={ProcessingEquipmentCategory.FUGITIVE} subCategory={FugitiveAddVariant.LEAK_DETECTION} />
						</Tab>
					</Tabs>
				</div>
			</div>
		</AuthRedirectComponent>
	);
};

export default TeamEquipments;
