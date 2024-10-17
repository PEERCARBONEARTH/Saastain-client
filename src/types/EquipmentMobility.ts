import { StationaryCombustionAddVariant } from "./Appliances";
import { IBranch, ICompany } from "./Company";
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
