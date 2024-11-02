import { IAddEquipmentModalInfo } from "./Appliances";

export enum FugitiveAddVariant {
	AIR_CONDITIONING_SYSTEMS = "air-conditioning-systems",
	REFRIGERATION_UNITS = "refrigeration-units",
	LEAK_DETECTION = "leak-detection",
}

export enum ProcessingEmissionAddVariant {
	INDUSTRIAL_EQUIPMENTS = "industrial-equipments",
	CHEMICAL_REACTIONS = "chemical-reactions",
}

export type ProcessingFugitiveKeyType = FugitiveAddVariant | ProcessingEmissionAddVariant;

export type TAddProcessingEquipmentModalData<T extends string = FugitiveAddVariant> = Record<T, IAddEquipmentModalInfo>;
