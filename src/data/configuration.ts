import { StationaryCombustionAddVariant, TAddEquipmentModalData } from "@/types/Appliances";
import { FleetAddVariant, TAddFleetModalData } from "@/types/Fleet";

export const stationaryCombustionAddEquipmentData = {
	[StationaryCombustionAddVariant.BOILERS_FURNACES]: {
		title: "Boilers & Furnaces",
		description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis",
		tooltipText: "Sed ut perspiciatis unde omnis iste natus error sit",
	},
	[StationaryCombustionAddVariant.GENERATORS]: {
		title: "Generators",
		description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis",
		tooltipText: "Sed ut perspiciatis unde omnis iste natus error sit",
	},
	[StationaryCombustionAddVariant.HEATER]: {
		title: "Heater",
		description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis",
		tooltipText: "Sed ut perspiciatis unde omnis iste natus error sit",
	},
	[StationaryCombustionAddVariant.KITCHEN_APPLIANCES]: {
		title: "Kitchen Appliances",
		description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis",
		tooltipText: "Sed ut perspiciatis unde omnis iste natus error sit",
	},
} satisfies TAddEquipmentModalData;

export const fleetsDataInfo = {
	[FleetAddVariant.DELIVERY]: {
		title: "Delivery Vehicles",
		description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis",
		tooltipText: "Sed ut perspiciatis unde omnis iste natus error sit",
	},
	[FleetAddVariant.PASSENGER]: {
		title: "Passenger Vehicles",
		description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis",
		tooltipText: "Sed ut perspiciatis unde omnis iste natus error sit",
	},
} satisfies TAddFleetModalData;
