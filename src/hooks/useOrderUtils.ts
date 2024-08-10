import { IOrderSiteVisitSchedule } from "@/types/OrderSiteVisitSchedule";
import { useCallback } from "react";
import { useApi } from "./useApi";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

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

const useOrderUtils = () => {
	const { post } = useApi();
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

	return { saveNewOrderSchedule, saveNewOrderTimeline };
};

export default useOrderUtils;
