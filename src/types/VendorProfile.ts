import { IUser } from "./User";

export enum VendorStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	SUSPENDED = "suspended",
	DELETED = "deleted",
}

export interface IVendorProfile {
	id: string;
	companyName: string;
	website?: string;
	phoneNo?: string;
	createdBy?: IUser;
	status: VendorStatus;
    createdAt: string;
    updatedAt: string;
}
