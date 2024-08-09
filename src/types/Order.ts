import { ICompany } from "./Company";
import { IGreenProduct } from "./GreenProduct";
import { IUser } from "./User";
import { IVendorProfile } from "./VendorProfile";

export enum OrderStatus {
	PENDING = "pending", // rfq not checked
	IN_PROGRESS = "in-progress", // go ahead with loan app
	COMPLETED = "completed", // project completed
	REJECTED = "rejected", // either by peercarbon or vendor
	ACCEPTED = "accepted", // accpted for financing and manufacturing
	REVERTED = "reverted", // requires more info (not rejected yet)
	IN_LOAN_REVIEW = "in-loan-review", // being reviewed for financing or quoting
	APPROVED_BY_SME = "approved-by-sme",
	FINANCING_APPROVED = "financing-approved",
	REJECTED_BY_SME = "rejected-by-sme",
}

export const enum OrderStage {
	NEW_ORDER = "new-order",
	RFQ = "rfq",
	LOAN_APPLICATION = "loan-application",
	FINANCING = "financing",
	DISBURSEMENT_FINANCE = "disbursement-finance",
	MANUFACTURING = "manufacturing",
	DELIVERY = "delivery",
	INSTALLATION = "installation",
	COMPLETION = "completion",
}

export interface IOrder {
	id: string;
	createdAt: string;
	updatedAt: string;
	orderCode: string;
	orderStage: string;
	initiatedBy: IUser;
	company: ICompany;
	vendor: IVendorProfile;
	product: IGreenProduct;
	status: OrderStatus;
}