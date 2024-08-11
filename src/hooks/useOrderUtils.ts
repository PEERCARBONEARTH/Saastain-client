import { IOrderSiteVisitSchedule } from "@/types/OrderSiteVisitSchedule";
import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { OrderStatus } from "@/types/Order";

type ISaveSiteVisitSchedule = Pick<IOrderSiteVisitSchedule, "eventDate" | "location" | "peercarbonReps"> & {
	addedBy: string;
	orderId: string;
};

interface SaveNewOrderTimelineType {
	orderId: string;
	code: string;
	title: string;
	description: string;
	otherData?: string;
}

type TRescheduleSiteVisitData = Pick<ISaveSiteVisitSchedule, "eventDate" | "location" | "peercarbonReps">;

const useOrderUtils = () => {
	const { post, put } = useApi();
	const saveNewOrderSchedule = useCallback(
		async (data: ISaveSiteVisitSchedule) => {
			const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.SAVE_NEW_SITE_VISIT_SCHEDULE, data });

			return resp.data;
		},
		[post]
	);

	const saveNewOrderTimeline = useCallback(
		async (data: SaveNewOrderTimelineType) => {
			const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.SAVE_NEW_ORDER_TIMELINE, data });

			return resp.data;
		},
		[post]
	);

	const confirmSiteVisit = useCallback(async (visitId: string) => {
		const resp = await put<IApiResponse>({ endpoint: `${IApiEndpoint.APPROVE_SITE_VISIT}/${visitId}` as IApiEndpoint });

		return resp.data;
	}, []);

	const rescheduleSiteVisit = useCallback(
		async (visitId: string, data: TRescheduleSiteVisitData) => {
			const resp = await put<IApiResponse>({ endpoint: `${IApiEndpoint.RESCHEDULE_SITE_VISIT}/${visitId}` as IApiEndpoint, data });

			return resp.data;
		},
		[put]
	);

	const updateOrderStatus = useCallback(
		async (orderId: string, newStatus: OrderStatus) => {
			const resp = await put<IApiResponse>({ endpoint: `${IApiEndpoint.UPDATE_ORDER_STATUS}/${orderId}/${newStatus}` as IApiEndpoint });

			return resp.data
		},
		[put]
	);

	return { saveNewOrderSchedule, saveNewOrderTimeline, confirmSiteVisit, rescheduleSiteVisit, updateOrderStatus };
};

export default useOrderUtils;
