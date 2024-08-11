import { IOrder } from "./Order";
import { IUser } from "./User";

export interface IQuoteDetails {
	id: string;
	createdAt: string;
	updatedAt: string;
	order: IOrder;
	totalArea: string;
	variantsInfo: {
		variant: string;
		code: string;
		unitPrice: number;
		quantity: number;
		status?: string;
	}[];
	installationCost: number;
	maintenanceCost: number;
	totalCost: number;
	documents: {
		id: string;
		name: string;
		url: string;
	}[];
	anyOtherFeedback?: string;
	addedBy: IUser;
	isApproved: boolean;
}