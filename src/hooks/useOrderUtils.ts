import { IQuoteDetails } from "@/types/QuoteDetails";
import { useApi } from "./useApi";
import { useCallback } from "react";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

type IUpdateNewQuotation = Omit<IQuoteDetails, "id" | "createdAt" | "updatedAt" | "order" | "isApproved" | "addedBy"> & {
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

	const updateNewQuotation = useCallback(
		async (data: IUpdateNewQuotation) => {
			const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.UPDATE_NEW_QUOTATION, data });

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

	return { updateNewQuotation, saveNewOrderTimeline };
};

export default useOrderUtils;
