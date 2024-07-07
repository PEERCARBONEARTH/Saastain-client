export enum VendorInterestStatus {
	PENDING = "pending",
	IN_PROGRESS = "in_progress",
	APPROVED = "approved",
	CANCELLED = "cancelled",
	REJECTED = "rejected",
}

export interface IVendorInterest {
	id: string;
	companyName: string;
	website?: string;
	vendorName: string;
	vendorPhoneNo?: string;
	vendorEmail: string;
	status: VendorInterestStatus;
}
