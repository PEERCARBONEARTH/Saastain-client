import { IUser } from "./User";

export enum BranchType {
	MAIN = "MAIN",
	SUBSIDIARY = "SUBSIDIARY",
	FRANCHISE = "FRANCHISE",
	SATELLITE = "SATELLITE",
}

export enum CompanyStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	SUSPENDED = "suspended",
	DELETED = "deleted",
}

export enum OrganizationalBoundaryType {
	FINANCIAL_CONTROL = "financial_control",
	OPERATIONAL_CONTROL = "operational_control",
	GEOGRAPHICAL_CONTROL = "geographical_control",
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
	companyStatus: CompanyStatus;
	organizationaBoundaryType?: OrganizationalBoundaryType;
	terms: boolean;
	stripeCustomerId?: string;
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
