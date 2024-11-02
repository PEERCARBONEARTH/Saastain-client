import { StationaryCombustionAddVariant } from "./Appliances";
import { IBranch, ICompany } from "./Company";
import { FleetAddVariant } from "./Fleet";
import { IUser } from "./User";

export enum EquipmentAccess {
	GLOBAL = "global",
	BRANCH_SPECIFIC = "branch-specific",
}

export enum EquipmentStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	SUSPENDED = "suspended",
	DELETED = "deleted",
}

export interface IStationaryEquipment {
	id: string;
	createdAt: string;
	updatedAt: string;
	equipmentName: string;
	fuelState: string;
	fuelType: string;
	fuelUnit: string;
	category: string | StationaryCombustionAddVariant;
	accessibility: EquipmentAccess;
	createdBy?: IUser; // values might vary from time to time
	company?: ICompany; // same as above
	branch?: IBranch;
	status: EquipmentStatus;
}

export enum FleetMobilityAccess {
	GLOBAL = "global",
	BRANCH_SPECIFIC = "branch-specific",
}

export enum FleetMobilityStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	SUSPENDED = "suspended",
	DELETED = "deleted",
}

export interface IFleetMobility {
	id: string;
	createdAt: string;
	updatedAt: string;
	make: string;
	model: string[];
	category: string | FleetAddVariant;
	accessibility: FleetMobilityAccess;
	status: FleetMobilityStatus;
	createdBy?: IUser; // values might vary from time to time
	company?: ICompany; // same as above
	branch?: IBranch;
}

export enum ProcessingEquipmentCategory {
	PROCESSING = "processing",
	FUGITIVE = "fugitive",
}

export enum ProcessingEquipmentAccess {
	GLOBAL = "global",
	BRANCH_SPECIFIC = "branch-specific",
}

export enum ProcessingEquipmentStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	SUSPENDED = "suspended",
	DELETED = "deleted",
}

export interface IProcessingEquipment {
	id: string;
	createdAt: string;
	updatedAt: string;
	equipmentName: string;
	gasEmitted: string;
	emissionGasUnit: string;
	category: ProcessingEquipmentCategory;
	subCategory: string; // should be the variants in each categories
	status: ProcessingEquipmentStatus;
	accessibility: ProcessingEquipmentAccess;
	createdBy?: Pick<IUser, "id" | "name">;
	company?: Pick<ICompany, "id" | "companyName">;
	branch?: Pick<IBranch, "id" | "name">;
}
