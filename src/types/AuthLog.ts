import { AccountStatus, AuthProvider } from "./User";

export enum AuthLogStatus {
	SUCCESS = "success",
	FAILED = "failed",
}

export interface IAuthLog {
	id: string;
	createdAt: string;
	updatedAt: string;
	ipAddr: string;
	email: string;
	status: AuthLogStatus;
	authProvider: AuthProvider;
	user?: {
		id: string;
		name: string;
		email: string;
		accountStatus: AccountStatus;
	};
	company?: {
		id: string;
		companyName: string;
	};
}