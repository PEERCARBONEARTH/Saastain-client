import { IUser } from "./User";

export enum BranchType {
	MAIN = "Main",
	SUBSIDIARY = "Subsidiary",
	FRANCHISE = "Franchise",
	SATELLITE = "Satellite",
}

export interface ICompany {
	companyName: string;
	primaryEmail: string;
	phoneNo: string;
	location: string;
	corporateNumber?: string;
	industry?: string;
	website?: string;
	businessType?: string;
	description?: string;
	logo?: string;
	users?: IUser[];
	updatedAt?: string;
	createdAt?: string;
	id: string;
}

export interface IBranch {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	type: string;
	address: string;
	coordinates?: string;
	isMainOffice: boolean;
	company?: ICompany;
	users?: IUser;
}
