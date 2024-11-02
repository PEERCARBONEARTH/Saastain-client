import { StationaryCombustionAddVariant, TAddEquipmentModalData } from "@/types/Appliances";
import { FleetAddVariant, TAddFleetModalData } from "@/types/Fleet";

export const stationaryCombustionAddEquipmentData = {
	[StationaryCombustionAddVariant.BOILERS_FURNACES]: {
		title: "Boilers & Furnaces",
		description: "Type of Equipments used by your boilers & furnaces to be used in recording fuel consumption",
		tooltipText: "Add Boiler/Furnace Equipment",
	},
	[StationaryCombustionAddVariant.GENERATORS]: {
		title: "Generators",
		description: "Record the Generators so as to track fuel consumption used by your backup generator.",
		tooltipText: "Generators",
	},
	[StationaryCombustionAddVariant.HEATER]: {
		title: "Heater",
		description: "Record the heating appliances you use",
		tooltipText: "Heating applicances",
	},
	[StationaryCombustionAddVariant.KITCHEN_APPLIANCES]: {
		title: "Kitchen Appliances",
		description: "Record the appliances used in your kitchen.",
		tooltipText: "Kitchen appliances information",
	},
} satisfies TAddEquipmentModalData;

export const fleetsDataInfo = {
	[FleetAddVariant.DELIVERY]: {
		title: "Delivery Vehicles",
		description: "Record the vehicles used for company deliveries (e.g., company supplies , notebooks ,pens )",
		tooltipText: "This make it easy for analyzing the emissions of the vehicles used for supplies",
	},
	[FleetAddVariant.PASSENGER]: {
		title: "Passenger Vehicles",
		description: "Record the company-owned vehicles used for transporting staff/students e.t.c",
		tooltipText: "This make it easy for analyzing the emissions of the vehicles used for transportation",
	},
} satisfies TAddFleetModalData;
