import { ICompany } from "./Company";

export enum InviteStatus {
	PENDING = "pending",
	ACCEPTED = "accepted",
	REVOKED = "revoked",
}

export interface IInvite {
	id: string;
	createdAt: string;
	updatedAt: string;
	inviteCode: string;
	company?: ICompany;
	email: string;
	name: string;
	isRevoked: boolean;
	expiresAt: string;
	userRole: string;
	branchId: string;
	status: InviteStatus;
}
