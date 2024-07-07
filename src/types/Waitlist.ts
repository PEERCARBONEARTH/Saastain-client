export enum WailistStatus {
	PENDING = "pending",
	IN_PROGRESS = "in_progress",
	APPROVED = "approved",
	CANCELLED = "cancelled",
}

export interface IWaitlist {
	id: string;
	name?: string;
	email: string;
	phoneNo?: string;
	companyName?: string;
	companyWebsite?: string;
	status: WailistStatus;
	createdAt: Date;
	updatedAt: Date;
}
