import { IOrder } from "./Order";
import { IUser } from "./User";

export interface IOrderSiteVisitSchedule {
	id: string;
	createdAt: string;
	updatedAt: string;
	order: IOrder;
	eventDate: string;
	location: string;
	mapPin?: string;
	peercarbonReps: string[];
	addedBy: IUser;
	isApproved: boolean;
}