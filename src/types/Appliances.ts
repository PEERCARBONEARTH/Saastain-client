export enum StationaryCombustionAddVariant {
	BOILERS_FURNACES = "boilers-and-furnaces",
	GENERATORS = "generators",
	KITCHEN_APPLIANCES = "kitchen-appliances",
	HEATER = "heater",
}

export interface IAddEquipmentModalInfo {
    title: string;
    description: string;
    tooltipText: string
}

export type TAddEquipmentModalData = Record<StationaryCombustionAddVariant, IAddEquipmentModalInfo>;
