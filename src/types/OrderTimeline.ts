import { IOrder } from "./Order";

export interface IOrderTimeline {
	id: string;
	createdAt: string;
	updatedAt: string;
	order: IOrder;
	code: string;
	title: string;
	description: string;
	otherData?: string;
}