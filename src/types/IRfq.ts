import { ICompany } from "./Company";
import { IGreenProduct } from "./GreenProduct";
import { IOrder } from "./Order";
import { IUser } from "./User";

export enum RfqStatus {
	PENDING = "pending",
	INPROGRESS = "in-progress",
	COMPLETED = "completed",
}

export interface IRFQ {
	id: string;
	createdAt: string;
	updatedAt: string;
	product: IGreenProduct;
	company: ICompany;
	requestedBy: IUser;
	status: RfqStatus;
	order: IOrder;
}
