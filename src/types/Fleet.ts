import { IAddEquipmentModalInfo } from "./Appliances";

export enum FleetAddVariant {
	PASSENGER = "passenger",
	DELIVERY = "delivery",
}


export type TAddFleetModalData = Record<FleetAddVariant, IAddEquipmentModalInfo>;
