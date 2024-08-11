import { ICompany } from "./Company";

export enum SystemRole {
	SYSTEM_ADMIN = "system_admin",
	ADMIN = "admin",
	COMPANY_ADMIN = "company_admin",
	COMPANY_USER = "company_user",
	GUEST = "guest",
}

export enum AuthProvider {
	EMAIL = "email",
	GOOGLE = "google",
}

export enum AccountStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	SUSPENDED = "suspended",
	DELETED = "deleted",
}

export interface IUser {
	name: string;
	email: string;
	password?: string;
	verified?: boolean;
	roleInCompany?: string;
	systemRole: SystemRole;
	authProvider: AuthProvider;
	isEmailVerified: boolean;
	accountStatus: AccountStatus;
	company?: ICompany;
	profilePicture?: string;
	token?: string;
	createdAt?: string;
	updatedAt?: string;
	id: string;
	tokenExpiresAt?: Date;
	isCompanyAdmin?: boolean
	isOnboardingComplete?: boolean
}
