import { IUser } from "./User";

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
